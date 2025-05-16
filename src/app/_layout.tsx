import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen 
        name="(tabs)" 
      />
      <Stack.Screen 
        name="person/[id]" 
      />
      <Stack.Screen 
        name="person-edit/[id]" 
      />
      <Stack.Screen 
        name="cat/[id]" 
      />
      <Stack.Screen 
        name="cat-edit/[id]" 
      />
      <Stack.Screen 
        name="cat-add" 
      />
    </Stack>
  );
}