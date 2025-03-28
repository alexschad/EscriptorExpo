import React from 'react';
import { TextInput } from 'react-native-paper';
import { useController } from 'react-hook-form';

export default function FormTextInput(props: any) {
  const { field } = useController({
    name: props.name,
    control: props.control,
    rules: props.rules,
  });

  return (
    <TextInput
      {...props}
      ref={field.ref}
      value={field.value ? field.value + '' : ''}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
    />
  );
}
