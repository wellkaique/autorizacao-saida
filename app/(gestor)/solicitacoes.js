import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";

import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "../../src/services/firebase";

export default function SolicitacoesGestor() {

  const [dados, setDados] = useState([]);

  useEffect(() => {
    buscarSolicitacoes();
  }, []);

  const buscarSolicitacoes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "solicitacoes"));

      const lista = querySnapshot.docs.map(docItem => ({
        id: docItem.id,
        ...docItem.data()
      }));

      setDados(lista);

    } catch (error) {
      console.log(error);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {

      const ref = doc(db, "solicitacoes", id);

      await updateDoc(ref, {
        status: novoStatus
      });

      Alert.alert("Sucesso", `Solicitação ${novoStatus}`);

      buscarSolicitacoes(); // atualiza lista

    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao atualizar");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      <Text style={styles.nome}>
        {item.email}
      </Text>

      <Text style={styles.info}>
        Motivo: {item.motivo}
      </Text>

      <Text style={styles.info}>
        Data: {item.dataSaida} às {item.horaSaida}
      </Text>

      <Text style={styles.status}>
        Status: {item.status}
      </Text>

      {/* BOTÕES */}
      {item.status === "pendente" && (
        <View style={styles.actions}>

          <TouchableOpacity
            style={styles.aprovar}
            onPress={() => atualizarStatus(item.id, "aprovado")}
          >
            <Text style={styles.textButton}>Aprovar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.recusar}
            onPress={() => atualizarStatus(item.id, "recusado")}
          >
            <Text style={styles.textButton}>Recusar</Text>
          </TouchableOpacity>

        </View>
      )}

    </View>
  );

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Painel do Gestor
      </Text>

      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2
  },

  nome: {
    fontWeight: "bold",
    marginBottom: 5
  },

  info: {
    color: "#555"
  },

  status: {
    marginTop: 5,
    fontWeight: "bold"
  },

  actions: {
    flexDirection: "row",
    marginTop: 10
  },

  aprovar: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    marginRight: 10
  },

  recusar: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8
  },

  textButton: {
    color: "#fff",
    fontWeight: "bold"
  }
});