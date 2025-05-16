import { forwardRef } from 'react';
import { Controller, UseControllerProps } from "react-hook-form";
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

type InputProps = {
  inputProps: TextInputProps;
  formProps: UseControllerProps;
  error?: string;
}

const Input = forwardRef<TextInput, InputProps>(({ formProps, inputProps, error = '' }, ref) => {
  return (
    <Controller {...formProps}
        render={({ field: { onChange, value } }) => (
          <View style={styles.control}>
          <TextInput
            ref={ref}
            style={styles.input}
            onChangeText={onChange}
            value={value}
            {...inputProps}
          />
          {
            error.length > 0 &&
            <Text style={styles.error}>
              {error}
            </Text>
          }
          </View>
          
        )}
      />
  );
})

const styles = StyleSheet.create({
  control: {
    marginBottom: 15,
    width: "100%"
  },
  input: {
    backgroundColor: "#fff",
    height: 40,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderBlockColor: "#4e4a4a",
    width: "100%"
  },
  error: { 
    color: "red",
    fontSize: 12,
    marginTop: 5
  }
});

export { Input };

