import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AppSafeView from "../../components/views/AppSafeView";
import { s, vs } from "react-native-size-matters";

const Dashboard = ({ onLogout }) => {
  return (
    <AppSafeView>
      <View style={styles.container}>
        <Text>Hello World</Text>
        <TouchableOpacity style={styles.button} onPress={onLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </AppSafeView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(24),
  },
  img: {
    width: 200,
    height: 200,
  },
  buttonText: {
    fontSize: s(16),
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#30E8C9",
    width: "100%",
    alignItems: "center",
    paddingVertical: vs(16),
    borderRadius: s(50),
    position: "absolute",
    bottom: 0,
  },
});
