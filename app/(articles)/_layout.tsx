import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { HapticTab } from '@/components/HapticTab';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams } from 'expo-router';

export default function TabLayout() {
  const { articleId } = useLocalSearchParams();
  const { colors } = useTheme();

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          headerShown: false,
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="[articleId]/metadata"
          options={{
            title: 'Meta Data',
            href: {
              pathname: '/(articles)/[articleId]/metadata',
              params: {
                articleId: articleId as string,
              },
            },
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons size={28} name="pencil" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="[articleId]/html"
          options={{
            title: 'Html',
            href: {
              pathname: '/(articles)/[articleId]/html',
              params: {
                articleId: articleId as string,
              },
            },
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                size={28}
                name="file-document-edit"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="[articleId]/export"
          options={{
            title: 'Export',
            href: {
              pathname: '/(articles)/[articleId]/export',
              params: {
                articleId: articleId as string,
              },
            },
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                size={28}
                name="connection"
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
