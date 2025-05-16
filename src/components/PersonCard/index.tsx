import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & {
  id: string,
  name: string
}

export function PersonCard({ name, id, ...rest }: Props) {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Text style={styles.text}>{name}</Text>
      <AntDesign name="arrowright" size={18} color="#313131" />
    </TouchableOpacity>
  )
}

export const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    height: 56,
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    padding: 16,
    borderColor: "#c7c7c7",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: 'row'
  },
  text: {
    color: "#313131",
    fontSize: 16,
    fontWeight: "bold"
  }
});