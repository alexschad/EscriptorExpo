import React, { useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useGlobalStyles from '@/hooks/useGlobalStyles';
import { ThemedView } from '@/components/ThemedView';
import { ConnectionDispatchContext } from '@/shared/Context';
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

const AddConnection = () => {
  const { connection_dispatch: dispatch } = useContext(
    ConnectionDispatchContext,
  );

  const styles = useGlobalStyles();

  const defaultValues = {
    title: '',
    description: '',
    instanceId: undefined,
    key: '',
    secret: '',
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
      type: ACTIONS.ADD_CONNECTION,
      payload: {
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
        mode="outlined"
        style={styles.textInput}
      />

      {errors.title?.message != null && (
        <Text style={styles.errorText}>{errors.title.message}</Text>
      )}

      <FormTextInput
        control={control}
        name="description"
        label="Description"
        mode="outlined"
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
        mode="outlined"
        style={styles.textInput}
      />
      {errors.instanceId?.message != null && (
        <Text style={styles.errorText}>{errors.instanceId.message}</Text>
      )}
      <FormTextInput
        control={control}
        name="key"
        label="Key"
        mode="outlined"
        style={styles.textInput}
      />
      {errors.key?.message != null && (
        <Text style={styles.errorText}>{errors.key.message}</Text>
      )}
      <FormTextInput
        control={control}
        name="secret"
        label="Secret"
        mode="outlined"
        style={styles.textInput}
        secureTextEntry={true}
      />
      {errors.secret?.message != null && (
        <Text style={styles.errorText}>{errors.secret.message}</Text>
      )}

      <Button onPress={handleSubmit(onSubmit)} mode="contained">
        Submit
      </Button>
    </ThemedView>
  );
};

export default AddConnection;
