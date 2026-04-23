import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

import {
    collection,
    onSnapshot,
    query,
    where
} from "firebase/firestore";

import { db } from "../../src/services/firebase";

export default function RH() {

  const [dados, setDados] = useState([]);

  useEffect(() => {
    buscarSolicitacoes();
  }, []);

  const buscarSolicitacoes = () => {
    try {

      const q = query(
        collection(db, "solicitacoes"),
        where("status", "==", "aprovado")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {

        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setDados(lista);

      });

      return unsubscribe;

    } catch (error) {
      console.log(error);
    }
  };

  // 🔤 Traduz tipo
  const traduzirTipo = (tipo) => {
    if (tipo === "saida") return "Saída";
    if (tipo === "hora_extra") return "Hora Extra";
    return tipo;
  };

  // 🔤 Traduz boolean
  const traduzirBoolean = (valor) => {
    return valor ? "Sim" : "Não";
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>

      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Painel do RH
      </Text>

      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text>Nenhuma solicitação aprovada</Text>
        }
        renderItem={({ item }) => (

          <View style={{
            borderWidth: 1,
            padding: 10,
            marginBottom: 10,
            borderRadius: 8
          }}>

            <Text>
              <Text style={{ fontWeight: "bold" }}>Matrícula:</Text> {item.matricula}
            </Text>

            <Text>
              <Text style={{ fontWeight: "bold" }}>Tipo:</Text> {traduzirTipo(item.tipo)}
            </Text>

            <Text>
              <Text style={{ fontWeight: "bold" }}>Motivo:</Text> {item.subtipo}
            </Text>

            {/* SE FOR HORA EXTRA */}
            {item.tipo === "hora_extra" && (
              <>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Início:</Text> {item.hora_inicio}
                </Text>

                <Text>
                  <Text style={{ fontWeight: "bold" }}>Fim:</Text> {item.hora_fim}
                </Text>

                <Text>
                  <Text style={{ fontWeight: "bold" }}>Rota:</Text> {traduzirBoolean(item.rota)}
                </Text>

                <Text>
                  <Text style={{ fontWeight: "bold" }}>Alimentação:</Text> {traduzirBoolean(item.alimentacao)}
                </Text>
              </>
            )}

            <Text>
              <Text style={{ fontWeight: "bold" }}>Obs:</Text> {item.observacao || "Nenhuma"}
            </Text>

          </View>

        )}
      />

    </View>
  );
}