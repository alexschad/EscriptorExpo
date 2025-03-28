import React, { useState, useEffect } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  getFocusedRouteNameFromRoute,
  RouteProp,
  ParamListBase,
} from '@react-navigation/native';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import storage from '@/shared/Storage';
import article_reducer, {
  withMMKVStorageCache as withMMKVStorageCacheArticle,
} from '@/shared/ArticleReducer';
import connection_reducer, {
  withMMKVStorageCache as withMMKVStorageCacheConnection,
} from '@/shared/ConnectionReducer';
import { ACTIONS as ARTICLE_ACTIONS } from '@/shared/ArticleReducer';
import { ACTIONS as CONNECTION_ACTIONS } from '@/shared/ConnectionReducer';
import { useColorScheme } from '@/hooks/useColorScheme';

import {
  ArticleDispatchContext,
  ArticleContext,
  ConnectionDispatchContext,
  ConnectionContext,
} from '@/shared/Context';
import useGlobalStyles from '@/hooks/useGlobalStyles';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [article_data, article_dispatch] = React.useReducer(
    withMMKVStorageCacheArticle(article_reducer),
    [],
  );
  const [connection_data, connection_dispatch] = React.useReducer(
    withMMKVStorageCacheConnection(connection_reducer),
    [],
  );
  const styles = useGlobalStyles();

  const loadArticles = () => {
    try {
      let loadedData;
      const JSONData = storage.getString('escriptorArticles');
      if (JSONData) {
        loadedData = JSON.parse(JSONData);
      } else {
        loadedData = [];
      }
      article_dispatch({
        type: ARTICLE_ACTIONS.INIT_DATA,
        payload: { articles: loadedData },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const loadConnections = () => {
    try {
      let loadedData;
      const JSONData = storage.getString('escriptorConnections');
      if (JSONData) {
        loadedData = JSON.parse(JSONData);
      } else {
        loadedData = [];
      }
      connection_dispatch({
        type: CONNECTION_ACTIONS.INIT_DATA,
        payload: { connections: loadedData },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // load stored data and settings on first render
  useEffect(() => {
    loadArticles();
    loadConnections();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  function getHeaderTitle(route: RouteProp<ParamListBase>) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'index';
    switch (routeName) {
      case 'index':
        return 'Articles';
      case 'connections':
        return 'Connections';
    }
  }

  return (
    <ConnectionDispatchContext.Provider value={{ connection_dispatch }}>
      <ConnectionContext.Provider value={connection_data}>
        <ArticleDispatchContext.Provider value={{ article_dispatch }}>
          <ArticleContext.Provider value={article_data}>
            <GestureHandlerRootView>
              <SafeAreaView style={styles.flex}>
                <ThemeProvider
                  value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                  <Stack>
                    <Stack.Screen
                      name="(tabs)"
                      options={({ route }) => ({
                        headerTitle: getHeaderTitle(route),
                      })}
                    />
                    <Stack.Screen
                      name="add_article"
                      options={{ title: 'Add Article' }}
                    />
                    <Stack.Screen
                      name="add_connection"
                      options={{ title: 'Add Connection' }}
                    />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <StatusBar style="auto" />
                </ThemeProvider>
              </SafeAreaView>
            </GestureHandlerRootView>
          </ArticleContext.Provider>
        </ArticleDispatchContext.Provider>
      </ConnectionContext.Provider>
    </ConnectionDispatchContext.Provider>
  );
}
