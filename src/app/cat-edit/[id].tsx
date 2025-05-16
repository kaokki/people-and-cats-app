import { Button } from '@/components/Button';
import { Cat } from '@/components/CatsList';
import { Input } from '@/components/Input';
import { Loading } from '@/components/Loading';
import { api } from '@/services/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export type FormCatProps = {
  nome?: string;
  raca?: string;
  peso?: string;
  cor?: string;
}


export default function CatEdit() {
  const { id } = useLocalSearchParams();
  const [cat, setCat] = useState<Cat>()
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter();

  const racaRef = useRef<TextInput>(null);
  const pesoRef = useRef<TextInput>(null);
  const corRef = useRef<TextInput>(null);

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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormCatProps>()

  const handleEditPerson = async (data: FormCatProps) => {

      //console.log(data);

      try {
        setIsLoading(true);
        await api.patch(`/gatos/${id}`, data);
        Alert.alert('Alterado', "Alteração salva com sucesso", [
          { text: 'Ok', onPress: () => router.back() }
          ]
        )
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }

    };

  useFocusEffect(
    useCallback(() => {
      fetchCat()
    }, [])
  )

  useEffect(() => {
    if (cat) {
      reset({
        nome: cat.nome,
        raca: cat.raca,
        peso: cat.peso,
        cor: cat.cor
      });
    }
  }, [cat]);

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
          <Input 
            error={errors.nome?.message}
            formProps={{
              control,
              name: "nome",
            }}
            inputProps={{
              placeholder: cat.nome,
              onSubmitEditing: () => racaRef.current?.focus(),
              returnKeyType: "next"
            }}
          />

            <Input 
              ref={racaRef}
              error={errors.raca?.message}
              formProps={{
                control,
                name: "raca"
              }}
              inputProps={{
                placeholder: cat.raca,
                onSubmitEditing: () => pesoRef.current?.focus(),
                returnKeyType: "next"
              }}
            />

            <Input 
              ref={pesoRef}
              formProps={{
                control,
                name: "peso"
              }}
              inputProps={{
                placeholder: cat.peso,
                onSubmitEditing: () => corRef.current?.focus(),
                returnKeyType: "next"
              }}
            />

            <Input 
              formProps={{
                control,
                name: "cor"
              }}
              inputProps={{
                placeholder: cat.cor,
              }}
            />

          </View>

          

          <View style={styles.botoes}>
            <Button title='Salvar' onPress={handleSubmit(handleEditPerson)} />
            <Button title='Cancelar' type="danger" onPress={() => router.back()} />
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
    marginBottom: 25
  },
  info: {
    flex: 1,
    justifyContent: 'center',
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
  }
});

