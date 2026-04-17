import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../src/services/firebase";

export default function Portaria() {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // Pedir permissão da câmera
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Função ao escanear QR
  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);

    try {
      const docRef = doc(db, "solicitacoes", data);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setMensagem("❌ QR Code inválido");
        return;
      }

      const solicitacao = docSnap.data();

      if (solicitacao.status !== "pendente" && solicitacao.status !== "aprovado") {
        setMensagem("⚠️ Solicitação já utilizada ou inválida");
        return;
      }

      // Atualiza para saída registrada
      await updateDoc(docRef, {
        status: "em_saida",
        horario_saida: Timestamp.now()
      });

      setMensagem(`✅ Saída liberada\nMatrícula: ${solicitacao.matricula}`);

    } catch (error) {
      console.log(error);
      setMensagem("Erro ao validar QR");
    }
  };

  // Estados de permissão
  if (hasPermission === null) {
    return <Text>Solicitando permissão da câmera...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Sem acesso à câmera</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Portaria - Leitor QR Code
      </Text>

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ width: "100%", height: 300 }}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Escanear novamente"
          onPress={() => {
            setScanned(false);
            setMensagem("");
          }}
        />
      </View>

      {mensagem !== "" && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18 }}>
            {mensagem}
          </Text>
        </View>
      )}

    </View>
  );
}