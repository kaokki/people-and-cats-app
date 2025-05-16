import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Loading } from '@/components/Loading';
import { api } from '@/services/api';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { FormCatProps } from './cat-edit/[id]';

export default function CatAdd() {
  const { personId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormCatProps>()

  const onSubmit = (data: FormCatProps) => {

    setIsLoading(true)
    
    api.post('/gatos', {
      id: uuidv4(),
      cat_id: personId,
      nome: data.nome,
      raca: data.raca,
      peso: data.peso,
      cor: data.cor
    })
    .then(function (response) {
      router.push(`/person/${personId}`)
      reset()
      setIsLoading(false)
    })
    .catch(function (error) {
      setIsLoading(false)
      console.log(error);
    });
  };


  const racaRef = useRef<TextInput>(null);
  const pesoRef = useRef<TextInput>(null);
  const corRef = useRef<TextInput>(null);

  if(isLoading){
    return (
      <Loading />
    )
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.info}>
        
        <Text style={styles.texto}>Cadastre um gato</Text>

        <Input 
          error={errors.nome?.message}
          formProps={{
            control,
            name: "nome",
          }}
          inputProps={{
            placeholder: "Nome",
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
              placeholder: "Raça",
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
              placeholder: "Peso",
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
              placeholder: "Cor",
            }}
          />
        </View>
      

        <View style={styles.botoes}>
          <Button title='Salvar' onPress={handleSubmit(onSubmit)} />
          <Button title='Cancelar' type="danger" onPress={() => router.back()} />
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center"
  },
  texto: {
    marginBottom: 20,
    fontSize: 15
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
  }
});