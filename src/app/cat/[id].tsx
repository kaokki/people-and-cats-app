import { Button } from '@/components/Button';
import CatPhotosList from '@/components/CatPhotosList';
import { Cat } from '@/components/CatsList';
import { Loading } from '@/components/Loading';
import { api } from '@/services/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function CatDetails() {
  const { id } = useLocalSearchParams();
  const [cat, setCat] = useState<Cat>()
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter();


  async function fetchCat() {
    try {
      setIsLoading(true);
      setCat(undefined);
      const response = await api.get(`/gatos/${id}`);
      setCat(response.data);
      //console.log("api:", response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = () => {
    Alert.alert('Remover', `Deseja mesmo remover ${cat?.nome}?`, [
      { text: 'Sim', onPress: () => handleDeleteConfirm() },
      { text: 'Não', style: 'cancel' }
      ]
    )
  }

  const handleDeleteConfirm = async () => {
    setIsLoading(true)

    api.delete(`/gatos/${id}`)
    .then(response => {
      router.back()
    })
    .catch(error => {
      setIsLoading(false)
      console.error(error);
    });
  }

  useFocusEffect(
    useCallback(() => {
      fetchCat()
    }, [])
  )

  if(isLoading){
    return (
      <Loading />
    )
  }

  return (

    <View style={styles.container}>
      {cat ? (
        <>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back-sharp" size={20} color="black" />
          <Text style={styles.text}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.title}>Nome</Text>
          <Text style={styles.text}>{cat.nome}</Text>

          <Text style={styles.title}>Raça</Text>
          <Text style={styles.text}>{cat.raca}</Text>

          <Text style={styles.title}>Peso</Text>
          <Text style={styles.text}>{cat.peso} kg</Text>

          <Text style={styles.title}>Cor</Text>
          <Text style={styles.text}>{cat.cor}</Text>
          

          <CatPhotosList catId={cat.id} />
          
        </View>
        

        <View style={styles.botoes}>
          <Button title='Editar' onPress={()=> router.push({ pathname: '/cat-edit/[id]', params: { id: id as string }})} />
          <Button title='Deletar' type="danger" onPress={handleDelete} />
        </View>

        
        </>
      ) : (
        <Text>Gato não encontrado</Text>
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
    marginBottom: 10
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

