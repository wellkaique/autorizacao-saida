import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/services/firebase";
import { useRouter } from "expo-router";

export default function HomeGestor() {

  const [pendentes, setPendentes] = useState(0);
  const [aprovados, setAprovados] = useState(0);
  const [recusados, setRecusados] = useState(0);

  const router = useRouter();

  useEffect(() => {
    carregarResumo();
  }, []);

  const carregarResumo = async () => {
    const snapshot = await getDocs(collection(db, "solicitacoes"));

    let p = 0, a = 0, r = 0;

    snapshot.forEach(doc => {
      const status = doc.data().status;

      if (status === "pendente") p++;
      if (status === "aprovado") a++;
      if (status === "recusado") r++;
    });

    setPendentes(p);
    setAprovados(a);
    setRecusados(r);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Painel do Gestor</Text>

      {/* CARDS */}
      <View style={styles.cards}>

        <View style={[styles.card, { backgroundColor: "#ffc107" }]}>
          <Text style={styles.cardNumber}>{pendentes}</Text>
          <Text style={styles.cardText}>Pendentes</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#28a745" }]}>
          <Text style={styles.cardNumber}>{aprovados}</Text>
          <Text style={styles.cardText}>Aprovadas</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#dc3545" }]}>
          <Text style={styles.cardNumber}>{recusados}</Text>
          <Text style={styles.cardText}>Recusadas</Text>
        </View>

      </View>

      {/* AÇÕES */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(gestor)/solicitacoes")}
      >
        <Text style={styles.buttonText}>
          Ver Solicitações
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8"
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },

  cards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30
  },

  card: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center"
  },

  cardNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff"
  },

  cardText: {
    color: "#fff"
  },

  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});