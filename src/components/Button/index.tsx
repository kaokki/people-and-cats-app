import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = TouchableOpacityProps & {
  title: string;
  type?: 'normal' | 'danger'
}

export function Button({ title, type = 'normal', ...rest }: ButtonProps) {
  return (
    <TouchableOpacity style={[styles.container, type === "danger" && styles.containerDelete ]} {...rest}>
      <Text style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 56,
    width: "100%",
    backgroundColor: "#8257e5",
    justifyContent: "center",
    padding: 16,
    flexShrink: 1
  },
  containerDelete: {
    backgroundColor: "#f76868",
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold"
  },
});