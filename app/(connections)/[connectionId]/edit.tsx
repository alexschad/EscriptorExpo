import React, { useContext, useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useGlobalStyles from '@/hooks/useGlobalStyles';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ConnectionContext, ConnectionDispatchContext } from '@/shared/Context';
import FormTextInput from '@/components/ui/FormTextInput';
import { ACTIONS } from '@/shared/ConnectionReducer';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  instanceId: z.coerce
    .number({
      required_error: 'Instance Id is required',
      invalid_type_error: 'Instance Id must be a number',
    })
    .min(1, 'Instance Id is required'),
  key: z.string().min(1, 'Key is required'),
  secret: z.string().min(1, 'Secret is required'),
});

type IFormInput = z.infer<typeof schema>;

const EditConnectionData = () => {
  const { connectionId } = useLocalSearchParams();
  const connections = useContext(ConnectionContext);
  const connection = connections.find(e => e.id === connectionId);

  const { title, description, instanceId, key, secret } = connection ?? {};
  const { connection_dispatch: dispatch } = useContext(
    ConnectionDispatchContext,
  );

  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ headerTitle: 'Edit Connection' });
    }, []),
  );

  const styles = useGlobalStyles();

  const defaultValues = {
    title,
    description: description || '',
    instanceId: instanceId,
    key: key || '',
    secret: secret || '',
  };

  const {
    control,
    setFocus,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: IFormInput) => {
    dispatch({
      type: ACTIONS.EDIT_CONNECTION,
      payload: {
        connectionId: connection?.id,
        title: data.title,
        description: data.description,
        instanceId: data.instanceId,
        key: data.key,
        secret: data.secret,
      },
    });
    router.navigate({
      pathname: '/(tabs)/connections',
    });
  };

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setFocus('title');
      }, 100);
    }, [setFocus]),
  );

  return (
    <ThemedView style={styles.formContainer}>
      <FormTextInput
        control={control}
        name="title"
        label="Title"
        style={styles.textInput}
      />
      {errors.title?.message != null && (
        <Text style={styles.errorText}>{errors.title.message}</Text>
      )}
      <FormTextInput
        control={control}
        name="description"
        label="Description"
        multiline={true}
        numberOfLines={10}
        style={styles.textAreaInput}
      />
      {errors.description?.message != null && (
        <Text style={styles.errorText}>{errors.description.message}</Text>
      )}
      <FormTextInput
        control={control}
        name="instanceId"
        label="Instance Id"
        style={styles.textInput}
      />
      {errors.instanceId?.message != null && (
        <Text style={styles.errorText}>{errors.instanceId.message}</Text>
      )}
      <FormTextInput
        control={control}
        name="key"
        label="Key"
        style={styles.textInput}
      />
      {errors.key?.message != null && (
        <Text style={styles.errorText}>{errors.key.message}</Text>
      )}
      <FormTextInput
        control={control}
        name="secret"
        label="Secret"
        style={styles.textInput}
        secureTextEntry={true}
      />
      {errors.secret?.message != null && (
        <Text style={styles.errorText}>{errors.secret.message}</Text>
      )}
      <View style={styles.connectionButtonContainer}>
        <Button onPress={handleSubmit(onSubmit)} mode="contained">
          Save
        </Button>
      </View>
    </ThemedView>
  );
};

export default EditConnectionData;
