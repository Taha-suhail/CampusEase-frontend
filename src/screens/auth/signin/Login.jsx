import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppSafeView from "../../../components/views/AppSafeView";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();
  return (
    <AppSafeView style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        {/* Replace this with your logo */}
        <View style={styles.logoPlaceholder} />

        <Text style={styles.title}>Campus Ease</Text>
        <Text style={styles.subtitle}>Your University, Simplified.</Text>
      </View>

      {/* Email */}
      <Text style={styles.label}>University Email</Text>

      <TextInput
        style={styles.input}
        placeholder="name@university.edu"
        placeholderTextColor="#9ca3af"
        keyboardType="email-address"
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your password"
          placeholderTextColor="#9ca3af"
          secureTextEntry={!passwordVisible}
        />

        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons
            name={passwordVisible ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#9ca3af"
          />
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or continue with</Text>
        <View style={styles.line} />
      </View>

      {/* Social Login */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
            }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/732/732221.png",
            }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Microsoft</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signupRow}>
        <Text style={styles.signupText}>New here?</Text>

        <TouchableOpacity onPress={() => navigation.navigate("EnterEmail")}>
          <Text style={styles.signupLink}>Create an account</Text>
        </TouchableOpacity>
      </View>
    </AppSafeView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 25,
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },

  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e5e7eb",
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },

  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 30,
    height: 55,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 30,
    height: 55,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
  },

  forgot: {
    color: "#2563eb",
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 25,
    fontWeight: "500",
  },

  loginButton: {
    backgroundColor: "#2563eb",
    height: 60,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#d1d5db",
  },

  orText: {
    marginHorizontal: 10,
    color: "#6b7280",
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },

  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  socialText: {
    fontSize: 16,
    fontWeight: "500",
  },

  signup: {
    textAlign: "center",
    marginTop: 35,
    color: "#6b7280",
  },

  signupLink: {
    color: "#2563eb",
    fontWeight: "600",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },
});
