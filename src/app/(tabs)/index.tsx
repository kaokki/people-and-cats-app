import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Loading } from '@/components/Loading';
import { api } from '@/services/api';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export type FormProps = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormProps>()


  const onSubmit = (data: FormProps) => {

    setIsLoading(true)
    
    api.post('/people', {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address
    })
    .then(function (response) {
      router.navigate('/people')
      reset()
      setIsLoading(false)
    })
    .catch(function (error) {
      setIsLoading(false)
      console.log(error);
    });
  };


  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);

  if(isLoading){
    return (
      <Loading />
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Cadastre uma pessoa</Text>

      <Input 
        error={errors.name?.message}
        formProps={{
          control,
          name: "name",
          rules: {
            required: "Nome é obrigatório."
          }
        }}
        inputProps={{
          placeholder: "Nome",
          onSubmitEditing: () => emailRef.current?.focus(),
          returnKeyType: "next"
        }}
      />

      <Input 
        ref={emailRef}
        error={errors.email?.message}
        formProps={{
          control,
          name: "email",
          rules: {
            required: "E-mail é obrigatório."
          }
        }}
        inputProps={{
          placeholder: "E-mail",
          onSubmitEditing: () => phoneRef.current?.focus(),
          returnKeyType: "next"
        }}
      />

      <Input 
        ref={phoneRef}
        formProps={{
          control,
          name: "phone",
          rules: {
            required: "Telefone é obrigatório."
          }
        }}
        inputProps={{
          placeholder: "Telefone",
          onSubmitEditing: () => addressRef.current?.focus(),
          returnKeyType: "next"
        }}
      />

      <Input 
        ref={addressRef}
        formProps={{
          control,
          name: "address"
        }}
        inputProps={{
          placeholder: "Endereço",
          returnKeyType: "send",
          onSubmitEditing: handleSubmit(onSubmit),
        }}
      />

      <Button 
        title='Cadastrar' 
        onPress={handleSubmit(onSubmit)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24
  },
  texto: {
    marginBottom: 20,
    fontSize: 15
  }
});