import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { s, vs } from "react-native-size-matters";
const PrimaryBtn = ({ btnText, style, txtStyle, onPress }) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={[styles.TxtStyle, txtStyle]}>{btnText}</Text>
        <View style={{ position: "absolute", right: s(10) }}>
          <AntDesign name="arrow-right" size={s(18)} color="black" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PrimaryBtn;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#17CFB0",
    borderRadius: s(10),
    paddingVertical: vs(16),
    marginVertical: vs(12),
  },
  TxtStyle: {
    fontSize: s(16),
    color: "#000",
    fontWeight: "500",
  },
});
