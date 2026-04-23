import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs, ms } from "react-native-size-matters";

import { GET_USER } from "../../services/AuthServices";
import { GET_MY_STUDENT_DETAILS } from "../../services/StudentService";

const StudentProfile = () => {
  const [user, setUser] = useState(null);

  const [studentDetails, setStudentDetails] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  /* -------------------- */
  /* Load User */
  /* -------------------- */

  const fetchUser = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [userRes, studentRes] = await Promise.all([
        GET_USER(),
        GET_MY_STUDENT_DETAILS(),
      ]);

      if (userRes.success) {
        setUser(userRes.data);
      }

      if (studentRes.success) {
        setStudentDetails(studentRes.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const onRefresh = useCallback(() => {
    fetchUser(true);
  }, []);

  const name = user?.fullName || "Student";

  const firstLetter = name?.charAt(0)?.toUpperCase() || "S";

  const semester = studentDetails?.semester || "-";
  const year = studentDetails?.year || "-";
  const department = studentDetails?.department || "-";
  const branch = studentDetails?.branch || "-";
  const rollNumber = studentDetails?.rollNumber || "-";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#14B8A6"]}
            tintColor="#14B8A6"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstLetter}</Text>
          </View>

          <Text style={styles.name}>{name}</Text>

          <Text style={styles.email}>{user?.email || "-"}</Text>

          <View style={styles.badge}>
            <Ionicons name="school-outline" size={15} color="#14B8A6" />

            <Text style={styles.badgeText}>Active Student</Text>
          </View>

          <View style={styles.dotRow}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#14B8A6"
            style={{
              marginTop: vs(30),
            }}
          />
        ) : (
          <>
            {/* Stats */}
            <View style={styles.statsRow}>
              <StatCard
                icon="calendar-outline"
                title="Semester"
                value={semester}
              />

              <StatCard
                icon="layers-outline"
                title="Year"
                value={year}
              />
            </View>

            {/* Details */}
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Student Information</Text>

              <ProfileRow
                icon="business-outline"
                label="Department"
                value={department}
              />

              <ProfileRow
                icon="git-branch-outline"
                label="Branch"
                value={branch}
              />

              <ProfileRow
                icon="school-outline"
                label="Semester"
                value={semester}
              />

              <ProfileRow
                icon="card-outline"
                label="Roll Number"
                value={rollNumber}
              />

              <ProfileRow
                icon="layers-outline"
                label="Year"
                value={year}
              />

              <ProfileRow
                icon="mail-outline"
                label="Email"
                value={user?.email || "-"}
              />
            </View>
          </>
        )}

        <Text style={styles.footer}>CampusEase Student Portal</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentProfile;

/* -------------------- */
/* Profile Row */
/* -------------------- */

const ProfileRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={18} color="#64748B" />

      <Text style={styles.label}>{label}</Text>
    </View>

    <Text style={styles.value} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

/* -------------------- */
/* Stat Card */
/* -------------------- */

const StatCard = ({ icon, title, value }) => (
  <View style={styles.statCard}>
    <View style={styles.statIcon}>
      <Ionicons name={icon} size={18} color="#14B8A6" />
    </View>

    <Text style={styles.statValue}>{value}</Text>

    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

/* -------------------- */
/* Styles */
/* -------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    paddingHorizontal: s(18),
    paddingBottom: vs(28),
  },

  heroCard: {
    marginTop: vs(12),
    backgroundColor: "#fff",
    borderRadius: s(26),
    padding: s(24),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  avatar: {
    width: s(84),
    height: s(84),
    borderRadius: s(42),
    backgroundColor: "#14B8A6",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: ms(34),
    fontWeight: "900",
    color: "#fff",
  },

  name: {
    marginTop: vs(16),
    fontSize: ms(24),
    fontWeight: "900",
    color: "#0F172A",
  },

  email: {
    marginTop: vs(6),
    fontSize: ms(14),
    color: "#64748B",
  },

  badge: {
    marginTop: vs(14),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFEFF",
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    borderRadius: s(14),
  },

  badgeText: {
    marginLeft: s(6),
    color: "#0F766E",
    fontWeight: "800",
    fontSize: ms(13),
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
    backgroundColor: "#14B8A6",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: vs(16),
  },

  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: s(18),
    padding: s(16),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },

  statIcon: {
    width: s(42),
    height: s(42),
    borderRadius: s(21),
    backgroundColor: "#ECFEFF",
    justifyContent: "center",
    alignItems: "center",
  },

  statValue: {
    marginTop: vs(10),
    fontSize: ms(22),
    fontWeight: "900",
    color: "#0F172A",
  },

  statTitle: {
    marginTop: vs(4),
    fontSize: ms(13),
    color: "#64748B",
    fontWeight: "700",
  },

  infoCard: {
    marginTop: vs(16),
    backgroundColor: "#fff",
    borderRadius: s(24),
    padding: s(20),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  sectionTitle: {
    fontSize: ms(18),
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: vs(12),
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: vs(14),
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  label: {
    marginLeft: s(8),
    fontSize: ms(14),
    color: "#64748B",
    fontWeight: "700",
  },

  value: {
    fontSize: ms(14),
    color: "#0F172A",
    fontWeight: "800",
    maxWidth: "45%",
    textAlign: "right",
  },

  footer: {
    marginTop: vs(20),
    textAlign: "center",
    color: "#94A3B8",
    fontSize: ms(12),
  },
});
