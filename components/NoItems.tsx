/* global require */

import React from 'react';
import { Image } from 'react-native';
import { ArticleListType, ConnectionListType } from '@/shared/Types';
import { ThemedView } from '@/components/ThemedView';
import useGlobalStyles from '@/hooks/useGlobalStyles';

export default function NoItems({
  items,
}: {
  items: ArticleListType | ConnectionListType;
}) {
  if (items === null) {
    return <></>;
  }
  const styles = useGlobalStyles();

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/images/no-items.png')}
        style={[
          {
            height: 400,
            width: 800,
            marginLeft: 150,
          },
          { resizeMode: 'contain' },
        ]}
      />
    </ThemedView>
  );
}
