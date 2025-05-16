import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Cadastro", tabBarIcon: ({ color }) => <FontAwesome6 size={25} name="person-circle-plus" color={color} /> }} />
      <Tabs.Screen name="people" options={{ title: "Pessoas", tabBarIcon: ({ color }) => <FontAwesome6 size={25} name="people-group" color={color} />, }} />
    </Tabs>
  );
}