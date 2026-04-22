import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs, ms } from "react-native-size-matters";

import { ADD_TEACHER } from "../../services/AdminServices";

const AddTeacher = ({ navigation }) => {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [employeeId, setEmployeeId] = useState("");

  const [department, setDepartment] = useState("");

  const [loading, setLoading] = useState(false);

  const handleAddTeacher = async () => {
    if (!name || !email || !employeeId || !department) {
      Alert.alert("Required", "Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await ADD_TEACHER({
        name,
        email,
        employeeId,
        department,
      });

      if (res.success) {
        Alert.alert("Success", "Teacher added successfully.");

        navigation.goBack();
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Add Teacher</Text>

          <View
            style={{
              width: s(40),
            }}
          />
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.glow1} />
          <View style={styles.glow2} />

          <View style={styles.heroIcon}>
            <Ionicons name="person-outline" size={34} color="#fff" />
          </View>

          <Text style={styles.heroTitle}>New Teacher</Text>

          <Text style={styles.heroSub}>
            Register faculty credentials and give teaching access.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <InputField
            label="Full Name *"
            icon="person-outline"
            placeholder="Waseem Khan"
            value={name}
            onChangeText={setName}
          />

          <InputField
            label="Email *"
            icon="mail-outline"
            placeholder="teacher@email.com"
            value={email}
            onChangeText={setEmail}
          />

          <InputField
            label="Employee ID *"
            icon="card-outline"
            placeholder="1020"
            value={employeeId}
            onChangeText={setEmployeeId}
          />

          <InputField
            label="Department *"
            icon="business-outline"
            placeholder="CSE"
            value={department}
            onChangeText={setDepartment}
          />

          {/* Submit */}
          <TouchableOpacity
            style={styles.submitBtn}
            disabled={loading}
            onPress={handleAddTeacher}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.submitText}>Add Teacher</Text>

                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>CampusEase Admin Portal</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTeacher;

/* ---------- Components ---------- */

const InputField = ({ label, icon, ...props }) => (
  <View style={styles.group}>
    <Text style={styles.label}>{label}</Text>

    <View style={styles.inputWrap}>
      <Ionicons name={icon} size={18} color="#64748B" />

      <TextInput
        style={styles.input}
        placeholderTextColor="#94A3B8"
        {...props}
      />
    </View>
  </View>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    paddingHorizontal: s(18),
    paddingBottom: vs(30),
  },

  header: {
    marginTop: vs(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: ms(20),
    fontWeight: "900",
    color: "#0F172A",
  },

  heroCard: {
    marginTop: vs(18),
    backgroundColor: "#2563EB",
    borderRadius: s(26),
    padding: s(24),
    overflow: "hidden",
    alignItems: "center",
  },

  glow1: {
    position: "absolute",
    width: s(120),
    height: s(120),
    borderRadius: s(60),
    backgroundColor: "rgba(255,255,255,0.10)",
    top: -20,
    right: -20,
  },

  glow2: {
    position: "absolute",
    width: s(100),
    height: s(100),
    borderRadius: s(50),
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -20,
    left: -20,
  },

  heroIcon: {
    width: s(72),
    height: s(72),
    borderRadius: s(36),
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  heroTitle: {
    marginTop: vs(14),
    fontSize: ms(26),
    fontWeight: "900",
    color: "#fff",
  },

  heroSub: {
    marginTop: vs(8),
    color: "#DBEAFE",
    fontSize: ms(14),
    textAlign: "center",
  },

  formCard: {
    marginTop: vs(16),
    backgroundColor: "#fff",
    borderRadius: s(24),
    padding: s(18),
  },

  group: {
    marginBottom: vs(14),
  },

  label: {
    marginBottom: vs(6),
    fontSize: ms(13),
    fontWeight: "800",
    color: "#334155",
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: s(16),
    paddingHorizontal: s(12),
  },

  input: {
    flex: 1,
    paddingVertical: vs(14),
    paddingLeft: s(10),
    color: "#0F172A",
    fontSize: ms(14),
  },

  submitBtn: {
    marginTop: vs(10),
    backgroundColor: "#2563EB",
    borderRadius: s(18),
    paddingVertical: vs(16),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: ms(16),
    marginRight: s(8),
  },

  cancelBtn: {
    marginTop: vs(10),
    paddingVertical: vs(14),
    borderRadius: s(16),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  cancelText: {
    color: "#64748B",
    fontWeight: "800",
    fontSize: ms(14),
  },

  footer: {
    marginTop: vs(18),
    textAlign: "center",
    color: "#94A3B8",
    fontSize: ms(12),
  },
});
