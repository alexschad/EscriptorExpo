import React, { useState, useContext, useCallback } from 'react';
import { View, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker';
import useGlobalStyles from '@/hooks/useGlobalStyles';
import { ThemedView } from '@/components/ThemedView';
import { ArticleDispatchContext } from '@/shared/Context';
import FormTextInput from '@/components/ui/FormTextInput';
import { ACTIONS } from '@/shared/ArticleReducer';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
});

type IFormInput = z.infer<typeof schema>;

const AddArticle = () => {
  const { article_dispatch: dispatch } = useContext(ArticleDispatchContext);
  const styles = useGlobalStyles();
  const defaultValues = {
    title: '',
    description: '',
  };
  const [featureImage, setFeatureImage] = useState<string>();

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
    console.log(data);
    dispatch({
      type: ACTIONS.ADD_ARTICLE,
      payload: {
        title: data.title,
        description: data.description,
        featureImage,
      },
    });
  };

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (result.assets && result.assets.length > 0) {
      const { uri } = result.assets[0];
      if (uri) {
        setFeatureImage(uri);
      }
    }
  };

  const removeImage = () => {
    setFeatureImage('');
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
        multiline={true}
        numberOfLines={10}
        mode="outlined"
        style={styles.textAreaInput}
      />

      {errors.description?.message != null && (
        <Text style={styles.errorText}>{errors.description.message}</Text>
      )}

      <Text variant="titleMedium">Feature Image</Text>
      {featureImage && (
        <View style={styles.featureImageContainer}>
          <Image
            source={{
              uri: featureImage,
            }}
            resizeMode="cover"
            style={styles.featureImage}
          />
          <Button onPress={removeImage}>Remove Image</Button>
        </View>
      )}
      <Button onPress={selectImage}>Select Image</Button>

      <Button onPress={handleSubmit(onSubmit)} mode="contained">
        Submit
      </Button>
    </ThemedView>
  );
};

export default AddArticle;
