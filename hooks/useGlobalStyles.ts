import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, DefaultTheme } from '@react-navigation/native';

type Theme = typeof DefaultTheme;

const getGlobalStyles = (props: { colors: Theme['colors'] }) => {
  const { colors } = props;
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    flexgrow: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContainer: {
      justifyContent: 'flex-start',
      backgroundColor: colors.background,
      padding: 8,
      height: '100%',
    },
    listItemContainer: {
      height: 120,
      margin: 5,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      backgroundColor: colors.card,
      padding: 10,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    listItemTop: {
      width: '100%',
      height: '80%',
      display: 'flex',
      flexDirection: 'row',
    },
    listItemBottom: {
      width: '100%',
      height: '20%',
      display: 'flex',
      flexDirection: 'row',
    },
    listItemBottomText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    listItemDateContainer: {
      width: '30%',
    },
    listItemTitleText: {
      margin: 0,
      padding: 0,
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.text,
      alignContent: 'flex-start',
      textAlign: 'left',
      includeFontPadding: false,
      flexShrink: 1,
    },
    listItemImageContainer: {
      width: 60,
      height: 80,
      margin: 1,
      marginTop: 3,
      display: 'flex',
    },
    articleListItemImage: {
      position: 'absolute',
      borderRadius: 5,
      width: 65,
      height: 65,
    },
    listItemDescriptionText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: 'bold',
      maxHeight: 60,
    },
    listItemTextContainer: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      flex: 1,
      paddingLeft: 10,
      paddingRight: 3,
    },
    rightActions: {
      marginRight: 10,
      marginTop: 5,
      marginBottom: 5,
      width: 40,
      flexDirection: 'row',
    },
    rightActionsAnimatedView: {
      flex: 1,
      backgroundColor: 'rgb(254, 216, 212)',
      justifyContent: 'center',
      transform: [{ translateX: 0 }],
    },
    rightActionsRectButton: {
      backgroundColor: 'rgb(254, 216, 212)',
      alignItems: 'center',
    },
    leftActions: {
      marginLeft: 10,
      marginTop: 5,
      marginBottom: 5,
      width: 40,
      flexDirection: 'row',
    },
    leftActionsAnimatedView: {
      flex: 1,
      backgroundColor: 'rgb(192, 184, 184)',
      justifyContent: 'center',
      transform: [{ translateX: 0 }],
    },
    leftActionsRectButton: {
      backgroundColor: 'rgb(192, 184, 184)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    floatingButton: {
      backgroundColor: colors.primary,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 100,
      right: 30,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    formContainer: {
      justifyContent: 'flex-start',
      backgroundColor: colors.background,
      padding: 8,
      height: '100%',
    },
    textInput: {
      marginBottom: 5,
    },
    textAreaInput: {
      marginBottom: 5,
      height: 200,
      textAlignVertical: 'top',
    },
    featureImageContainer: {
      height: 250,
      marginTop: 5,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
    },
    featureImage: {
      height: 250,
      width: 250,
      flex: 1,
    },
    editor: {
      flex: 1,
      borderWidth: 1,
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
    },
    connectionButtonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      margin: 20,
    },
    radioButtonContainer: {
      display: 'flex',
      flexDirection: 'row',
      margin: 5,
    },
    radioButtonText: {
      alignSelf: 'center',
    },
  });
};
function useGlobalStyles() {
  const { colors } = useTheme();

  // We only want to recompute the stylesheet on changes in color.
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  return styles;
}

export default useGlobalStyles;
