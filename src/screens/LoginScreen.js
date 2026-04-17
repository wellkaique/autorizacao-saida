import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function LoginScreen({ navigation }) {
  const [matricula, setMatricula] = useState("");
  const [nome, setNome] = useState("");

  return (
    <View style={{ padding: 20 }}>
      <Text>Matrícula</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10 }}
        value={matricula}
        onChangeText={setMatricula}
      />

      <Text>Nome</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 20 }}
        value={nome}
        onChangeText={setNome}
      />

      <Button
        title="Entrar"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
}