import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(empregado)" />
      <Stack.Screen name="(gestor)" />
      <Stack.Screen name="(portaria)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}