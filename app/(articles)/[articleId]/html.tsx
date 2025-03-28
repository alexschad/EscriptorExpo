import React from 'react';
import { CSSProperties, useContext, useEffect, useCallback } from 'react';

import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  actions,
  RichEditor,
  RichToolbar,
} from 'react-native-pell-rich-editor';
import * as ImagePicker from 'expo-image-picker';
import ImgToBase64 from 'react-native-image-base64';
import useGlobalStyles from '@/hooks/useGlobalStyles';
import { useLocalSearchParams } from 'expo-router';
import { ArticleContext, ArticleDispatchContext } from '@/shared/Context';
import { useDebounce } from '@/shared/utils';
import { ACTIONS } from '@/shared/ArticleReducer';

const handleIcon = (icon: string) => {
  return ({ tintColor }: { tintColor: CSSProperties['color'] }) => (
    <Text style={{ color: tintColor }}>{`${icon}`}</Text>
  );
};

function EditHTML(): React.JSX.Element {
  const { article_dispatch: dispatch } = useContext(ArticleDispatchContext);
  const { articleId } = useLocalSearchParams();

  const articles = useContext(ArticleContext);
  const article = articles.find(e => e.id === articleId);

  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ headerTitle: 'Edit HTML' });
    }, []),
  );

  const { html: articleHTML } = article ?? {};
  const [html, setHTML] = React.useState(articleHTML);
  const debouncedHTML = useDebounce(html, 300);
  const richText = React.useRef<RichEditor>(null);

  const styles = useGlobalStyles();

  // console.log('Article', articleId, html);
  useEffect(() => {
    if (debouncedHTML) {
      dispatch({
        type: ACTIONS.EDIT_ARTICLE_HTML,
        payload: { articleId: articleId, html: debouncedHTML },
      });
    }
  }, [debouncedHTML, dispatch, articleId]);

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.flexgrow}>
        <View style={styles.flexgrow}>
          <RichToolbar
            editor={richText}
            actions={[
              actions.setBold,
              actions.insertLink,
              // actions.setItalic,
              actions.undo,
              actions.redo,
              // actions.insertBulletsList,
              // actions.insertOrderedList,
              // actions.setUnderline,
              actions.heading1,
              // actions.heading2,
              // actions.heading3,
              // actions.heading4,
              // actions.heading5,
              // actions.heading6,
              // actions.code,
              // actions.blockquote,
              // actions.line,
              // actions.setParagraph,
              // actions.removeFormat,
              // actions.alignLeft,
              // actions.alignCenter,
              // actions.alignRight,
              // actions.alignFull,
              // actions.setSubscript,
              // actions.setSuperscript,
              // actions.setStrikethrough,
              // actions.setHR,
              // actions.indent,
              // actions.outdent,
              actions.insertImage,
              actions.keyboard,
            ]}
            iconMap={{
              [actions.heading1]: handleIcon('H1'),
              // [actions.heading2]: handleIcon('H2'),
              // [actions.heading3]: handleIcon('H3'),
              // [actions.heading4]: handleIcon('H4'),
              // [actions.heading5]: handleIcon('H5'),
              // [actions.heading6]: handleIcon('H6'),
              // [actions.setParagraph]: handleIcon('P'),
              // [actions.setHR]: handleIcon('HR'),
            }}
            onPressAddImage={async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 1,
              });
              // console.log(result);
              if (result.assets && result.assets.length > 0) {
                console.log(ImgToBase64, result.assets[0]);
                const { uri, type } = result.assets[0];
                ImgToBase64.getBase64String(uri)
                  .then((base64String: string) => {
                    const str = `data:${type};base64,${base64String}`;
                    richText.current?.insertImage(
                      str,
                      'width: 100%; height: 250px;',
                    );
                  })
                  .catch((err: string) => {
                    console.log('base64:Image:', err);
                  });

                // richText.current?.insertImage(
                //   result.assets[0].uri,
                //   // 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png',
                //   'width: 250px; height: 250px;',
                // );
              }
            }}
          />
          <RichEditor
            ref={richText}
            initialFocus={true}
            style={styles.editor}
            initialContentHTML={articleHTML}
            pasteAsPlainText={true}
            onChange={descriptionText => {
              console.log('descriptionText:', descriptionText);
              setHTML(descriptionText);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default EditHTML;
