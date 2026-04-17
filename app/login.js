import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

import { auth, db } from "../src/services/firebase.js";

import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

export default function Login() {

  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    try {

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

      await signInWithEmailAndPassword(auth, email, senha);

      if (userData.perfil === "admin") {
        router.replace("/admin");
      }
      else if (userData.perfil === "gestor") {
        router.replace("/gestor");
      }
      else if (userData.perfil === "empregado") {
        router.replace("/empregado");
      }
      else if (userData.perfil === "portaria") {
        router.replace("/portaria");
      }

    } catch (error) {
      console.log(error);
      alert("Erro ao fazer login");
    }
  };

  return (
    <View style={{ padding: 20 }}>

      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />

      <Button title="Entrar" onPress={handleLogin} />

    </View>
  );
}