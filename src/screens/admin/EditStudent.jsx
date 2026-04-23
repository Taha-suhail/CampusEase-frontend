import React, { useState, useEffect } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs, ms } from "react-native-size-matters";

import { UPDATE_STUDENT } from "../../services/AdminServices";

const EditStudent = ({ navigation, route }) => {
  const { student } = route.params || {};

  const [name, setName] = useState(student?.name || "");

  const [email, setEmail] = useState(student?.email || "");

  const [department, setDepartment] = useState(student?.department || "");

  const [branch, setBranch] = useState(student?.branch || "B.TECH");

  const [year, setYear] = useState(String(student?.year || "1"));

  const [semester, setSemester] = useState(String(student?.semester || "1"));

  const [rollNo, setRollNo] = useState(student?.rollNo || "");

  const [section, setSection] = useState(student?.section || "A");

  const [loading, setLoading] = useState(false);

  const handleUpdateStudent = async () => {
    if (!name || !email || !department || !rollNo) {
      Alert.alert("Required", "Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await UPDATE_STUDENT(student.id, {
        name,
        email,
        department,
        branch,
        year: parseInt(year),
        semester: parseInt(semester),
        rollNo,
        section,
      });

      if (res.success) {
        Alert.alert("Success", "Student updated successfully.");
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

          <Text style={styles.headerTitle}>Edit Student</Text>

          <View
            style={{
              width: s(40),
            }}
          />
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.glow1} />
          <View style={styles.glow2} />

          <View style={styles.heroIcon}>
            <Ionicons name="school-outline" size={34} color="#fff" />
          </View>

          <Text style={styles.heroTitle}>Edit Student</Text>

          <Text style={styles.heroSub}>
            Update student details and save changes.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <InputField
            label="Full Name *"
            icon="person-outline"
            value={name}
            onChangeText={setName}
            placeholder="Anas Khan"
          />

          <InputField
            label="Email *"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            placeholder="student@email.com"
          />

          <InputField
            label="Department *"
            icon="business-outline"
            value={department}
            onChangeText={setDepartment}
            placeholder="CSE"
          />

          <InputField
            label="Roll Number *"
            icon="card-outline"
            value={rollNo}
            onChangeText={setRollNo}
            placeholder="2303400109002"
          />

          <PickerField
            label="Branch"
            icon="git-branch-outline"
            selectedValue={branch}
            onValueChange={setBranch}
            items={["B.TECH", "M.TECH", "BCA", "MCA"]}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <PickerField
                label="Year"
                icon="layers-outline"
                selectedValue={year}
                onValueChange={setYear}
                items={["1", "2", "3", "4"]}
              />
            </View>

            <View style={styles.half}>
              <PickerField
                label="Semester"
                icon="calendar-outline"
                selectedValue={semester}
                onValueChange={setSemester}
                items={["1", "2", "3", "4", "5", "6", "7", "8"]}
              />
            </View>
          </View>

          <PickerField
            label="Section"
            icon="grid-outline"
            selectedValue={section}
            onValueChange={setSection}
            items={["A", "B", "C", "D"]}
          />

          {/* Buttons */}
          <TouchableOpacity
            style={styles.submitBtn}
            disabled={loading}
            onPress={handleUpdateStudent}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.submitText}>Update Student</Text>

                <Ionicons name="checkmark" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>

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

export default EditStudent;

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

const PickerField = ({ label, icon, selectedValue, onValueChange, items }) => (
  <View style={styles.group}>
    <Text style={styles.label}>{label}</Text>

    <View style={styles.pickerWrap}>
      <Ionicons
        name={icon}
        size={18}
        color="#64748B"
        style={{
          marginLeft: s(12),
        }}
      />

      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {items.map((item, i) => (
          <Picker.Item key={i} label={item} value={item} />
        ))}
      </Picker>
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
    textAlign: "center",
    fontSize: ms(14),
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

  pickerWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: s(16),
    overflow: "hidden",
  },

  picker: {
    flex: 1,
    height: vs(52),
    color: "#0F172A",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  half: {
    width: "48%",
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