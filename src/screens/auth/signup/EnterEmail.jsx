import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import AppSafeView from "../../../components/views/AppSafeView";
import PrimaryHeader from "../../../components/headers/PrimaryHeader";
import { s, vs } from "react-native-size-matters";
import Logo from "../../../assets/icons/Logo";
import InputWithIcon from "../../../components/inputs/InputWithIcon";
import PrimaryBtn from "../../../components/buttons/PrimaryBtn";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { CHECKELIGIBILITY } from "../../../services/AuthServices";
const EnterEmail = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleContinue = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert("Email required", "Please enter your university email.");
      return;
    }

    if (isChecking) {
      return;
    }

    try {
      setIsChecking(true);
      const response = await CHECKELIGIBILITY(trimmedEmail);
      navigation.navigate("VerifyDetails", {
        email: trimmedEmail,
        eligibilityData: response?.data || null,
      });
    } catch (error) {
      Alert.alert(
        "Eligibility check failed",
        error?.message || "Please try again."
      );
    } finally {
      setIsChecking(false);
    }
  };

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
        <InputWithIcon value={email} onChangeText={setEmail} />
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
          btnText={isChecking ? "Checking..." : "Continue to Campus Ease"}
          onPress={handleContinue}
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
