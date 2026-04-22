import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs, ms } from "react-native-size-matters";

import { ActionItem } from "../../components/card/StatCard";

import { GET_USER, LOGOUT } from "../../services/AuthServices";

import {
  GET_STUDENT_DASHBOARD,
  ENROLL_SUBJECT,
} from "../../services/StudentService";

const StudentDashboard = ({ navigation, onLogout }) => {
  const [user, setUser] = useState(null);

  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  /* ------------------- */
  /* Load User */
  /* ------------------- */

  const loadUser = async () => {
    const res = await GET_USER();

    if (res.success) {
      setUser(res.data);
    }
  };

  /* ------------------- */
  /* Load Subjects */
  /* ------------------- */

  const loadSubjects = async () => {
    const res = await GET_STUDENT_DASHBOARD();

    if (res.success) {
      const data = res.data?.subjects || res.data || [];

      setSubjects(data);
    } else {
      setSubjects([]);
    }
  };

  /* ------------------- */
  /* Reload */
  /* ------------------- */

  const reload = async () => {
    try {
      setLoading(true);

      await Promise.all([loadUser(), loadSubjects()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  /* ------------------- */
  /* Pull Refresh */
  /* ------------------- */

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await reload();

    setRefreshing(false);
  }, []);

  /* ------------------- */
  /* Enroll */
  /* ------------------- */

  const handleEnroll = async (subjectId) => {
    const res = await ENROLL_SUBJECT(subjectId);

    if (res.success) {
      Alert.alert("Success", "Enrolled successfully");

      loadSubjects();
    } else {
      Alert.alert("Error", res.message);
    }
  };

  /* ------------------- */
  /* Logout */
  /* ------------------- */

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await LOGOUT();

          onLogout?.();
        },
      },
    ]);
  };

  const enrolledCount = subjects.filter((i) => i.isEnrolled).length;

  /* ------------------- */
  /* UI */
  /* ------------------- */

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563EB"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0) || "S"}
              </Text>
            </View>

            <View>
              <Text style={styles.brand}>CampusEase</Text>

              <Text style={styles.smallText}>
                {user?.branch || "Student Portal"}
              </Text>
            </View>
          </View>

          <View style={styles.headerBtns}>
            <TouchableOpacity style={styles.iconBtn} onPress={reload}>
              <Ionicons name="reload" size={20} color="#0F172A" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.welcome}>Welcome, {user?.name || "Student"}</Text>

          <Text style={styles.heroSub}>{user?.department || "Department"}</Text>

          <View style={styles.dotRow}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            title="Subjects"
            value={subjects.length}
            icon="book-outline"
          />

          <StatCard
            title="Enrolled"
            value={enrolledCount}
            icon="checkmark-circle-outline"
          />
        </View>

        {/* Subjects */}
        <Text style={styles.sectionTitle}>My Subjects</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={{
              marginTop: vs(20),
            }}
          />
        ) : subjects.length === 0 ? (
          <Text style={styles.emptyText}>No subjects found.</Text>
        ) : (
          subjects.map((subj) => (
            <View key={subj._id} style={styles.subjectCard}>
              <View style={styles.subjectTop}>
                <View style={styles.bookIcon}>
                  <Ionicons name="book" size={20} color="#2563EB" />
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text style={styles.subjectName}>{subj.name}</Text>

                  <Text style={styles.subjectCode}>{subj.code}</Text>
                </View>

                <View style={styles.semBadge}>
                  <Text style={styles.semText}>Sem {subj.semester}</Text>
                </View>
              </View>

              <View style={styles.teacherRow}>
                <Ionicons
                  name="person-circle-outline"
                  size={18}
                  color="#64748B"
                />

                <Text style={styles.teacherText}>
                  {subj.teacher?.fullName || "Not Assigned"}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.enrollBtn,
                  subj.isEnrolled && styles.enrolledBtn,
                ]}
                disabled={subj.isEnrolled}
                onPress={() => handleEnroll(subj._id)}
              >
                <Text
                  style={[
                    styles.enrollText,
                    subj.isEnrolled && styles.enrolledText,
                  ]}
                >
                  {subj.isEnrolled ? "Enrolled" : "Enroll"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <ActionItem
          title="Scan Attendance"
          subtitle="Scan teacher QR"
          icon="scan-outline"
          onPress={() => navigation.navigate("StudentScanQR")}
        />
        <ActionItem
          title="Assignments"
          subtitle="View assignments"
          icon="book-outline"
          onPress={() => navigation.navigate("StudentAssignments")}
        />

        <ActionItem
          title="Apply Leave"
          subtitle="Request leave"
          icon="calendar-outline"
          onPress={() => navigation.navigate("ApplyLeave")}
        />

        <ActionItem
          title="Attendance"
          subtitle="View records"
          icon="bar-chart-outline"
          onPress={() => navigation.navigate("StudentAttendance")}
        />

        <ActionItem
          title="Profile"
          subtitle="Your details"
          icon="person-outline"
          onPress={() => navigation.navigate("StudentProfile")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentDashboard;

/* ------------------- */
/* Components */
/* ------------------- */

const StatCard = ({ title, value, icon }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={20} color="#2563EB" />

    <Text style={styles.statValue}>{value}</Text>

    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

/* ------------------- */
/* Styles */
/* ------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    padding: s(16),
    paddingBottom: vs(30),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(18),
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(10),
  },

  avatarText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: ms(18),
  },

  brand: {
    fontSize: ms(16),
    fontWeight: "900",
    color: "#0F172A",
  },

  smallText: {
    color: "#64748B",
    fontSize: ms(12),
  },

  headerBtns: {
    flexDirection: "row",
  },

  iconBtn: {
    padding: s(8),
    backgroundColor: "#fff",
    borderRadius: s(12),
    marginRight: s(8),
  },

  logoutBtn: {
    padding: s(8),
    backgroundColor: "#FEE2E2",
    borderRadius: s(12),
  },

  heroCard: {
    backgroundColor: "#2563EB",
    borderRadius: s(24),
    padding: s(20),
    marginBottom: vs(16),
  },

  welcome: {
    color: "#fff",
    fontSize: ms(24),
    fontWeight: "900",
  },

  heroSub: {
    color: "#DBEAFE",
    marginTop: vs(6),
    fontSize: ms(14),
  },

  dotRow: {
    flexDirection: "row",
    marginTop: vs(14),
  },

  dot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: "#93C5FD",
    marginRight: s(6),
  },

  activeDot: {
    backgroundColor: "#fff",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: vs(18),
  },

  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: s(18),
    padding: s(16),
    alignItems: "center",
  },

  statValue: {
    marginTop: vs(8),
    fontSize: ms(24),
    fontWeight: "900",
    color: "#0F172A",
  },

  statTitle: {
    marginTop: vs(4),
    color: "#64748B",
    fontSize: ms(13),
  },

  sectionTitle: {
    fontSize: ms(14),
    fontWeight: "900",
    color: "#64748B",
    marginBottom: vs(10),
    marginTop: vs(4),
  },

  emptyText: {
    textAlign: "center",
    color: "#64748B",
    marginVertical: vs(20),
  },

  subjectCard: {
    backgroundColor: "#fff",
    borderRadius: s(18),
    padding: s(16),
    marginBottom: vs(12),
  },

  subjectTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  bookIcon: {
    width: s(42),
    height: s(42),
    borderRadius: s(12),
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(10),
  },

  subjectName: {
    fontSize: ms(15),
    fontWeight: "800",
    color: "#0F172A",
  },

  subjectCode: {
    fontSize: ms(13),
    color: "#2563EB",
    marginTop: vs(2),
  },

  semBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: s(10),
  },

  semText: {
    fontSize: ms(12),
    fontWeight: "700",
  },

  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vs(12),
  },

  teacherText: {
    marginLeft: s(6),
    color: "#475569",
    fontSize: ms(13),
    fontWeight: "700",
  },

  enrollBtn: {
    marginTop: vs(14),
    backgroundColor: "#2563EB",
    borderRadius: s(14),
    paddingVertical: vs(10),
    alignItems: "center",
  },

  enrolledBtn: {
    backgroundColor: "#DCFCE7",
  },

  enrollText: {
    color: "#fff",
    fontWeight: "800",
  },

  enrolledText: {
    color: "#166534",
  },
});
