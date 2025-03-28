import React, { useContext } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import Animated from 'react-native-reanimated';
import AntIcons from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import useGlobalStyles from '@/hooks/useGlobalStyles';
import { ConnectionType } from '@/shared/Types';
import { ACTIONS } from '@/shared/ConnectionReducer';
import { ConnectionDispatchContext } from '@/shared/Context';

const ConnectionItem = ({
  connection,
}: {
  connection: ConnectionType;
  last: boolean;
}) => {
  const { connection_dispatch: dispatch } = useContext(
    ConnectionDispatchContext,
  );
  const styles = useGlobalStyles();

  const deleteConnection = () => {
    Alert.alert(
      'Delete the connection?',
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
              type: ACTIONS.DELETE_CONNECTION,
              payload: { connectionId: connection.id },
            });
          },
        },
      ],
      { cancelable: false },
    );
  };

  const renderRightActions = () => {
    return (
      <View style={styles.rightActions}>
        <Animated.View style={styles.rightActionsAnimatedView}>
          <RectButton
            style={[styles.rightActionsRectButton]}
            onPress={deleteConnection}>
            <AntIcons name="delete" size={23} color={'red'} />
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  const editConnection = () => {
    router.navigate({
      pathname: '/[connectionId]/edit',
      params: { connectionId: connection.id as string },
    });
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable onPress={editConnection}>
        <View style={styles.listItemContainer}>
          <View style={styles.listItemTop}>
            <View style={styles.listItemTextContainer}>
              <Text style={styles.listItemTitleText}>{connection.title}</Text>
              <Text style={styles.listItemDescriptionText}>
                {connection.description}
              </Text>
            </View>
          </View>
          <View style={styles.listItemBottom}>
            <View style={styles.listItemDateContainer}>
              <Text style={styles.listItemBottomText}>
                {new Date(connection.created).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

export default ConnectionItem;
