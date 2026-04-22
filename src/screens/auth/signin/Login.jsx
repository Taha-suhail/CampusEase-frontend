import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { s, vs, ms } from "react-native-size-matters";

import { LOGIN } from "../../../services/AuthServices";

const Login = ({ onSignupComplete }) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await LOGIN({
        email,
        password,
      });

      if (res.success) {
        const { accessToken, refreshToken, user } = res.data;

        await AsyncStorage.setItem("accessToken", accessToken);

        await AsyncStorage.setItem("refreshToken", refreshToken);

        await AsyncStorage.setItem("userRole", user.role);

        await AsyncStorage.setItem("campusease:isSignedUp", "true");

        onSignupComplete?.();
      } else {
        Alert.alert("Login Failed", res.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {/* Hero */}
          <View style={styles.heroCard}>
            <View style={styles.logoCircle}>
              <Ionicons name="school" size={40} color="#fff" />
            </View>

            <Text style={styles.brand}>CampusEase</Text>

            <Text style={styles.tagline}>
              Secure login to your student portal
            </Text>

            <View style={styles.dotRow}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={[styles.dot, styles.activeDot]} />
              <View style={[styles.dot, styles.activeDot]} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <Text style={styles.heading}>Welcome Back</Text>

            <Text style={styles.subHeading}>
              Login to continue your academic journey.
            </Text>

            {/* Email */}
            <Text style={styles.label}>University Email</Text>

            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color="#64748B" />

              <TextInput
                style={styles.input}
                placeholder="name@university.edu"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <Text style={styles.label}>Password</Text>

            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="#64748B" />

              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.disabledBtn]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginText}>Login</Text>

                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>New here?</Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("EnterEmail")}
              >
                <Text style={styles.footerLink}>Create an account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    paddingHorizontal: s(20),
    paddingBottom: vs(30),
  },

  heroCard: {
    marginTop: vs(12),
    backgroundColor: "#fff",
    borderRadius: s(24),
    padding: s(24),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  logoCircle: {
    width: s(84),
    height: s(84),
    borderRadius: s(42),
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  brand: {
    marginTop: vs(16),
    fontSize: ms(28),
    fontWeight: "900",
    color: "#0F172A",
  },

  tagline: {
    marginTop: vs(8),
    fontSize: ms(14),
    color: "#64748B",
    textAlign: "center",
  },

  dotRow: {
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

  formCard: {
    marginTop: vs(18),
    backgroundColor: "#fff",
    borderRadius: s(24),
    padding: s(22),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  heading: {
    fontSize: ms(24),
    fontWeight: "800",
    color: "#0F172A",
  },

  subHeading: {
    marginTop: vs(6),
    fontSize: ms(14),
    color: "#64748B",
    marginBottom: vs(22),
  },

  label: {
    fontSize: ms(13),
    fontWeight: "700",
    color: "#475569",
    marginBottom: vs(8),
    marginTop: vs(8),
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: s(16),
    paddingHorizontal: s(14),
  },

  input: {
    flex: 1,
    paddingVertical: vs(14),
    marginLeft: s(10),
    fontSize: ms(15),
    color: "#0F172A",
  },

  forgot: {
    textAlign: "right",
    marginTop: vs(12),
    color: "#2563EB",
    fontWeight: "700",
    fontSize: ms(13),
  },

  loginBtn: {
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

  loginText: {
    color: "#fff",
    fontSize: ms(16),
    fontWeight: "800",
    marginRight: s(8),
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: vs(22),
  },

  footerText: {
    color: "#64748B",
    fontSize: ms(14),
  },

  footerLink: {
    color: "#2563EB",
    fontSize: ms(14),
    fontWeight: "800",
    marginLeft: s(6),
  },
});
