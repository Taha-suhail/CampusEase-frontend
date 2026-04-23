import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { UPDATE_SUBJECT } from "../../services/AdminServices";
import { s, vs, ms } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState } from "react";

const EditSubject = ({ navigation, route }) => {
  const { subject } = route.params || {};
  const insets = useSafeAreaInsets();

  const [subjectData, setSubjectData] = useState({
    name: subject?.name || "",
    code: subject?.code || "",
    department: subject?.department || "",
    semester: String(subject?.semester || ""),
    year: String(subject?.year || ""),
  });
  const [loading, setLoading] = useState(false);

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
  ];

  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const handleInputChange = (field, value) => {
    setSubjectData({ ...subjectData, [field]: value });
  };

  const handleUpdateSubject = async () => {
    if (
      !subjectData.name ||
      !subjectData.code ||
      !subjectData.department ||
      !subjectData.semester ||
      !subjectData.year
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const result = await UPDATE_SUBJECT(subject._id, {
        ...subjectData,
        semester: parseInt(subjectData.semester),
        year: parseInt(subjectData.year),
      });

      setLoading(false);

      if (result.success) {
        Alert.alert(
          "Success",
          result.message || "Subject updated successfully!",
        );
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      } else {
        Alert.alert("Error", result.message || "Failed to update subject");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.message || "Failed to update subject");
    }
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      backgroundColor="#F8FAFC"
      statusBarColor="#F8FAFC"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={28} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Subject</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Update Subject</Text>

          {/* Subject Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Data Structures"
              placeholderTextColor="#CBD5E1"
              value={subjectData.name}
              onChangeText={(value) => handleInputChange("name", value)}
            />
          </View>

          {/* Subject Code */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject Code *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., CS201"
              placeholderTextColor="#CBD5E1"
              value={subjectData.code}
              onChangeText={(value) => handleInputChange("code", value)}
            />
          </View>

          {/* Department */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={subjectData.department}
                onValueChange={(value) =>
                  handleInputChange("department", value)
                }
                style={styles.picker}
              >
                <Picker.Item label="Select Department" value="" />
                {departments.map((dept) => (
                  <Picker.Item key={dept} label={dept} value={dept} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Semester */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Semester *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={subjectData.semester}
                onValueChange={(value) => handleInputChange("semester", value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Semester" value="" />
                {semesters.map((sem) => (
                  <Picker.Item key={sem} label={sem} value={sem} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Year */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 1"
              placeholderTextColor="#CBD5E1"
              value={subjectData.year}
              onChangeText={(value) => handleInputChange("year", value)}
              keyboardType="numeric"
            />
          </View>

          {/* Update Button */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleUpdateSubject}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>Update Subject</Text>
                <Ionicons name="checkmark" size={18} color="#FFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditSubject;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    paddingHorizontal: s(16),
    paddingTop: vs(16),
    paddingBottom: vs(30),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(24),
  },
  backBtn: {
    padding: s(8),
  },
  title: {
    fontSize: ms(20),
    fontWeight: "800",
    color: "#0F172A",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: s(16),
    padding: s(20),
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  formTitle: {
    fontSize: ms(18),
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: vs(20),
  },
  inputGroup: {
    marginBottom: vs(16),
  },
  label: {
    fontSize: ms(14),
    fontWeight: "700",
    color: "#334155",
    marginBottom: vs(8),
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: s(10),
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    fontSize: ms(14),
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pickerContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: s(10),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  picker: {
    height: vs(50),
    color: "#0F172A",
  },
  submitBtn: {
    backgroundColor: "#14B8A6",
    borderRadius: s(10),
    paddingVertical: vs(14),
    alignItems: "center",
    marginTop: vs(20),
    flexDirection: "row",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: ms(16),
    fontWeight: "700",
    color: "#FFF",
  },
  cancelBtn: {
    borderRadius: s(10),
    paddingVertical: vs(12),
    alignItems: "center",
    marginTop: vs(10),
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
  cancelBtnText: {
    fontSize: ms(16),
    fontWeight: "600",
    color: "#64748B",
  },
});