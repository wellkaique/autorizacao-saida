import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../src/services/firebase.js";

export default function NovaSolicitacao() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  async function handleSalvar() {
    try {
      await addDoc(collection(db, "solicitacoes"), {
        nome,
        descricao,
        status: "pendente",
        created_at: new Date()
      });

      alert("Solicitação salva no Firebase!");

      setNome("");
      setDescricao("");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Solicitação</Text>

      <TextInput
        placeholder="Nome"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Descrição"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />

      <Button title="Salvar" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});