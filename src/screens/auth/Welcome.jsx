import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { s, vs, ms } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

const Welcome = () => {
  const navigation = useNavigation();

  const features = [
    {
      icon: "school-outline",
      title: "Academic",
      desc: "Manage courses & classes",
    },
    {
      icon: "calendar-outline",
      title: "Attendance",
      desc: "Track daily attendance",
    },
    {
      icon: "document-text-outline",
      title: "Assignments",
      desc: "Submit & monitor tasks",
    },
    {
      icon: "notifications-outline",
      title: "Updates",
      desc: "Get instant notices",
    },
  ];

  return (
    <View style={styles.wrapper}>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroCard}>
            <View style={styles.logoCircle}>
              <Ionicons name="school" size={46} color="#fff" />
            </View>

            <Text style={styles.brand}>CampusEase</Text>

            <Text style={styles.tagline}>
              Smart Student ERP for Modern Campuses
            </Text>

            {/* Progress Dots */}
            <View style={styles.dotRow}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          {/* Feature Grid */}
          <View style={styles.grid}>
            {features.map((item, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.iconWrap}>
                  <Ionicons name={item.icon} size={22} color="#2563EB" />
                </View>

                <Text style={styles.featureTitle}>{item.title}</Text>

                <Text style={styles.featureDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>

          {/* CTA Section */}
          <View style={styles.ctaCard}>
            <Text style={styles.title}>Welcome Back!</Text>

            <Text style={styles.subtitle}>
              Access academic records, manage attendance, submit assignments and
              stay connected.
            </Text>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate("EnterEmail")}
            >
              <Text style={styles.primaryText}>Get Started</Text>

              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.secondaryText}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            © 2026 CampusEase. All rights reserved.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  safeArea: {
    flex: 1,
  },

  container: {
    paddingHorizontal: s(20),
    paddingBottom: vs(28),
  },

  heroCard: {
    marginTop: vs(10),
    backgroundColor: "#FFFFFF",
    borderRadius: s(26),
    padding: s(24),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  logoCircle: {
    width: s(92),
    height: s(92),
    borderRadius: s(46),
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },

  brand: {
    marginTop: vs(16),
    fontSize: ms(30),
    fontWeight: "900",
    color: "#0F172A",
  },

  tagline: {
    marginTop: vs(8),
    fontSize: ms(14),
    color: "#64748B",
    textAlign: "center",
    lineHeight: vs(20),
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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: vs(18),
  },

  featureCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: s(18),
    padding: s(16),
    marginBottom: vs(12),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  iconWrap: {
    width: s(42),
    height: s(42),
    borderRadius: s(21),
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(10),
  },

  featureTitle: {
    fontSize: ms(14),
    fontWeight: "800",
    color: "#0F172A",
  },

  featureDesc: {
    marginTop: vs(4),
    fontSize: ms(12),
    color: "#64748B",
    lineHeight: vs(18),
  },

  ctaCard: {
    marginTop: vs(6),
    backgroundColor: "#fff",
    borderRadius: s(24),
    padding: s(22),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  title: {
    fontSize: ms(24),
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },

  subtitle: {
    marginTop: vs(10),
    fontSize: ms(14),
    color: "#64748B",
    textAlign: "center",
    lineHeight: vs(22),
  },

  primaryBtn: {
    marginTop: vs(24),
    backgroundColor: "#2563EB",
    borderRadius: s(18),
    paddingVertical: vs(16),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  primaryText: {
    color: "#fff",
    fontSize: ms(16),
    fontWeight: "700",
    marginRight: s(8),
  },

  secondaryBtn: {
    marginTop: vs(14),
    paddingVertical: vs(8),
  },

  secondaryText: {
    textAlign: "center",
    color: "#2563EB",
    fontSize: ms(14),
    fontWeight: "700",
  },

  footer: {
    marginTop: vs(18),
    textAlign: "center",
    color: "#94A3B8",
    fontSize: ms(12),
  },
});
