import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Loading } from '@/components/Loading';
import { api } from '@/services/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FormProps } from '../(tabs)';
import { Person } from '../(tabs)/people';


export default function PersonEdit() {
  const { id } = useLocalSearchParams();
  const [pessoa, setPessoa] = useState<Person>()
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter();

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);

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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormProps>()

  const handleEditPerson = async (data: FormProps) => {

      //console.log(data);

      try {
        setIsLoading(true);
        await api.put(`/people/${id}`, data);
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
      fetchPerson()
    }, [])
  )

  useEffect(() => {
    if (pessoa) {
      reset({
        name: pessoa.name,
        email: pessoa.email,
        phone: pessoa.phone,
        address: pessoa.address
      });
    }
  }, [pessoa]);

  if(isLoading){
    return (
      <Loading />
    )
  }

  return (

    <View style={styles.container}>
      {pessoa ? (
        <>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back-sharp" size={20} color="black" />
          <Text style={styles.text}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.info}>
          {/* <Text style={styles.title}>{id} - {pessoa?.name}</Text> */}
          <Input 
          error={errors.name?.message}
          formProps={{
            control,
            name: "name",
          }}
          inputProps={{
            onSubmitEditing: () => emailRef.current?.focus(),
            returnKeyType: "next"
          }}
        />

          <Input 
            ref={emailRef}
            error={errors.email?.message}
            formProps={{
              control,
              name: "email"
            }}
            inputProps={{
              placeholder: pessoa.email,
              onSubmitEditing: () => phoneRef.current?.focus(),
              returnKeyType: "next"
            }}
          />

          <Input 
            ref={phoneRef}
            formProps={{
              control,
              name: "phone"
            }}
            inputProps={{
              placeholder: pessoa.phone,
              onSubmitEditing: () => addressRef.current?.focus(),
              returnKeyType: "next"
            }}
          />

          <Input 
            formProps={{
              control,
              name: "address"
            }}
            inputProps={{
              placeholder: pessoa.address,
            }}
          />

        </View>

        

        <View style={styles.botoes}>
          <Button title='Salvar' onPress={handleSubmit(handleEditPerson)} />
          <Button title='Cancelar' type="danger" onPress={() => router.back()} />
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

