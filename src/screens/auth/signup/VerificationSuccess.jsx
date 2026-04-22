import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, vs, ms } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const VerificationSuccess = () => {
  const navigation = useNavigation();
  const [count, setCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const goNow = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Image */}
          <View style={styles.imageWrap}>
            <Image
              source={require("../../../assets/icons/Soft Outer Circle.png")}
              resizeMode="contain"
              style={styles.img}
            />

            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={34} color="#fff" />
            </View>
          </View>

          <Text style={styles.title}>Verification Successful!</Text>

          <Text style={styles.subtitle}>
            Your account has been verified successfully.
          </Text>

          <Text style={styles.redirectText}>
            Redirecting to Login in {count}s...
          </Text>
        </View>

        {/* Manual Button */}
        <TouchableOpacity style={styles.button} onPress={goNow}>
          <Text style={styles.buttonText}>Go to Login Now</Text>

          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerificationSuccess;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: s(20),
    paddingVertical: vs(30),
  },

  card: {
    marginTop: vs(40),
    backgroundColor: "#fff",
    borderRadius: s(26),
    padding: s(24),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  imageWrap: {
    width: s(180),
    height: s(180),
    justifyContent: "center",
    alignItems: "center",
  },

  img: {
    width: "100%",
    height: "100%",
  },

  checkCircle: {
    position: "absolute",
    width: s(70),
    height: s(70),
    borderRadius: s(35),
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginTop: vs(20),
    fontSize: ms(28),
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
  },

  subtitle: {
    marginTop: vs(10),
    fontSize: ms(15),
    color: "#64748B",
    textAlign: "center",
  },

  redirectText: {
    marginTop: vs(18),
    fontSize: ms(14),
    color: "#2563EB",
    fontWeight: "700",
  },

  button: {
    backgroundColor: "#2563EB",
    borderRadius: s(18),
    paddingVertical: vs(16),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: ms(16),
    fontWeight: "800",
    marginRight: s(8),
  },
});
