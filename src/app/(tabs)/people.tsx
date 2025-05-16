import { Loading } from '@/components/Loading';
import { PersonCard } from '@/components/PersonCard';
import { api } from '@/services/api';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export type Person = {
  id: string,
  name: string,
  email: string,
  phone: string,
  address: string
}

export default function People() {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false)

  async function fetchPeople() {
    try {
      setIsLoading(true)
      const response = await api.get('/people');

      setPeople(response.data);
      //console.log(people)

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    } 
  }

  useFocusEffect(
    useCallback(() => {
      fetchPeople()
    },[])
  )
  

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={people}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PersonCard 
              name={item.name}
              id={item.id}
              onPress={() => router.navigate(`/person/${item.id}`)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginVertical: 24,
            paddingBottom: 30
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24
  }
});