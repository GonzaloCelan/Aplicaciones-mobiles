import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export default function CustomButton({title,onPress,}: Props) {

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  button: {
    backgroundColor: "#751b79",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 25,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

});