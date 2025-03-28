import React from 'react';
import { Stack } from 'expo-router';

export default function StackLayout() {
  console.log('CONNECTION STACK');
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="[connectionId]/edit"
        options={{
          title: 'Edit Connection',
        }}
      />
    </Stack>
  );
}
