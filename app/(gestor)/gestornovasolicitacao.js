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
import { auth, db } from "../../src/services/firebase";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function NovaSolicitacao() {

  const [motivo, setMotivo] = useState("");
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [observacao, setObservacao] = useState("");

  const [mostrarData, setMostrarData] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);

  const [loading, setLoading] = useState(false);

  const motivos = [
    "Saída antecipada",
    "Serviço externo",
    "Entrada após horario",
    "Esquecimento de registro de ponto de entrada",
    "Esquecimento de registro de ponto de sáida",
    "Abono de falta",
  ];

  const onChangeData = (event, selectedDate) => {
    setMostrarData(false);
    if (selectedDate) setData(selectedDate);
  };

  const onChangeHora = (event, selectedTime) => {
    setMostrarHora(false);
    if (selectedTime) setHora(selectedTime);
  };

  const handleSubmit = async () => {

    if (!motivo) {
      Alert.alert("Erro", "Selecione um motivo");
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
        dataSaida: data.toISOString().split("T")[0],
        horaSaida: hora.toTimeString().slice(0, 5),
        observacao,
        status: "pendente",
        criadoEm: new Date()
      });

      Alert.alert("Sucesso", "Solicitação enviada!");

      // RESET CORRETO
      setMotivo("");
      setData(new Date());
      setHora(new Date());
      setObservacao("");

    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao enviar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Nova Solicitação</Text>

      {/* MOTIVOS */}
      <Text style={styles.label}>Motivo</Text>
      <View style={styles.motivosContainer}>
        {motivos.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.motivoButton,
              motivo === item && styles.motivoSelecionado
            ]}
            onPress={() => setMotivo(item)}
          >
            <Text
              style={[
                styles.motivoText,
                motivo === item && styles.motivoTextSelecionado
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* DATA */}
      <Text style={styles.label}>Data da saída</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setMostrarData(true)}
      >
        <Text>{data.toLocaleDateString("pt-BR")}</Text>
      </TouchableOpacity>

      {mostrarData && (
        <DateTimePicker
          value={data}
          mode="date"
          display="default"
          onChange={onChangeData}
        />
      )}

      {/* HORA */}
      <Text style={styles.label}>Hora da saída</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setMostrarHora(true)}
      >
        <Text>
          {hora.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </Text>
      </TouchableOpacity>

      {mostrarHora && (
        <DateTimePicker
          value={hora}
          mode="time"
          display="default"
          onChange={onChangeHora}
        />
      )}

      {/* OBSERVAÇÃO */}
      <Text style={styles.label}>Observação (opcional)</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Detalhes adicionais..."
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />

      {/* BOTÃO */}
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
    marginBottom: 8,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  motivosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },

  motivoButton: {
    backgroundColor: "#e9ecef",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  motivoSelecionado: {
    backgroundColor: "#007bff",
  },

  motivoText: {
    color: "#333",
  },

  motivoTextSelecionado: {
    color: "#fff",
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});