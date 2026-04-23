import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../src/services/firebase";


export default function NovaSolicitacao() {


  const [matricula, setMatricula] = useState("");
  

  const [tipo, setTipo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [observacao, setObservacao] = useState("");

  // hora extra
  const [tipoExtra, setTipoExtra] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");

  // recursos
  const [rota, setRota] = useState(false);
  const [alimentacao, setAlimentacao] = useState(false);

  const solicitar = async () => {
    try {

      if (!tipo) {
        alert("Selecione o tipo de solicitação");
        return;
      }

      let dados = {
        matricula: matricula,
        tipo: tipo,
        observacao: observacao,
        status: "pendente",
        data: Timestamp.now(),

        // garante consistência
        rota: tipo === "hora_extra" ? rota : false,
        alimentacao: tipo === "hora_extra" ? alimentacao : false
      };

      // SAÍDA
      if (tipo === "saida") {
        if (!motivo) {
          alert("Selecione um motivo");
          return;
        }

        dados.subtipo = motivo;
      }

      // HORA EXTRA
      if (tipo === "hora_extra") {
        if (!tipoExtra || !horaInicio || !horaFim) {
          alert("Preencha os dados da hora extra");
          return;
        }

        dados.subtipo = tipoExtra;
        dados.hora_inicio = horaInicio;
        dados.hora_fim = horaFim;
      }

      await addDoc(collection(db, "solicitacoes"), dados);

      alert("Solicitação enviada!");

      // limpar tudo
      setTipo("");
      setMotivo("");
      setObservacao("");
      setTipoExtra("");
      setHoraInicio("");
      setHoraFim("");
      setRota(false);
      setAlimentacao(false);

    } catch (error) {
      console.log(error);
      alert("Erro ao enviar");
    }
  };

  return (
    <View style={{ padding: 20 }}>

      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Nova Solicitação
      </Text>

      {/* TIPO */}
      <Text>Tipo de solicitação</Text>

      <Picker
        selectedValue={tipo}
        onValueChange={(value) => {
          setTipo(value);

          // limpa recursos se não for hora extra
          if (value !== "hora_extra") {
            setRota(false);
            setAlimentacao(false);
          }
        }}
        style={{ marginBottom: 20 }}
      >
        <Picker.Item label="Selecione" value="" />
        <Picker.Item label="Saída / Ocorrência" value="saida" />
        <Picker.Item label="Hora extra" value="hora_extra" />
      </Picker>

      {/* SAÍDA */}
      {tipo === "saida" && (
        <>
          <Text>Motivo</Text>

          <Picker
            selectedValue={motivo}
            onValueChange={(value) => setMotivo(value)}
            style={{ marginBottom: 20 }}
          >
            <Picker.Item label="Selecione o motivo" value="" />
            <Picker.Item label="Saída serviço externo" value="saida_servico_externo" />
            <Picker.Item label="Entrada após horário" value="entrada_apos_horario" />
            <Picker.Item label="Esquecimento de ponto entrada" value="esquecimento_ponto_entrada" />
            <Picker.Item label="Esquecimento de ponto saída" value="esquecimento_ponto_saida" />
            <Picker.Item label="Abono de falta" value="abono_falta" />
          </Picker>
        </>
      )}

      {/* HORA EXTRA */}
      {tipo === "hora_extra" && (
        <>
          <Text>Tipo de hora extra</Text>

          <Picker
            selectedValue={tipoExtra}
            onValueChange={(value) => setTipoExtra(value)}
            style={{ marginBottom: 20 }}
          >
            <Picker.Item label="Selecione" value="" />
            <Picker.Item label="Hora extra normal" value="hora_extra_normal" />
            <Picker.Item label="Extra (dia inteiro)" value="extra_dia" />
          </Picker>

          <Text>Hora início</Text>
          <TextInput
            placeholder="Ex: 18:00"
            value={horaInicio}
            onChangeText={setHoraInicio}
            style={{ borderWidth: 1, marginBottom: 10 }}
          />

          <Text>Hora fim</Text>
          <TextInput
            placeholder="Ex: 22:00"
            value={horaFim}
            onChangeText={setHoraFim}
            style={{ borderWidth: 1, marginBottom: 20 }}
          />

          {/* RECURSOS */}
          <Text>Recursos necessários</Text>

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <Checkbox value={rota} onValueChange={setRota} />
            <Text style={{ marginLeft: 8 }}>
              Preciso de rota (transporte)
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <Checkbox value={alimentacao} onValueChange={setAlimentacao} />
            <Text style={{ marginLeft: 8 }}>
              Preciso de alimentação
            </Text>
          </View>
        </>
      )}

      {/* OBSERVAÇÃO */}
      <Text style={{ marginTop: 20 }}>Observação</Text>

      <TextInput
        placeholder="Opcional"
        value={observacao}
        onChangeText={setObservacao}
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 10
        }}
      />

      <Button title="Enviar Solicitação" onPress={solicitar} />

    </View>
  );
}