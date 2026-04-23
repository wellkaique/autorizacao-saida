import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from "react-native";

import { collection, addDoc } from "firebase/firestore";
import { auth,db } from "../../src/services/firebase";

export default function NovaSolicitacao() {

  const [motivo, setMotivo] = useState("");
  const [dataSaida, setDataSaida] = useState("");
  const [horaSaida, setHoraSaida] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    // 🔐 Validação
    if (!motivo || !dataSaida || !horaSaida) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;

       if (!user) {
        Alert.alert("Erro", "Usuário não está logado");
        return;
       }
      await addDoc(collection(db, "solicitacoes"), {
        userId: user.uid,
        email: user.email,
        motivo,
        dataSaida,
        horaSaida,
        status: "pendente",
        criadoEm: new Date()
      });

      Alert.alert("Sucesso", "Solicitação enviada!");

      // limpar campos
      setMotivo("");
      setDataSaida("");
      setHoraSaida("");

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível enviar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Nova Solicitação</Text>

      {/* Motivo */}
      <Text style={styles.label}>Motivo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Consulta médica"
        value={motivo}
        onChangeText={setMotivo}
      />

      {/* Data */}
      <Text style={styles.label}>Data da saída</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={dataSaida}
        onChangeText={setDataSaida}
      />

      {/* Hora */}
      <Text style={styles.label}>Hora da saída</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM"
        value={horaSaida}
        onChangeText={setHoraSaida}
      />

      {/* Botão */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Enviando..." : "Enviar Solicitação"}
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f6f8",
    flexGrow: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  label: {
    marginBottom: 5,
    fontWeight: "600",
    color: "#333",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});