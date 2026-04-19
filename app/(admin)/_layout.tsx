import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Admin" }} />
      <Tabs.Screen name="usuarios" options={{ title: "Usuários" }} />
    </Tabs>
  );
}