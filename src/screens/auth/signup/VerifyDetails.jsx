import React, { useState } from "react";
import {
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
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppSafeView from "../../../components/views/AppSafeView";
import PrimaryHeader from "../../../components/headers/PrimaryHeader";
import { useNavigation } from "@react-navigation/native";

const VerifyDetails = () => {
  const [name, setName] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [branch, setBranch] = useState("");
  const [batch, setBatch] = useState("");
  const navigation = useNavigation();
  return (
    <AppSafeView style={{ backgroundColor: "#F4F6F8" }}>
      <PrimaryHeader headerText="Verify Details" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Student Verification</Text>

            <Text style={styles.subtitle}>
              Please ensure your academic details match your University ID. If
              you find any discrepancies, contact the Registrar office.
            </Text>

            <InputField
              label="FULL NAME"
              value={name}
              onChangeText={setName}
              verified
            />

            <InputField
              label="ENROLLMENT NUMBER"
              value={enrollment}
              onChangeText={setEnrollment}
              verified
            />

            <InputField
              label="DEPARTMENT / BRANCH"
              value={branch}
              onChangeText={setBranch}
              verified
            />

            <InputField
              label="ACADEMIC BATCH"
              value={batch}
              onChangeText={setBatch}
            />

            {/* Info Box */}

            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#2C6ED5"
              />

              <Text style={styles.infoText}>
                Information is fetched directly from the university database.
                Read-only access ensures data integrity during the onboarding
                phase.
              </Text>
            </View>

            {/* Button */}

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("VerifyEmail")}
            >
              <Text style={styles.buttonText}>Verify and Continue</Text>
              <Feather name="chevron-right" size={20} color="white" />
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default VerifyDetails;

const InputField = ({ label, value, onChangeText, verified }) => {
  return (
    <View style={{ marginTop: 22 }}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputBox}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder="Enter here"
          placeholderTextColor="#9CA3AF"
        />

        {verified && (
          <View style={styles.verifiedIcon}>
            <Feather name="check" size={14} color="white" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 10,
    lineHeight: 22,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
    letterSpacing: 1,
  },

  inputBox: {
    marginTop: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    fontSize: 17,
    color: "#111827",
    paddingVertical: 12,
  },

  verifiedIcon: {
    backgroundColor: "#2C6ED5",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  infoBox: {
    marginTop: 26,
    flexDirection: "row",
    backgroundColor: "#E8F0FE",
    padding: 16,
    borderRadius: 14,
  },

  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#2C6ED5",
    marginLeft: 10,
    lineHeight: 20,
  },

  button: {
    marginTop: 40,
    backgroundColor: "#2C6ED5",
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 6,
  },
});
