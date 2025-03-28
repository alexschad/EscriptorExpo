import { TouchableOpacity, GestureResponderEvent } from 'react-native';
import React from 'react';
import useGlobalStyles from '@/hooks/useGlobalStyles';

const FloatingButton = ({
  children,
  action,
}: {
  children: JSX.Element;
  action?: (event: GestureResponderEvent) => void;
}) => {
  const styles = useGlobalStyles();
  return (
    <TouchableOpacity onPress={action} style={styles.floatingButton}>
      {children}
    </TouchableOpacity>
  );
};

export default FloatingButton;
