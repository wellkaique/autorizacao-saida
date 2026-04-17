import { useRouter } from "expo-router";

import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where
} from "firebase/firestore";

import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Text,
  TextInput,
  View
} from "react-native";

import { db } from "../src/services/firebase";

export default function Gestor() {

  const router = useRouter();

  const [solicitacoes, setSolicitacoes] = useState([]);

  const [filtroStatus, setFiltroStatus] = useState("pendente");
  const [buscaMatricula, setBuscaMatricula] = useState("");

  const nomeGestor = "João Gestor";

  useEffect(() => {
    buscarSolicitacoes();
  }, [filtroStatus]);

  const buscarSolicitacoes = () => {
    try {

      const q = query(
        collection(db, "solicitacoes"),
        where("status", "==", filtroStatus)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {

        let lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // 🔎 filtro por matrícula (local)
        if (buscaMatricula) {
          lista = lista.filter(item =>
            item.matricula.includes(buscaMatricula)
          );
        }

        setSolicitacoes(lista);

      });

      return unsubscribe;

    } catch (error) {
      console.log(error);
    }
  };

  const aprovarSolicitacao = async (id) => {
    try {
      const ref = doc(db, "solicitacoes", id);

      await updateDoc(ref, {
        status: "aprovado",
        gestor: nomeGestor
      });

    } catch (error) {
      console.log(error);
      alert("Erro ao aprovar");
    }
  };

  const recusarSolicitacao = async (id) => {
    try {
      const ref = doc(db, "solicitacoes", id);

      await updateDoc(ref, {
        status: "recusado",
        gestor: nomeGestor
      });

    } catch (error) {
      console.log(error);
      alert("Erro ao recusar");
    }
  };

  const traduzirTipo = (tipo) => {
    if (tipo === "saida") return "Saída";
    if (tipo === "hora_extra") return "Hora Extra";
    return tipo;
  };

  const traduzirBoolean = (valor) => {
    return valor ? "Sim" : "Não";
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>

      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Painel do Gestor
      </Text>

      {/* 🔎 BUSCA */}
      <TextInput
        placeholder="Buscar por matrícula"
        value={buscaMatricula}
        onChangeText={setBuscaMatricula}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10
        }}
      />

      {/* 🔄 FILTROS */}
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15
      }}>

        <Button title="Pendentes" onPress={() => setFiltroStatus("pendente")} />
        <Button title="Aprovados" onPress={() => setFiltroStatus("aprovado")} />
        <Button title="Recusados" onPress={() => setFiltroStatus("recusado")} />

      </View>

      {/* ➕ NOVA SOLICITAÇÃO */}
      <Button
        title="Nova Solicitação"
        onPress={() => router.push("/gestornovasolicitacao")}
      />

      {/* 📜 HISTÓRICO */}
      <Button
        title="Ver Histórico Completo"
        onPress={() => router.push("/historicoGestor")}
      />

      <FlatList
        data={solicitacoes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text>Nenhuma solicitação encontrada</Text>
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

            {item.tipo === "hora_extra" && (
              <>
                <Text><Text style={{ fontWeight: "bold" }}>Início:</Text> {item.hora_inicio}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Fim:</Text> {item.hora_fim}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Rota:</Text> {traduzirBoolean(item.rota)}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Alimentação:</Text> {traduzirBoolean(item.alimentacao)}</Text>
              </>
            )}

            <Text>
              <Text style={{ fontWeight: "bold" }}>Obs:</Text> {item.observacao || "Nenhuma"}
            </Text>

            {filtroStatus === "pendente" && (
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10
              }}>
                <Button title="Aprovar" onPress={() => aprovarSolicitacao(item.id)} />
                <Button title="Recusar" onPress={() => recusarSolicitacao(item.id)} color="red" />
              </View>
            )}

          </View>

        )}
      />

    </View>
  );
}