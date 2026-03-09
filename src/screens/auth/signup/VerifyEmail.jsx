
import React, { useRef, useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AppSafeView from "../../../components/views/AppSafeView";
import { s, vs } from "react-native-size-matters";
import PrimaryHeader from "../../../components/headers/PrimaryHeader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { VERIFYOTP } from "../../../services/AuthServices";

const VerifyEmail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputs = useRef([]);
  const email = route?.params?.email || "";

  const maskedEmail = (() => {
    if (!email || !email.includes("@")) {
      return "s***@uni.edu";
    }

    const [localPart, domain] = email.split("@");
    if (!localPart) {
      return `***@${domain || "uni.edu"}`;
    }

    return `${localPart[0]}***@${domain}`;
  })();

  const handleChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    if (isVerifying) {
      return;
    }

    if (!email) {
      Alert.alert("Missing email", "Please restart signup from email step.");
      return;
    }

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setIsVerifying(true);
      await VERIFYOTP({ email, otp: otpValue });
      navigation.navigate("VerificationSuccess");
    } catch (error) {
      Alert.alert("OTP verification failed", error?.message || "Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AppSafeView>
      <View style={styles.container}>
        <PrimaryHeader />

        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/icons/Overlay.png")} // replace with your image
            style={styles.img}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Verify your email</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to your{"\n"}university email{" "}
          <Text style={styles.email}>{maskedEmail}</Text>
        </Text>

        {/* OTP Input */}
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
                  inputs.current[index - 1].focus();
                }
              }}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleVerify}
        >
          <Text style={styles.buttonText}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>

        {/* Resend */}
        <Text style={styles.resend}>
          Didn't receive the code?{" "}
          <Text style={styles.resendLink}>Resend Code</Text>
        </Text>
      </View>
    </AppSafeView>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: s(20),
  },

  back: {
    alignSelf: "flex-start",
    fontSize: 28,
    marginTop: 10,
  },

  //   logoContainer: {
  //     width: 220,
  //     height: 220,
  //     borderRadius: 120,
  //     backgroundColor: "#cfe5e2",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     marginTop: 30,
  //   },

  //   logo: {
  //     width: 80,
  //     height: 80,
  //     resizeMode: "contain",
  //   },
  img: {
    width: 200,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: vs(16),
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 30,
    color: "#1f2937",
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 15,
    marginTop: 10,
    lineHeight: 22,
  },

  email: {
    color: "#1abc9c",
    fontWeight: "600",
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    width: "100%",
  },

  otpInput: {
    width: 48,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e5e7eb",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },

  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#22c1a1",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    shadowColor: "#22c1a1",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  resend: {
    marginTop: 20,
    color: "#6b7280",
  },

  resendLink: {
    color: "#22c1a1",
    fontWeight: "600",
  },
});
