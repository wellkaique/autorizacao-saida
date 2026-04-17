import { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import {
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";

import { db } from "../src/services/firebase";

export default function Historico() {

  const [dados, setDados] = useState([]);
  const [qrSelecionado, setQrSelecionado] = useState(null);

  // ⚠️ TEMPORÁRIO (depois vem do login)
  const matricula = "1617";

  useEffect(() => {
    buscarSolicitacoes();
  }, []);

  const buscarSolicitacoes = async () => {
    try {

      const q = query(
        collection(db, "solicitacoes"),
        where("matricula", "==", matricula)
      );

      const querySnapshot = await getDocs(q);

      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setDados(lista);

    } catch (error) {
      console.log(error);
    }
  };

  // 🎨 função para deixar status mais visual
  const getStatusColor = (status) => {
    switch (status) {
      case "pendente":
        return "orange";
      case "aprovado":
        return "blue";
      case "em_saida":
        return "green";
      case "recusado":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>

      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Minhas Solicitações
      </Text>

      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <View
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              borderRadius: 8
            }}
          >

            <Text><Text style={{ fontWeight: "bold" }}>Motivo:</Text> {item.motivo}</Text>

            <Text style={{ color: getStatusColor(item.status) }}>
              <Text style={{ fontWeight: "bold" }}>Status:</Text> {item.status}
            </Text>

            <Text>
              <Text style={{ fontWeight: "bold" }}>Obs:</Text> {item.observacao || "Nenhuma"}
            </Text>

            {/* BOTÃO QR SÓ SE APROVADO */}
            {item.status === "aprovado" && (
              <View style={{ marginTop: 10 }}>
                <Button
                  title="Gerar QR Code"
                  onPress={() => setQrSelecionado(item.id)}
                />
              </View>
            )}

          </View>

        )}
      />

      {/* QR CODE */}
      {qrSelecionado && (
        <View style={{
          marginTop: 20,
          alignItems: "center",
          padding: 10,
          borderWidth: 1,
          borderRadius: 10
        }}>
          <Text style={{ marginBottom: 10 }}>
            Apresente este QR Code na portaria
          </Text>

          <QRCode
            value={qrSelecionado}
            size={200}
          />

          <View style={{ marginTop: 10 }}>
            <Button
              title="Fechar QR"
              onPress={() => setQrSelecionado(null)}
            />
          </View>
        </View>
      )}

    </View>
  );
}