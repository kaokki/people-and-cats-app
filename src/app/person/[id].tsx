import { Button } from '@/components/Button';
import CatsList from '@/components/CatsList';
import { Loading } from '@/components/Loading';
import { api } from '@/services/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Person } from '../(tabs)/people';


export default function PersonDetails() {
  const { id } = useLocalSearchParams();
  const [pessoa, setPessoa] = useState<Person>()
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter();


  async function fetchPerson() {
    try {
      setIsLoading(true);
      setPessoa(undefined);
      const response = await api.get(`/people/${id}`);
      setPessoa(response.data);
      //console.log("api:", response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = () => {
    Alert.alert('Remover', `Deseja mesmo remover ${pessoa?.name}?`, [
      { text: 'Sim', onPress: () => handleDeleteConfirm() },
      { text: 'Não', style: 'cancel' }
      ]
    )
  }

  const handleDeleteConfirm = async () => {
    setIsLoading(true)

    api.delete(`/people/${id}`)
    .then(response => {
      router.navigate("/people")
    })
    .catch(error => {
      setIsLoading(false)
      console.error(error);
    });
  }

  useFocusEffect(
    useCallback(() => {
      fetchPerson()
    }, [])
  )

  if(isLoading){
    return (
      <Loading />
    )
  }

  return (

    <View style={styles.container}>
      {pessoa ? (
        <>
        <TouchableOpacity style={styles.back} onPress={() => router.dismissTo("/people")}>
          <Ionicons name="arrow-back-sharp" size={20} color="black" />
          <Text style={styles.text}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.title}>Nome</Text>
          <Text style={styles.text}>{pessoa.name}</Text>

          <Text style={styles.title}>E-mail</Text>
          <Text style={styles.text}>{pessoa.email}</Text>

          <Text style={styles.title}>Telefone</Text>
          <Text style={styles.text}>{pessoa.phone}</Text>

          <Text style={styles.title}>Endereço</Text>
          <Text style={styles.text}>{pessoa.address}</Text>

          <CatsList personId={pessoa.id} />
          
        </View>
        

        <View style={styles.botoes}>
          <Button title='Editar' onPress={()=> router.push({ pathname: '/person-edit/[id]', params: { id: id as string }})} />
          <Button title='Deletar' type="danger" onPress={handleDelete} />
        </View>

        
        </>
      ) : (
        <Text>Pessoa não encontrada</Text>
      )}

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2
  },
  text: {
    fontSize: 16,
    marginBottom: 25
  },
  info: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  botoes: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    gap: 10
  },
  back: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 10,
    alignContent: "center"
  },
  gatos: {
    flex: 1
  },
  gatosTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 30
  }
});

