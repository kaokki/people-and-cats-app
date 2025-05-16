import { Loading } from '@/components/Loading';
import { PersonCard } from '@/components/PersonCard';
import { api } from '@/services/api';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button } from '../Button';

type Props = {
  personId: string
}

export type Cat = {
  id: string,
  cat_id: string,
  nome: string,
  raca: string,
  peso: string,
  cor: string
}


export default function CatsList({ personId } : Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [cat, setCat] = useState<Cat[]>([]);

  async function fetchCatsByPersonId() {
    try {
      setIsLoading(true)
      const response = await api.get(`/gatos?cat_id=${personId}`);

      setCat(response.data);
      //console.log(people)

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    } 
  }

  useFocusEffect(
    useCallback(() => {
      fetchCatsByPersonId()
    },[])
  )


  if(isLoading){
    return (
      <Loading />
    )
  }

  return (
    <View style={styles.gatos}>
      <Text style={styles.gatosTitle}>Gatos</Text>

      <FlatList
        data={cat}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PersonCard 
            name={item.nome}
            id={item.id}
            onPress={() => router.navigate(`/cat/${item.id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={(
          <Text style={{ marginBottom: 10 }}>Ainda não tem gatos. Adicione um!!!</Text>
        )}
        contentContainerStyle={{
        }}
        ListFooterComponent={(
          <Button title="Adicionar gato" onPress={()=> router.push({ pathname: '/cat-add', params: { personId: personId as string }})} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gatos: {
    paddingBottom: 20,
    flex: 1
  },
  gatosTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 30
  }
});

