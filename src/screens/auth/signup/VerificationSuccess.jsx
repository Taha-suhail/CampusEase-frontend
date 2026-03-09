import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AppSafeView from "../../../components/views/AppSafeView";
import { s, vs } from "react-native-size-matters";

const VerificationSuccess = ({ onSignupComplete }) => {
  return (
    <AppSafeView>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginHorizontal: s(16),
          marginTop: vs(50),
          gap: s(20),
          //   justifyContent: "center",
        }}
      >
        <View>
          <Image
            source={require("../../../assets/icons/Soft Outer Circle.png")}
            resizeMode="contain"
            style={styles.img}
          />
        </View>
        {/* texts */}
        <View>
          <Text
            style={{ fontSize: s(24), fontWeight: "500", textAlign: "center" }}
          >
            Verification Successful!
          </Text>
          <Text
            style={{
              color: "#64748B",
              fontSize: s(16),
              textAlign: "center",
              marginTop: vs(16),
            }}
          >
            Your account is now verified. You are ready to explore your campus
            life.
          </Text>
        </View>
        {/* button */}
        <TouchableOpacity style={styles.button} onPress={onSignupComplete}>
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </AppSafeView>
  );
};

export default VerificationSuccess;

const styles = StyleSheet.create({
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
