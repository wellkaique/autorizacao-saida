import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { Button, Text, View } from "react-native";
import { db } from "../../src/services/firebase.js"; // ajuste se necessário

const router = useRouter();


export default function Home() {

  const salvarNoFirebase = async () => {
    try {
      await addDoc(collection(db, "solicitacoes"), {
        nome: "Kaique",
        matricula: "123456",
        perfil: "empregado",
        motivo: "Consulta médica",
        dataSaida: "2026-02-26",
        horaSaida: "14:00",
        status: "pendente",
        criadoEm: new Date()
      });

      alert("Solicitação enviada!");
    } catch (e) {
      console.error("Erro ao adicionar: ", e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tela do Empregado</Text>

      <Button
        title="Criar Solicitação"
        onPress={salvarNoFirebase}
      />
      <Button
        title="Ir para Gestor"
        onPress={() => router.push("/gestor")}
      />
      <Button
        title="Ir para Portaria"
        onPress={() => router.push("/portaria")}
      />
    </View>
  );
}