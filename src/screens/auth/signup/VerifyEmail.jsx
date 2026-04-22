import React, { useRef, useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { s, vs, ms } from "react-native-size-matters";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";

import PrimaryHeader from "../../../components/headers/PrimaryHeader";
import { VERIFYOTP } from "../../../services/AuthServices";

const VerifyEmail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const email = route?.params?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [isVerifying, setIsVerifying] = useState(false);

  const inputs = useRef([]);

  const maskedEmail = (() => {
    if (!email || !email.includes("@")) {
      return "s***@university.edu";
    }

    const [local, domain] = email.split("@");

    return `${local[0]}***@${domain}`;
  })();

  // OTP Change
  const handleChange = (text, index) => {
    const value = text.replace(/[^0-9]/g, "");

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Verify
  const handleVerify = async () => {
    if (isVerifying) return;

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      Alert.alert("Invalid OTP", "Enter complete 6-digit code");
      return;
    }

    try {
      setIsVerifying(true);

      await VERIFYOTP({
        email,
        otp: otpValue,
      });

      navigation.navigate("VerificationSuccess");
    } catch (error) {
      Alert.alert("Verification Failed", error?.message || "Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.logoCircle}>
              <Image
                source={require("../../../assets/icons/Overlay.png")}
                style={styles.logo}
              />
            </View>

            <Text style={styles.title}>Verify Your Email</Text>

            <Text style={styles.subtitle}>
              We’ve sent a secure 6-digit verification code to your registered
              university email.
            </Text>

            <View style={styles.emailBadge}>
              <Ionicons name="mail-outline" size={16} color="#2563EB" />
              <Text style={styles.emailText}>{maskedEmail}</Text>
            </View>

            {/* Progress */}
            <View style={styles.progressRow}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={[styles.dot, styles.activeDot]} />
              <View style={[styles.dot, styles.activeDot]} />
            </View>

            <Text style={styles.step}>Step 3 of 3</Text>
          </View>

          {/* OTP Card */}
          <View style={styles.formCard}>
            <Text style={styles.otpLabel}>Enter OTP Code</Text>

            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={styles.otpInput}
                  value={digit}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === "Backspace" &&
                      !otp[index] &&
                      index > 0
                    ) {
                      inputs.current[index - 1]?.focus();
                    }
                  }}
                />
              ))}
            </View>

            {/* Security Note */}
            <View style={styles.infoBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#2563EB"
              />
              <Text style={styles.infoText}>
                Your OTP expires in 5 minutes for security.
              </Text>
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[styles.button, isVerifying && styles.disabledBtn]}
              onPress={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Verify & Continue</Text>

                  <Feather name="arrow-right" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Resend */}
            <TouchableOpacity>
              <Text style={styles.resend}>
                Didn’t receive the code?{" "}
                <Text style={styles.resendLink}>Resend Code</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    paddingHorizontal: s(20),
    paddingBottom: vs(40),
  },

  heroCard: {
    marginTop: vs(10),
    backgroundColor: "#fff",
    borderRadius: s(24),
    padding: s(24),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  logoCircle: {
    width: s(90),
    height: s(90),
    borderRadius: s(45),
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: s(62),
    height: s(62),
    resizeMode: "contain",
  },

  title: {
    marginTop: vs(16),
    fontSize: ms(24),
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: vs(10),
    textAlign: "center",
    fontSize: ms(14),
    color: "#64748B",
    lineHeight: vs(22),
  },

  emailBadge: {
    marginTop: vs(16),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    borderRadius: s(16),
  },

  emailText: {
    marginLeft: s(8),
    color: "#1D4ED8",
    fontWeight: "700",
    fontSize: ms(13),
  },

  progressRow: {
    flexDirection: "row",
    marginTop: vs(18),
  },

  dot: {
    width: s(10),
    height: s(10),
    borderRadius: s(5),
    backgroundColor: "#CBD5E1",
    marginHorizontal: s(5),
  },

  activeDot: {
    backgroundColor: "#2563EB",
  },

  step: {
    marginTop: vs(8),
    color: "#64748B",
    fontWeight: "700",
  },

  formCard: {
    marginTop: vs(18),
    backgroundColor: "#fff",
    borderRadius: s(24),
    padding: s(22),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  otpLabel: {
    fontSize: ms(14),
    fontWeight: "700",
    color: "#475569",
    marginBottom: vs(14),
    textAlign: "center",
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  otpInput: {
    width: s(48),
    height: vs(56),
    borderRadius: s(16),
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    textAlign: "center",
    fontSize: ms(22),
    fontWeight: "700",
    color: "#0F172A",
  },

  infoBox: {
    marginTop: vs(18),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: s(14),
    borderRadius: s(16),
  },

  infoText: {
    marginLeft: s(8),
    color: "#1D4ED8",
    fontSize: ms(13),
    flex: 1,
  },

  button: {
    marginTop: vs(24),
    backgroundColor: "#2563EB",
    borderRadius: s(18),
    paddingVertical: vs(16),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  disabledBtn: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: ms(16),
    fontWeight: "700",
    marginRight: s(8),
  },

  resend: {
    marginTop: vs(18),
    textAlign: "center",
    color: "#64748B",
    fontSize: ms(14),
  },

  resendLink: {
    color: "#2563EB",
    fontWeight: "700",
  },
});
