import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { Button, Text, TextInput, View } from "react-native"

import { auth, db } from "../src/services/firebase.js"

export default function Admin() {

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [matricula, setMatricula] = useState("")
  const [perfil, setPerfil] = useState("empregado")

  const criarUsuario = async () => {

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      )

      const user = userCredential.user

      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        email: email,
        matricula: matricula,
        perfil: perfil
      })

      alert("Usuário criado com sucesso")

      setNome("")
      setEmail("")
      setSenha("")
      setMatricula("")

    } catch (error) {

      alert("Erro ao criar usuário")

    }
  }

  return (

    <View style={{ padding: 20 }}>

      <Text style={{ fontSize: 20 }}>Cadastro de Usuários</Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Senha"
        value={senha}
        secureTextEntry
        onChangeText={setSenha}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Text>Perfil</Text>

      <select
        value={perfil}
        onChange={(e) => setPerfil(e.target.value)}
        style={{ padding: 10, marginBottom: 20 }}
      >
        <option value="empregado">Empregado</option>
        <option value="gestor">Gestor</option>
        <option value="portaria">Portaria</option>
        <option value="admin">Admin</option>
      </select>

      <Button
        title="Criar Usuário"
        onPress={criarUsuario}
      />

    </View>
  )
}