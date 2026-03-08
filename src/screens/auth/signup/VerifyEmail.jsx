// import { Image, StyleSheet, Text, View } from "react-native";
// import React, { useState } from "react";
// import AppSafeView from "../../../components/views/AppSafeView";
// import PrimaryHeader from "../../../components/headers/PrimaryHeader";
// import OtpInput from "../../../components/inputs/OtpInput";
// import { s, vs } from "react-native-size-matters";

// const VerifyEmail = () => {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   return (
//     <AppSafeView>
//       <PrimaryHeader />
//       <View>
//         <View>
//           <Image
//             source={require("../../../assets/icons/Overlay.png")}
//             resizeMode="contain"
//             style={styles.img}
//           />
//         </View>

//         <Text style={styles.verifyTxt}>Verify your email</Text>
//         <View style={{ flexDirection: "row" }}>
//           <Text
//             style={{ fontSize: s(14), color: "#64748B", textAlign: "center" }}
//           >
//             We've sent a 6-digit code to your university email{" "}
//           </Text>
//           <Text>s**@uni.dev</Text>
//         </View>
//       </View>
//     </AppSafeView>
//   );
// };

// export default VerifyEmail;

// const styles = StyleSheet.create({
//   img: {
//     width: 200,
//     height: 150,
//     alignItems: "center",
//     justifyContent: "center",
//     alignSelf: "center",
//     marginTop: vs(16),
//   },
//   verifyTxt: {
//     fontSize: s(24),
//     textAlign: "center",
//     fontWeight: "500",
//     marginTop: vs(16),
//   },
// });

import React, { useRef, useState } from "react";
import {
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
import { useNavigation } from "@react-navigation/native";

const VerifyEmail = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
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
          <Text style={styles.email}>s***@uni.edu</Text>
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
          onPress={() => navigation.navigate("VerificationSuccess")}
        >
          <Text style={styles.buttonText}>Verify</Text>
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
