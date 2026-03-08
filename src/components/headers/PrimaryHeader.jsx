import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { s, vs } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

const PrimaryHeader = ({ headerText }) => {
  const navigation = useNavigation();
  const goBack = () => {
    if (navigation.goBack()) {
      navigation.goBack();
    } else {
      //   Alert.alert("Are you sure you want to exit");
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <AntDesign name="arrow-left" size={s(20)} color="black" />
      </TouchableOpacity>

      <Text style={styles.textStyle}>Campus Ease</Text>
    </View>
  );
};

export default PrimaryHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: s(8),
  },
  textStyle: {
    textAlign: "center",
    color: "#000",
    flex: 1,
    fontSize: s(20),
    fontWeight: "bold",
  },
});
