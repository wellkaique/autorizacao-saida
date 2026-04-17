import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Empregado() {

  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>

      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Área do Empregado
      </Text>

      <Button
        title="➕ Nova Solicitação"
        onPress={() => router.push("/novasolicitacao")}
      />

      <View style={{ marginTop: 10 }} />

      <Button
        title="📋 Minhas Solicitações"
        onPress={() => router.push("/historico")}
      />

    </View>
  );
}