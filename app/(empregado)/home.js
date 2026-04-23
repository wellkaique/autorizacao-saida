import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Olá 👋</Text>
        <Text style={styles.subtitle}>Bem-vindo ao sistema</Text>
      </View>

      {/* Card principal */}
      <View style={styles.card}>

        <Text style={styles.cardTitle}>O que você deseja fazer?</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(empregado)/novasolicitacao")}
        >
          <Text style={styles.buttonText}>Criar Solicitação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => router.push("/(empregado)/historico")}
        >
          <Text style={styles.buttonTextSecondary}>Ver Histórico</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 20,
  },

  header: {
    marginTop: 40,
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  buttonSecondary: {
    backgroundColor: "#e9ecef",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonTextSecondary: {
    color: "#333",
    fontWeight: "bold",
  },
});