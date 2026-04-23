import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal
} from "react-native";
import QRCode from "react-native-qrcode-svg";

import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "../../src/services/firebase";
import { auth } from "../../src/services/firebase";

export default function Historico() {

  const [dados, setDados] = useState([]);
  const [qrSelecionado, setQrSelecionado] = useState(null);


  useEffect(() => {
    buscarSolicitacoes();
  }, []);

  const buscarSolicitacoes = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.log("Usuário não logado");
      return;
    }

    const q = query(
      collection(db, "solicitacoes"),
      where("userId", "==", user.uid)
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
  const getStatusStyle = (status) => {
    switch (status) {
      case "pendente":
        return styles.pendente;
      case "aprovado":
        return styles.aprovado;
      case "em_saida":
        return styles.saida;
      case "recusado":
        return styles.recusado;
      default:
        return {};
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      <Text style={styles.motivo}>{item.motivo}</Text>

      <Text style={styles.info}>
        📅 {item.dataSaida || "-"} ⏰ {item.horaSaida || "-"}
      </Text>

      <Text style={[styles.status, getStatusStyle(item.status)]}>
        {item.status}
      </Text>

      <Text style={styles.obs}>
        Obs: {item.observacao || "Nenhuma"}
      </Text>

      {item.status === "aprovado" && (
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => setQrSelecionado(item.id)}
        >
          <Text style={styles.qrButtonText}>Gerar QR Code</Text>
        </TouchableOpacity>
      )}

    </View>
  );

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Minhas Solicitações</Text>

      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhuma solicitação encontrada
          </Text>
        }
      />

      {/* MODAL QR CODE */}
      <Modal visible={!!qrSelecionado} transparent animationType="fade">

        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              Apresente na portaria
            </Text>

            <QRCode value={qrSelecionado || ""} size={200} />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setQrSelecionado(null)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>

          </View>
        </View>

      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  motivo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  info: {
    color: "#555",
    marginBottom: 5,
  },

  status: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  pendente: {
    color: "orange",
  },

  aprovado: {
    color: "green",
  },

  saida: {
    color: "blue",
  },

  recusado: {
    color: "red",
  },

  obs: {
    fontSize: 13,
    color: "#666",
  },

  qrButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  qrButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#666",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
  },

  modalTitle: {
    marginBottom: 15,
    fontWeight: "bold",
  },

  closeButton: {
    marginTop: 15,
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});