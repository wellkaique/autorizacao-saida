import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import {
    collection,
    getDocs
} from "firebase/firestore";

import { db } from "../../src/services/firebase";

export default function Admin() {

  const [total, setTotal] = useState(0);
  const [pendente, setPendente] = useState(0);
  const [aprovado, setAprovado] = useState(0);
  const [emSaida, setEmSaida] = useState(0);
  const [recusado, setRecusado] = useState(0);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {

      const querySnapshot = await getDocs(collection(db, "solicitacoes"));

      let totalCount = 0;
      let pendenteCount = 0;
      let aprovadoCount = 0;
      let emSaidaCount = 0;
      let recusadoCount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        totalCount++;

        if (data.status === "pendente") pendenteCount++;
        if (data.status === "aprovado") aprovadoCount++;
        if (data.status === "em_saida") emSaidaCount++;
        if (data.status === "recusado") recusadoCount++;
      });

      setTotal(totalCount);
      setPendente(pendenteCount);
      setAprovado(aprovadoCount);
      setEmSaida(emSaidaCount);
      setRecusado(recusadoCount);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ padding: 20 }}>

      <Text style={{ fontSize: 26, marginBottom: 20 }}>
        Dashboard Administrativo
      </Text>

      <View style={card}>
        <Text>Total de Solicitações: {total}</Text>
      </View>

      <View style={card}>
        <Text>Pendentes: {pendente}</Text>
      </View>

      <View style={card}>
        <Text>Aprovadas: {aprovado}</Text>
      </View>

      <View style={card}>
        <Text>Em saída: {emSaida}</Text>
      </View>

      <View style={card}>
        <Text>Recusadas: {recusado}</Text>
      </View>

    </View>
  );
}

const card = {
  borderWidth: 1,
  padding: 15,
  marginBottom: 10,
  borderRadius: 10
};