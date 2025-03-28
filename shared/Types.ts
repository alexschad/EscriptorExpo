import { ACTIONS as ARTICLE_ACTIONS } from '@/shared/ArticleReducer';
import { ACTIONS as CONNECTION_ACTIONS } from '@/shared/ConnectionReducer';

export type ArticleType = {
  id: string;
  title: string;
  description: string;
  featureImage: string;
  html: string;
  created: number;
};

export type ArticleListType = Array<ArticleType>;

type ArticlePayloadType = {
  articleId?: string;
  title?: string;
  description?: string;
  html?: string;
  articles?: ArticleListType;
  featureImage?: string;
};

export type ArticleActionType = {
  type: ARTICLE_ACTIONS;
  payload: ArticlePayloadType;
};

type ConnectionPayloadType = {
  connectionId?: string;
  title?: string;
  description?: string;
  authorFName?: string;
  authorLName?: string;
  authorTagId?: string;
  instanceId?: number;
  key?: string;
  secret?: string;
  access_token?: string;
  connections?: ConnectionListType;
};

export type ConnectionActionType = {
  type: CONNECTION_ACTIONS;
  payload: ConnectionPayloadType;
};

export type ConnectionType = {
  id: string;
  title: string;
  description: string;
  authorFName: string;
  authorLName: string;
  authorTagId: string;
  instanceId: number | undefined;
  key: string;
  secret: string;
  access_token: string;
  created: number;
};

export type ConnectionListType = Array<ConnectionType>;

export type ModeType = 'light' | 'dark';

export type SettingsType = {
  mode: ModeType | null;
};

export type SettingsContextType = {
  settings: SettingsType;
  setSettings: (setting: SettingsType) => void;
};
