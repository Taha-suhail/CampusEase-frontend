import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { GET_STUDENT_BY_ID } from "../../services/AdminServices";
import { s, vs, ms } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useCallback, useEffect } from "react";


const StudentDetail = ({ route, navigation }) => {
  const { studentId } = route.params || {};
  const insets = useSafeAreaInsets();
const [student, setStudent] = useState(null);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);


  const loadStudent = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    const result = await GET_STUDENT_BY_ID(studentId);
    setLoading(false);
    setRefreshing(false);
    if (result.success) {
      setStudent(result.data);
    }
  };

  useEffect(() => {
    loadStudent();
  }, [studentId]);

  const onRefresh = useCallback(() => {
    loadStudent(true);
  }, [studentId]);

  return (
    <SafeAreaView
      style={styles.safeArea}
      backgroundColor="#F8FAFC"
      statusBarColor="#F8FAFC"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={26} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.title}>Student Details</Text>
          <View style={{ width: 28 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#14B8A6" />
          </View>
        ) : !student ? (
          <Text style={styles.emptyText}>
            Student information is unavailable.
          </Text>
        ) : (
          <ScrollView
            contentContainerStyle={styles.detailsContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#14B8A6"]}
                tintColor="#14B8A6"
              />
            }
          >
            <View style={styles.infoCard}>
              <Text style={styles.infoName}>
                {student.user.fullName || "Unnamed Student"}
              </Text>
              <Text style={styles.infoStatus}>
                {student.user.email || "No email"}
              </Text>
            </View>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Department</Text>
              <Text style={styles.sectionValue}>
                {student.department || "Not assigned"}
              </Text>
            </View>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Semester</Text>
              <Text style={styles.sectionValue}>
                {student.semester || "Not assigned"}
              </Text>
            </View>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Roll Number</Text>
              <Text style={styles.sectionValue}>
                {student.rollNumber || "-"}
              </Text>
            </View>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Branch</Text>
              <Text style={styles.sectionValue}>
                {student.department || "Not assigned"}
              </Text>
            </View>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Section</Text>
              <Text style={styles.sectionValue}>
                {student.section || "Not assigned"}
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default StudentDetail;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(16),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(20),
  },
  backBtn: {
    padding: s(8),
  },
  title: {
    fontSize: ms(22),
    fontWeight: "900",
    color: "#0F172A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: ms(16),
    color: "#64748B",
    textAlign: "center",
    marginTop: vs(32),
  },
  detailsContainer: {
    paddingBottom: vs(30),
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: s(18),
    padding: s(20),
    marginBottom: vs(14),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoName: {
    fontSize: ms(20),
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: vs(6),
  },
  infoStatus: {
    fontSize: ms(14),
    color: "#64748B",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: s(16),
    padding: s(18),
    marginBottom: vs(12),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionLabel: {
    fontSize: ms(12),
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#94A3B8",
    marginBottom: vs(4),
  },
  sectionValue: {
    fontSize: ms(16),
    fontWeight: "700",
    color: "#0F172A",
  },
});
