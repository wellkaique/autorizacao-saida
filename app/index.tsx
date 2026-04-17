import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/login");
    }, 100); // 👈 pequeno delay resolve
  }, []);

  return (
    <View>
      <Text>Carregando...</Text>
    </View>
  );
}