import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppSafeView from "../../components/views/AppSafeView";
import PrimaryHeader from "../../components/headers/PrimaryHeader";
import Logo from "../../assets/icons/Logo";
import { s, vs } from "react-native-size-matters";
import PrimaryBtn from "../../components/buttons/PrimaryBtn";
import { useNavigation } from "@react-navigation/native";
const Welcome = () => {
  const navigation = useNavigation();
  return (
    <AppSafeView>
      <PrimaryHeader />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo width={s(100)} height={vs(100)} />
        </View>

        <Text style={styles.textStyle}>Welcome</Text>
        <Text
          style={{ color: "#64748B", fontSize: s(16), textAlign: "center" }}
        >
          Start your journey with your academic credentials to access your
          campus life.
        </Text>
        <View style={{ marginTop: vs(4) }}>
          <PrimaryBtn
            btnText={"Sign Up"}
            onPress={() => navigation.navigate("EnterEmail")}
          />
          <PrimaryBtn
            btnText={"Login in"}
            style={{ backgroundColor: "#136DEC" }}
            txtStyle={{ color: "#fff" }}
          />
        </View>
      </View>
    </AppSafeView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: vs(14),
    alignItems: "center",
  },
  container: {
    paddingHorizontal: s(12),
    marginTop: vs(50),
  },
  textStyle: {
    fontSize: s(30),
    fontWeight: "500",
    alignItems: "center",
    textAlign: "center",
  },
});
