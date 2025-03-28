import React, { useContext, useEffect, useRef } from 'react';
import { FlatList } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { ConnectionContext } from '@/shared/Context';
import NoItems from '@/components/NoItems';
import ConnectionItem from '@/components/ConnectionItem';
import { ThemedView } from '@/components/ThemedView';
import FloatingButton from '@/components/ui/FloatingButton';
import useGlobalStyles from '@/hooks/useGlobalStyles';
import { useTheme } from '@react-navigation/native';

const ConnectionList = () => {
  const connections = useContext(ConnectionContext);
  const styles = useGlobalStyles();
  const { colors } = useTheme();

  return (
    <ThemedView style={styles.listContainer}>
      {!connections || connections?.length === 0 ? (
        <NoItems items={connections} />
      ) : (
        <FlatList
          keyExtractor={item => `item-${item.id}`}
          data={connections}
          renderItem={({ item, index }) => {
            return (
              <ConnectionItem
                connection={item}
                key={item.id}
                last={index === connections.length - 1}
              />
            );
          }}
        />
      )}
      <FloatingButton action={() => router.navigate('/add_connection')}>
        <MaterialCommunityIcons
          size={28}
          name="plus"
          color={colors.background}
        />
      </FloatingButton>
    </ThemedView>
  );
};

export default ConnectionList;
