import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

import PrimaryHeader from "../../../components/headers/PrimaryHeader";
import { REGISTERUSER } from "../../../services/AuthServices";

const VerifyDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { email, eligibilityData } = route?.params || {};
  const data = eligibilityData?.data || eligibilityData || {};

  const [name, setName] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setName(data?.name || "");
    setEnrollment(data?.rollNo || "");
    setBranch([data?.department, data?.branch].filter(Boolean).join(" / "));
    setSection(data?.section || "");
  }, []);

  const userEmail = email || data?.email || "";

  const handleContinue = async () => {
    if (!userEmail) {
      Alert.alert("Missing Email", "Please restart signup process.");
      return;
    }

    try {
      setSending(true);

      await REGISTERUSER({
        fullName: name,
        email: userEmail,
      });

      navigation.navigate("VerifyEmail", {
        email: userEmail,
      });
    } catch (error) {
      Alert.alert("Failed", error?.message || "Could not send OTP");
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Top Card */}
            <View style={styles.heroCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {name?.charAt(0)?.toUpperCase() || "S"}
                </Text>
              </View>

              <Text style={styles.title}>Student Verification</Text>

              <Text style={styles.subtitle}>
                We found your academic details in the university database.
                Please review and continue securely.
              </Text>

              <View style={styles.progressRow}>
                <View style={[styles.progressDot, styles.activeDot]} />
                <View style={[styles.progressDot, styles.activeDot]} />
                <View style={styles.progressDot} />
              </View>

              <Text style={styles.stepText}>Step 2 of 3</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <InputField
                label="FULL NAME"
                value={name}
                onChangeText={setName}
                icon="user"
                verified
              />

              <InputField
                label="ENROLLMENT NUMBER"
                value={enrollment}
                onChangeText={setEnrollment}
                icon="hash"
                verified
              />

              <InputField
                label="DEPARTMENT / BRANCH"
                value={branch}
                onChangeText={setBranch}
                icon="book-open"
                verified
              />

              <InputField
                label="SECTION"
                value={section}
                onChangeText={setSection}
                icon="layers"
                verified
              />

              {/* Info */}
              <View style={styles.infoBox}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#2563EB"
                />

                <Text style={styles.infoText}>
                  Verified data is synced directly from university records to
                  ensure identity accuracy.
                </Text>
              </View>

              {/* CTA */}
              <TouchableOpacity
                style={[styles.button, sending && styles.disabledBtn]}
                onPress={handleContinue}
                disabled={sending}
              >
                {sending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Verify & Continue</Text>

                    <Feather name="arrow-right" size={18} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyDetails;

/* -------------------------------- */
/* Input Field */
/* -------------------------------- */

const InputField = ({ label, value, onChangeText, verified, icon }) => {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputBox}>
        <Feather
          name={icon}
          size={18}
          color="#64748B"
          style={{ marginRight: 10 }}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder="Enter here"
          placeholderTextColor="#94A3B8"
        />

        {verified && (
          <View style={styles.verifiedBadge}>
            <Feather name="check" size={12} color="#fff" />
          </View>
        )}
      </View>
    </View>
  );
};

/* -------------------------------- */
/* Styles */
/* -------------------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    marginTop: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  title: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
  },

  progressRow: {
    flexDirection: "row",
    marginTop: 18,
  },

  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 5,
  },

  activeDot: {
    backgroundColor: "#2563EB",
  },

  stepText: {
    marginTop: 8,
    color: "#64748B",
    fontWeight: "600",
  },

  formCard: {
    marginTop: 18,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  inputWrap: {
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#64748B",
    marginBottom: 8,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0F172A",
  },

  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
  },

  infoBox: {
    marginTop: 6,
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    padding: 14,
    borderRadius: 16,
    alignItems: "flex-start",
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 20,
    color: "#1D4ED8",
  },

  button: {
    marginTop: 24,
    backgroundColor: "#2563EB",
    borderRadius: 18,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  disabledBtn: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
});
