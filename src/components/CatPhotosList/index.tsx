import { Loading } from '@/components/Loading';
import { api } from '@/services/api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../Button';


type Props = {
  catId: string
}

export type CatPhotoProps = {
  id: string
  uri: string,
}


export default function CatPhotosList({ catId }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [photos, setPhotos] = useState<CatPhotoProps[]>([])

  async function fetchPhotos() {
    try {
      setIsLoading(true)
      
      const response = await api.get(`/photos?cat_id=${catId}`);

      setPhotos(response.data);

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    } 
  }
  
  async function handleCatPhotoSelect(){
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1
    })

    if (photoSelected.canceled) return

    const img64 = photoSelected.assets[0].uri;
    //console.log(img64)

    if (img64) {

      setIsLoading(true)
    
      api.post('/photos', {
        id: uuidv4(),
        cat_id: catId,
        uri: img64,
      })
      .then(function (response) {
        fetchPhotos()
        setIsLoading(false)
      })
      .catch(function (error) {
        setIsLoading(false)
        console.log(error);
      });
    }

  }

  const handleDeletePhoto = (photoId: string) => {
      Alert.alert('Remover', `Deseja mesmo remover essa foto?`, [
        { text: 'Sim', onPress: () => handleDeletePhotoConfirm(photoId) },
        { text: 'Não', style: 'cancel' }
        ]
      )
    }
  
    const handleDeletePhotoConfirm = async (photoId: string) => {
      setIsLoading(true)
  
      api.delete(`/photos/${photoId}`)
      .then(response => {
        fetchPhotos()
        setIsLoading(false)
        Alert.prompt('Removida', 'Foto removido com sucesso!')
      })
      .catch(error => {
        setIsLoading(false)
        console.error(error);
      });
    }

  useFocusEffect(
    useCallback(() => {
      fetchPhotos()
    },[])
  )



  if(isLoading){
    return (
      <Loading />
    )
  }

  return (
    <View style={styles.fotos}>
      <Text style={styles.fotosTitle}>Fotos do bichano</Text>

      <FlatList
          data={photos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.fotoContainer}>
              <Image
                source={{ uri: item.uri }}
                style={styles.foto}
              />
              <TouchableOpacity style={styles.fotoDelete} onPress={() => handleDeletePhoto(item.id)}>
                <FontAwesome name="trash-o" size={20} color="red" />
              </TouchableOpacity>
            </View>
            
          )}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginVertical: 24,
            paddingBottom: 30,
            gap: 10
          }}
          columnWrapperStyle={{
            gap: 10
          }}
          ListFooterComponent={(
            <Button title="Registre uma foto do bichano" onPress={handleCatPhotoSelect} />
          )}
          ListEmptyComponent={(
            <Text>Cadastre fotos do bichano!</Text>
          )}
        />
      
    </View>
  );
}

const styles = StyleSheet.create({
  fotos: {
    paddingBottom: 20,
    flex: 1
  },
  fotosTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 15
  },
  foto: {
    width: 140, 
    height: 140
  },
  fotoContainer: {
    position: "relative"
  },
  fotoDelete: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#fff",
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 5
  }
});

