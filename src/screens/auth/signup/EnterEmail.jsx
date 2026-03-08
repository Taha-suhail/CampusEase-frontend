import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppSafeView from "../../../components/views/AppSafeView";
import PrimaryHeader from "../../../components/headers/PrimaryHeader";
import { s, vs } from "react-native-size-matters";
import Logo from "../../../assets/icons/Logo";
import InputWithIcon from "../../../components/inputs/InputWithIcon";
import PrimaryBtn from "../../../components/buttons/PrimaryBtn";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
const EnterEmail = () => {
  const navigation = useNavigation();
  return (
    <AppSafeView>
      <PrimaryHeader />
      <View style={styles.logoContainer}>
        <Logo width={s(100)} height={vs(100)} />
      </View>
      <View style={{ paddingHorizontal: s(12), gap: s(12), marginTop: vs(12) }}>
        <Text style={{ fontSize: s(18), color: "#000", fontWeight: "500" }}>
          University Email
        </Text>
        <InputWithIcon />
        <View style={{ flexDirection: "row", alignItems: "center", gap: s(6) }}>
          <AntDesign name="exclamation-circle" size={s(15)} color="black" />
          <Text>Please use your university email</Text>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: s(12),
          position: "absolute",
          bottom: 0,
          flex: 1,
          width: "100%",
        }}
      >
        <PrimaryBtn
          btnText={"Continue to Campus Ease"}
          onPress={() => navigation.navigate("VerifyDetails")}
        />
      </View>
    </AppSafeView>
  );
};

export default EnterEmail;

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: vs(14),
    alignItems: "center",
  },
});
