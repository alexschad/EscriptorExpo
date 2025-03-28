import React, { useContext, useState, useCallback } from 'react';
import { Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button, RadioButton, Text } from 'react-native-paper';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { useLocalSearchParams, router } from 'expo-router';
import useGlobalStyles from '@/hooks/useGlobalStyles';
import { ThemedView } from '@/components/ThemedView';
import {
  ConnectionDispatchContext,
  ConnectionContext,
  ArticleContext,
  ArticleDispatchContext,
} from '@/shared/Context';
import { ACTIONS } from '@/shared/ArticleReducer';
import { exportArticle } from '@/shared/connections/metropublisher';

const ExportArticle = () => {
  const styles = useGlobalStyles();

  const { articleId } = useLocalSearchParams();
  const articles = useContext(ArticleContext);
  const article = articles.find(e => e.id === articleId);

  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ headerTitle: 'Export Article' });
    }, []),
  );

  const connections = useContext(ConnectionContext);
  const { connection_dispatch: dispatch } = useContext(
    ConnectionDispatchContext,
  );
  const [connectionId, setConnectionId] = useState(
    connections.length > 0 ? connections[0].id : '',
  );
  const [loading, setLoading] = useState(false);

  const { article_dispatch } = useContext(ArticleDispatchContext);

  const doExport = async () => {
    const connection = connections.find(e => e.id === connectionId);
    console.log(connection, article);

    if (connection && article) {
      setLoading(true);
      try {
        const contentId = await exportArticle(connection, dispatch, article);
        if (contentId) {
          article_dispatch({
            type: ACTIONS.DELETE_ARTICLE,
            payload: { articleId: article.id },
          });
          router.dismissAll();
          router.navigate({
            pathname: '/(tabs)',
          });
        }
      } catch (e) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: (e as Error).message,
          button: 'close',
        });
      }
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.formContainer}>
      <Text variant="titleMedium">Connections</Text>
      {connections.map(c => (
        <Pressable
          key={c.id}
          style={styles.radioButtonContainer}
          onPress={() => setConnectionId(c.id)}>
          <RadioButton
            value="first"
            status={c.id === connectionId ? 'checked' : 'unchecked'}
            onPress={() => setConnectionId(c.id)}
          />
          <Text style={styles.radioButtonText}>{c.title}</Text>
        </Pressable>
      ))}
      <Button
        onPress={doExport}
        mode="contained"
        loading={loading}
        disabled={loading}>
        {loading ? 'Exporting' : 'Export Article'}
      </Button>
    </ThemedView>
  );
};

export default ExportArticle;
