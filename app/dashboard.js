import { useEffect, useState } from "react";
import { Button, Dimensions, ScrollView, Text, View } from "react-native";

import { BarChart, LineChart, PieChart } from "react-native-chart-kit";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import * as XLSX from "xlsx";

import { db } from "../src/services/firebase";

export default function Dashboard() {

  const [solicitacoes, setSolicitacoes] = useState([]);

  const [metricas, setMetricas] = useState({
    total: 0,
    aprovadas: 0,
    recusadas: 0,
    pendentes: 0,
    horaExtra: 0,
    saida: 0,
    rota: 0,
    alimentacao: 0
  });

  const [tendencia, setTendencia] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    buscarDados();
  }, []);

  const formatarData = (timestamp) => {
    const data = timestamp.toDate();
    return data.toLocaleDateString("pt-BR");
  };

  const gerarTendencia = (docs) => {
    const hoje = new Date();

    let dias = [];
    let contagem = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(hoje.getDate() - i);

      const label = d.toLocaleDateString("pt-BR");

      dias.push(label);
      contagem[label] = 0;
    }

    docs.forEach(doc => {
      const item = doc.data();

      if (!item.data) return;

      const dia = formatarData(item.data);

      if (contagem[dia] !== undefined) {
        contagem[dia]++;
      }
    });

    const valores = dias.map(dia => contagem[dia]);

    return {
      labels: dias.map(d => d.slice(0, 5)),
      datasets: [{ data: valores }]
    };
  };

  const exportarExcel = () => {

    const planilha = solicitacoes.map(item => ({
      Matricula: item.matricula,
      Tipo: item.tipo,
      Status: item.status,
      Data: item.data?.toDate().toLocaleDateString(),
      Rota: item.rota ? "Sim" : "Não",
      Alimentacao: item.alimentacao ? "Sim" : "Não"
    }));

    const worksheet = XLSX.utils.json_to_sheet(planilha);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatorio");

    XLSX.writeFile(workbook, "relatorio.xlsx");
  };

  const buscarDados = () => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, "solicitacoes"),
        (snapshot) => {

          let dados = {
            total: 0,
            aprovadas: 0,
            recusadas: 0,
            pendentes: 0,
            horaExtra: 0,
            saida: 0,
            rota: 0,
            alimentacao: 0
          };

          const lista = snapshot.docs.map(doc => {
            const item = doc.data();

            dados.total++;

            if (item.status === "aprovado") dados.aprovadas++;
            if (item.status === "recusado") dados.recusadas++;
            if (item.status === "pendente") dados.pendentes++;

            if (item.tipo === "hora_extra") dados.horaExtra++;
            if (item.tipo === "saida") dados.saida++;

            if (item.rota) dados.rota++;
            if (item.alimentacao) dados.alimentacao++;

            return item;
          });

          setSolicitacoes(lista);
          setMetricas(dados);
          setTendencia(gerarTendencia(snapshot.docs));
        }
      );

      return unsubscribe;

    } catch (error) {
      console.log(error);
    }
  };

  const dataStatus = [
    {
      name: "Aprovadas",
      population: metricas.aprovadas,
      color: "#4CAF50",
      legendFontColor: "#000",
      legendFontSize: 12
    },
    {
      name: "Pendentes",
      population: metricas.pendentes,
      color: "#FFC107",
      legendFontColor: "#000",
      legendFontSize: 12
    },
    {
      name: "Recusadas",
      population: metricas.recusadas,
      color: "#F44336",
      legendFontColor: "#000",
      legendFontSize: 12
    }
  ];

  const dataTipos = {
    labels: ["Hora Extra", "Saída"],
    datasets: [
      {
        data: [metricas.horaExtra, metricas.saida]
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
  };

  return (
    <ScrollView style={{ padding: 20 }}>

      <Text style={{ fontSize: 26, marginBottom: 20 }}>
        Dashboard
      </Text>

      <Button title="Exportar Excel" onPress={exportarExcel} />

      <Text style={{ fontSize: 18 }}>Status</Text>
      <PieChart
        data={dataStatus}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
      />

      <Text style={{ fontSize: 18, marginTop: 20 }}>
        Tipos
      </Text>
      <BarChart
        data={dataTipos}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />

      <Text style={{ fontSize: 18, marginTop: 20 }}>
        Tendência (7 dias)
      </Text>
      <LineChart
        data={tendencia}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
      />

      <View style={card}>
        <Text>Total</Text>
        <Text style={numero}>{metricas.total}</Text>
      </View>

    </ScrollView>
  );
}

const card = {
  borderWidth: 1,
  padding: 15,
  marginBottom: 10,
  borderRadius: 10
};

const numero = {
  fontSize: 22,
  fontWeight: "bold",
  marginTop: 5
};