import React, { useContext, useEffect, useRef } from 'react';
import { FlatList } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { ArticleContext } from '@/shared/Context';
import NoItems from '@/components/NoItems';
import ArticleItem from '@/components/ArticleItem';
import { ThemedView } from '@/components/ThemedView';
import FloatingButton from '@/components/ui/FloatingButton';
import useGlobalStyles from '@/hooks/useGlobalStyles';
import { ArticleType } from '@/shared/Types';
import { useTheme } from '@react-navigation/native';

const ArticleList = () => {
  const articles = useContext(ArticleContext);
  const prevArticleLen = useRef(articles?.length);
  const styles = useGlobalStyles();
  const { colors } = useTheme();

  useEffect(() => {
    if (prevArticleLen.current < articles?.length) {
      // an article got added so we redirect to the Edit Page
      const newArticle = articles.sort(
        (a: ArticleType, b: ArticleType) => b.created - a.created,
      )[0];
      // check if the new article was added within the last second
      // to avoid redirect on app start when the articles get loaded initially
      if (Date.now() - newArticle.created < 1000) {
        router.replace('/(tabs)', { relativeToDirectory: true });
      }
    }
    prevArticleLen.current = articles?.length;
  }, [articles]);

  return (
    <ThemedView style={styles.listContainer}>
      {!articles || articles?.length === 0 ? (
        <NoItems items={articles} />
      ) : (
        <FlatList
          keyExtractor={item => `item-${item.id}`}
          data={articles}
          renderItem={({ item, index }) => {
            return (
              <ArticleItem
                article={item}
                key={item.id}
                last={index === articles.length - 1}
              />
            );
          }}
        />
      )}
      <FloatingButton action={() => router.navigate('/add_article')}>
        <MaterialCommunityIcons
          size={28}
          name="plus"
          color={colors.background}
        />
      </FloatingButton>
    </ThemedView>
  );
};

export default ArticleList;
