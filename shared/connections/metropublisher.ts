import uuid from 'react-native-uuid';
// import { Buffer } from 'react-native-buffer';
import RNFS from 'react-native-fs';
import * as mime from 'react-native-mime-types';
// import DomSelector from 'react-native-dom-parser';
// @ts-ignore
import ExifReader from '../../node_modules/exifreader/src/exif-reader.js';

import { ArticleType, ConnectionType } from '@/shared/Types';
import { ACTIONS } from '@/shared/ConnectionReducer';
import { makeUrlName } from '@/shared/utils';

const Buffer = require('buffer/').Buffer;

const pauseTimeMs = 1000;
const API_URL = 'https://api.metropublisher.com';
const AUTH_PROVIDER = 'https://go.vanguardistas.net';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const fMonth = month < 10 ? '0' + month : month;
  const day = date.getDay();
  const fDay = day < 10 ? '0' + day : day;
  const hour = date.getHours();
  const fHour = hour < 10 ? '0' + hour : hour;
  const minute = date.getMinutes();
  const fMinute = minute < 10 ? '0' + minute : minute;
  const second = date.getSeconds();
  const fSecond = second < 10 ? '0' + second : second;
  return `${year}-${fMonth}-${fDay}T${fHour}:${fMinute}:${fSecond}`;
};

const encodeParams = (p: Object) =>
  Object.entries(p)
    .map(kv => kv.map(encodeURIComponent).join('='))
    .join('&');

type tokenData = {
  grant_type: string;
  api_key: string;
  api_secret: string;
};

const getToken = async (data: tokenData) => {
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

  const encData = encodeParams(data);
  const result = await fetch(`${AUTH_PROVIDER}/oauth/token`, {
    method: 'POST',
    headers: headers,
    body: encData,
  });
  const response = await result.text();
  const json = JSON.parse(response);
  return json;
};

const renewAccessToken = async (
  connection: ConnectionType,
  dispatch: Function,
) => {
  const data = {
    grant_type: 'client_credentials',
    api_key: connection.key,
    api_secret: connection.secret,
  };
  const token = await getToken(data);
  dispatch({
    type: ACTIONS.SET_ACCESS_TOKEN,
    payload: {
      connectionId: connection.id,
      access_token: token.access_token,
    },
  });
  return token.access_token;
};

const retryFetch = async (
  connection: ConnectionType,
  dispatch: Function,
  url: string,
  contentType: string,
  method: string,
  body: string | Buffer,
) => {
  // we retry request s 5 times on retryable errors
  let attempt = 1;
  let access_token = connection.access_token;
  while (attempt <= 5) {
    console.log('ATTEMPT', attempt, url, method);

    // console.log('OLD ACCESS TOKEN', access_token);
    if (!access_token) {
      // get token
      access_token = await renewAccessToken(connection, dispatch);
      // console.log('NEW ACCESS TOKEN', access_token);
    }

    const auth_header = `bearer ${access_token}`;
    const headers = {
      Authorization: auth_header,
      'User-Agent': 'escriptor',
      'Content-Type': contentType,
    };
    const result = await fetch(url, {
      method: method,
      headers: headers,
      body: body,
    });
    // console.log(result, method, headers, body);
    if (result.status === 200) {
      return result;
    }
    if (result.status === 401) {
      // unauthorized so we need a new access token
      access_token = '';
    }
    // we only retry the request for unauthoriesed (401) or temporary unavailable (503)
    if ([401, 503].indexOf(result.status) === -1) {
      console.log('Not retriable result status.', result.status);
      throw new Error('Could not connect to the API.');
    }
    attempt += 1;
    // pause between API to avoid overloading the API
    await new Promise(resolve => setTimeout(resolve, pauseTimeMs));
  }
  throw new Error('Too many unsuccessfull requests');
};

export const putAuthorTag = async (
  connection: ConnectionType,
  dispatch: Function,
  firstName: string,
  lastName: string,
) => {
  const urlname = makeUrlName(`${firstName} ${lastName}`);
  const tagId = uuid.v4() as string;

  const data = {
    type: 'person',
    first_name: firstName,
    last_name_or_title: lastName,
    urlname,
    state: 'approved',
  };
  console.log('ADD TAG', tagId, data);
  // Add the tag
  await retryFetch(
    connection,
    dispatch,
    `${API_URL}/${connection.instanceId}/tags/${tagId}`,
    'application/json',
    'PUT',
    JSON.stringify(data),
  );
  return tagId;
};

export const putTag = async (
  connection: ConnectionType,
  dispatch: Function,
  title: string,
) => {
  const urlname = makeUrlName(title);
  const tagId = uuid.v4() as string;

  const data = {
    type: 'default',
    last_name_or_title: title,
    urlname,
    state: 'approved',
  };
  console.log('ADD TAG', tagId, data);
  // Add the tag
  await retryFetch(
    connection,
    dispatch,
    `${API_URL}/${connection.instanceId}/tags/${tagId}`,
    'application/json',
    'PUT',
    JSON.stringify(data),
  );
  return tagId;
};

export const tagArticle = async (
  connection: ConnectionType,
  dispatch: Function,
  tagId: string,
  articleId: string,
  predicate: string = 'describes',
) => {
  const data = {};
  await retryFetch(
    connection,
    dispatch,
    `${API_URL}/${connection.instanceId}/tags/${tagId}/${predicate}/${articleId}`,
    'application/json',
    'PUT',
    JSON.stringify(data),
  );
};

export const putBlob = async (
  connection: ConnectionType,
  dispatch: Function,
  title: string,
  filename: string,
  cTtype: string,
  uri: string,
) => {
  const now = new Date();
  const nowFormatted = formatDate(now);

  const fileData = await RNFS.readFile(uri, 'base64');
  const tags = await ExifReader.load(uri);
  const copyright = tags.Copyright?.description;
  const iptctitle = tags.Title?.description;
  const headline = tags.Headline?.description;
  const description = tags.Description?.description;
  const imageDescription = tags.ImageDescription?.description;
  const byline = tags['By-line']?.description;
  const credit = tags.Credit?.description;

  const fileId = uuid.v4() as string;
  const data = {
    title: iptctitle || headline || title,
    filename,
    credits: credit || copyright || byline,
    description: description || imageDescription || '',
    created: nowFormatted,
    modified: nowFormatted,
  };
  // Add the file
  await retryFetch(
    connection,
    dispatch,
    `${API_URL}/${connection.instanceId}/files/${fileId}`,
    'application/json',
    'PUT',
    JSON.stringify(data),
  );

  await new Promise(resolve => setTimeout(resolve, pauseTimeMs));
  const binaryImage = atob(fileData);
  const buf = Buffer.from(binaryImage, 'binary');
  // // Upload file data
  await retryFetch(
    connection,
    dispatch,
    `${API_URL}/${connection.instanceId}/files/${fileId}`,
    cTtype,
    'POST',
    buf,
  );
  return fileId;
};

export const exportArticle = async (
  connection: ConnectionType,
  dispatch: Function,
  article: ArticleType,
) => {
  const now = new Date();
  const nowFormatted = formatDate(now);
  let featureImageId;

  // upload feature image
  if (article.featureImage) {
    console.log(`--- Add Feature Image ${article.featureImage}`);
    const fileName = article.featureImage.split('\\').pop()?.split('/').pop();
    if (fileName) {
      const cType = mime.lookup(fileName);
      if (cType) {
        featureImageId = await putBlob(
          connection,
          dispatch,
          fileName,
          fileName,
          cType,
          article.featureImage,
        );
        await new Promise(resolve => setTimeout(resolve, pauseTimeMs));
      }
    }
  }

  // // upload article
  const contentId = uuid.v4() as string;
  const urlname = makeUrlName(article.title, true);
  const description = article.description;
  let content = article.html;
  // fix the html

  // replacec div with p tags
  content = content.replace(/(<div)/gim, '<p').replace(/<\/div>/gim, '</p>');
  console.log(content);
  // replace b with strong tags
  content = content
    .replace(/(<b>)/gim, '<strong>')
    .replace(/<\/b>/gim, '</strong>');
  console.log(content);
  // remove br tags
  content = content.replace(/(<br>)/gim, '');
  console.log(content);
  // remove strong tags from h1 tags
  content = content.replace(
    /<h1[^>]*>.*?<strong>(.*?)<\/strong>.*?<\/h1>/g,
    match => {
      return match.replace(/<strong>(.*?)<\/strong>/g, '$1');
    },
  );
  console.log(content);

  // replace h1 with h4 tags
  content = content.replace(/(<h1>)/gim, '<h4>').replace(/<\/h1>/gim, '</h4>');

  // content = content.replace(
  //   /<h1[^>]*>[^<]*<strong>(.*?)<\/strong>([^<]*)<\/h1>/g,
  //   function (match, _p1, _p2) {
  //     return match.replace(/<strong>(.*?)<\/strong>/g, '');
  //   },
  // );

  console.log(`--- Add article with uuid of ${contentId}`);
  console.log(content);
  type dataType = {
    urlname: string;
    content_type: string;
    created: string;
    issued: string;
    title: string;
    state: string;
    description: string;
    content: string;
    teaser_image_uuid: string | undefined;
  };
  const data = {
    urlname,
    content_type: 'article',
    created: nowFormatted,
    issued: nowFormatted,
    title: article.title,
    state: 'published',
    description,
    content,
  } as dataType;

  if (featureImageId) {
    data.teaser_image_uuid = featureImageId;
  }

  await retryFetch(
    connection,
    dispatch,
    `${API_URL}/${connection.instanceId}/content/${contentId}`,
    'application/json',
    'PUT',
    JSON.stringify(data),
  );

  if (connection.authorTagId) {
    tagArticle(
      connection,
      dispatch,
      connection.authorTagId,
      contentId,
      'authored',
    );
  }
  return contentId;
};
