import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { s, vs, ms } from "react-native-size-matters";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

import PrimaryHeader from "../../../components/headers/PrimaryHeader";
import Logo from "../../../assets/icons/Logo";
import InputWithIcon from "../../../components/inputs/InputWithIcon";
import { CHECKELIGIBILITY } from "../../../services/AuthServices";

const EnterEmail = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleContinue = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert("Email Required", "Please enter your university email.");
      return;
    }

    if (isChecking) return;

    try {
      setIsChecking(true);

      const response = await CHECKELIGIBILITY(trimmedEmail);

      navigation.navigate("VerifyDetails", {
        email: trimmedEmail,
        eligibilityData: response?.data || null,
      });
    } catch (error) {
      Alert.alert("Verification Failed", error?.message || "Please try again.");
    } finally {
      setIsChecking(false);
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
              <Logo width={s(68)} height={s(68)} />
            </View>

            <Text style={styles.title}>Verify Your Identity</Text>

            <Text style={styles.subtitle}>
              Enter your official university email to securely validate your
              student account and continue onboarding.
            </Text>

            {/* Progress */}
            <View style={styles.progressRow}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>

            <Text style={styles.step}>Step 1 of 3</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.label}>University Email</Text>

            <InputWithIcon
              value={email}
              onChangeText={setEmail}
              placeholder="name@university.edu"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Info */}
            <View style={styles.infoBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#2563EB"
              />

              <Text style={styles.infoText}>
                Only verified .edu or university domains are accepted.
              </Text>
            </View>

            {/* Feature Cards */}
            <View style={styles.features}>
              <FeatureItem text="Secure university verification" />
              <FeatureItem text="Fast onboarding process" />
              <FeatureItem text="No spam or unnecessary emails" />
            </View>

            {/* Button */}
            <TouchableOpacity
              style={[styles.button, isChecking && styles.disabledBtn]}
              onPress={handleContinue}
              disabled={isChecking}
            >
              {isChecking ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Continue</Text>

                  <Feather name="arrow-right" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.terms}>
              By continuing, you agree to our Terms & Privacy Policy.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EnterEmail;

/* ----------------------------- */
/* Feature Item */
/* ----------------------------- */

const FeatureItem = ({ text }) => (
  <View style={styles.featureRow}>
    <View style={styles.featureIcon}>
      <Feather name="check" size={12} color="#16A34A" />
    </View>

    <Text style={styles.featureText}>{text}</Text>
  </View>
);

/* ----------------------------- */
/* Styles */
/* ----------------------------- */

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

  title: {
    marginTop: vs(16),
    fontSize: ms(24),
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: vs(10),
    textAlign: "center",
    color: "#64748B",
    fontSize: ms(14),
    lineHeight: vs(22),
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

  label: {
    fontSize: ms(14),
    fontWeight: "700",
    color: "#334155",
    marginBottom: vs(10),
  },

  infoBox: {
    marginTop: vs(14),
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
    lineHeight: vs(18),
  },

  features: {
    marginTop: vs(18),
    gap: vs(10),
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  featureIcon: {
    width: s(22),
    height: s(22),
    borderRadius: s(11),
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },

  featureText: {
    marginLeft: s(10),
    fontSize: ms(13),
    color: "#475569",
  },

  button: {
    marginTop: vs(26),
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

  terms: {
    marginTop: vs(16),
    textAlign: "center",
    color: "#94A3B8",
    fontSize: ms(12),
    lineHeight: vs(18),
  },
});
