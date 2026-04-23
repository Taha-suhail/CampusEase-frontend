import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { s, vs } from "react-native-size-matters";
const InputWithIcon = ({
  value,
  onChangeText,
  placeholder = "student@university.edu",
  keyboardType = "email-address",
  autoCapitalize = "none",
}) => {
  return (
    <View style={styles.container}>
      {/* <Feather name="mail" size={24} color="#64748B" /> */}
      <TextInput
        style={{ fontSize: s(16) }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={"#64748B"}
      />
    </View>
  );
};

export default InputWithIcon;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#ceb5b5",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#64748B",
    borderRadius: s(12),
    paddingStart: s(12),
    paddingVertical: vs(8),
  },
});
