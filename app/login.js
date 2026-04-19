import { useRouter } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { auth, db } from "../src/services/firebase";

export default function Login() {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (userData.perfil === "empregado") {
      router.replace("/(empregado)/home");
    } else if (userData.perfil === "gestor") {
      router.replace("/(gestor)/home");
    } else if (userData.perfil === "portaria") {
      router.replace("/(portaria)/home");
    } else if (userData.perfil === "admin") {
      router.replace("/(admin)/home");
    }

    try {
      setLoading(true);

      const q = query(
        collection(db, "usuarios"),
        where("matricula", "==", matricula)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Matrícula não encontrada");
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const email = userData.email;

      if (!email) {
        alert("Usuário sem email cadastrado");
        return;
      }

      await signInWithEmailAndPassword(auth, email, senha);

      // Navegação
      router.replace("/(tabs)/home");

    } catch (error) {
      console.log(error);

      if (error.code === "auth/wrong-password") {
        alert("Senha incorreta");
      } else if (error.code === "auth/user-not-found") {
        alert("Usuário não encontrado");
      } else {
        alert("Erro ao fazer login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.card}>

        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <TextInput
          placeholder="Digite a sua Matrícula"
          value={matricula}
          onChangeText={setMatricula}
          style={styles.input}
          keyboardType="numeric"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Digite a sua Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});