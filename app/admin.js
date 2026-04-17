import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Admin() {

  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>

      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Painel Administrativo
      </Text>

      <Button
        title="📊 Dashboard"
        onPress={() => router.push("/admindashboard")}
      />

      <View style={{ marginTop: 10 }} />

      <Button
        title="👤 Gerenciar Usuários"
        onPress={() => router.push("/adminusuarios")}
      />

      <View style={{ marginTop: 10 }} />

    </View>
  );
}