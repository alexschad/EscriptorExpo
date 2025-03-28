import React, { useContext } from 'react';
import { View, Text, Image, ImageStyle, Pressable, Alert } from 'react-native';
import Animated from 'react-native-reanimated';
import AntIcons from '@expo/vector-icons/AntDesign';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { router } from 'expo-router';
import { ArticleType } from '@/shared/Types';
import { ACTIONS } from '@/shared/ArticleReducer';
import { ArticleDispatchContext } from '@/shared/Context';
import useGlobalStyles from '@/hooks/useGlobalStyles';
import { useTheme } from '@react-navigation/native';

const ArticleItem = ({ article }: { article: ArticleType; last: boolean }) => {
  const styles = useGlobalStyles();
  const { article_dispatch: dispatch } = useContext(ArticleDispatchContext);
  const { colors } = useTheme();

  const deleteArticle = () => {
    Alert.alert(
      'Delete the article?',
      'This action cannot be undone!',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatch({
              type: ACTIONS.DELETE_ARTICLE,
              payload: { articleId: article.id },
            });
          },
        },
      ],
      { cancelable: false },
    );
  };

  const exportArticle = () => {
    console.log('export');
    // navigation.navigate('EditArticle', {
    //   screen: 'Export',
    //   articleId: article.id,
    // });
  };

  const renderRightActions = () => {
    return (
      <View style={styles.rightActions}>
        <Animated.View style={styles.rightActionsAnimatedView}>
          <RectButton
            style={[styles.rightActionsRectButton]}
            onPress={deleteArticle}>
            <AntIcons name="delete" size={23} color={colors.notification} />
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  const renderLeftActions = () => {
    return (
      <View style={styles.leftActions}>
        <Animated.View style={styles.leftActionsAnimatedView}>
          <RectButton
            style={[styles.leftActionsRectButton]}
            onPress={exportArticle}>
            <AntIcons name="export" size={23} color={colors.text} />
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  const editArticle = () => {
    router.navigate({
      pathname: '/(articles)/[articleId]/metadata',
      params: { articleId: article.id as string },
    });
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}>
      <Pressable onPress={editArticle}>
        <View style={styles.listItemContainer}>
          <View style={styles.listItemTop}>
            {article.featureImage && (
              <View style={styles.listItemImageContainer}>
                <Image
                  style={styles.articleListItemImage as ImageStyle}
                  source={{
                    uri: article.featureImage,
                  }}
                />
              </View>
            )}
            <View style={styles.listItemTextContainer}>
              <Text style={styles.listItemTitleText}>{article.title}</Text>
              <Text style={styles.listItemDescriptionText}>
                {article.description}
              </Text>
            </View>
          </View>
          <View style={styles.listItemBottom}>
            <View style={styles.listItemDateContainer}>
              <Text style={styles.listItemBottomText}>
                {new Date(article.created).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

export default ArticleItem;
