import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs, ms } from "react-native-size-matters";

import { GET_USER, LOGOUT } from "../../services/AuthServices";

const AdminProfile = ({ navigation, onLogout }) => {
  const [user, setUser] = useState(null);

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

      const userRes = await GET_USER();

      if (userRes.success) {
        setUser(userRes.data);
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

  const name = user?.fullName || "Admin";
  const firstLetter = name?.charAt(0)?.toUpperCase() || "A";
  const email = user?.email || "-";
  const phone = user?.phone || "-";
  const department = user?.department || "Administration";

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await LOGOUT();
            if (onLogout) {
              onLogout();
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563EB"]}
            tintColor="#2563EB"
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

          <Text style={styles.email}>{email}</Text>

          <View style={styles.badge}>
            <Ionicons name="shield-checkmark-outline" size={15} color="#2563EB" />

            <Text style={styles.badgeText}>Administrator</Text>
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
            color="#2563EB"
            style={{
              marginTop: vs(30),
            }}
          />
        ) : (
          <>
            {/* Stats */}
            <View style={styles.statsRow}>
              <StatCard
                icon="people-outline"
                title="Role"
                value="Admin"
              />

              <StatCard
                icon="briefcase-outline"
                title="Department"
                value={department}
              />
            </View>

            {/* Account Info */}
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Account Information</Text>

              <ProfileRow
                icon="person-outline"
                label="Full Name"
                value={name}
              />

              <ProfileRow
                icon="mail-outline"
                label="Email"
                value={email}
              />

              <ProfileRow
                icon="call-outline"
                label="Phone"
                value={phone}
              />

              <ProfileRow
                icon="business-outline"
                label="Department"
                value={department}
              />

              <ProfileRow
                icon="shield-checkmark-outline"
                label="Role"
                value="Administrator"
              />

              <ProfileRow
                icon="checkmark-circle-outline"
                label="Status"
                value="Active"
              />
            </View>

            {/* Quick Actions */}
            <View style={styles.actionCard}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate("StudentsList")}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.actionIcon, { backgroundColor: "#EFF6FF" }]}>
                    <Ionicons name="school-outline" size={20} color="#2563EB" />
                  </View>
                  <Text style={styles.actionLabel}>Manage Students</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate("TeachersList")}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.actionIcon, { backgroundColor: "#F0FDF4" }]}>
                    <Ionicons name="people-outline" size={20} color="#16A34A" />
                  </View>
                  <Text style={styles.actionLabel}>Manage Teachers</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate("SubjectsList")}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.actionIcon, { backgroundColor: "#FEF3C7" }]}>
                    <Ionicons name="book-outline" size={20} color="#D97706" />
                  </View>
                  <Text style={styles.actionLabel}>Manage Subjects</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate("CreateSubject")}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.actionIcon, { backgroundColor: "#F3E8FF" }]}>
                    <Ionicons name="add-circle-outline" size={20} color="#9333EA" />
                  </View>
                  <Text style={styles.actionLabel}>Add New Subject</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />

              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.footer}>CampusEase Admin Portal</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminProfile;

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
    <View style={[styles.statIcon, { backgroundColor: "#EFF6FF" }]}>
      <Ionicons name={icon} size={18} color="#2563EB" />
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
    backgroundColor: "#2563EB",
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
    backgroundColor: "#EFF6FF",
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    borderRadius: s(14),
  },

  badgeText: {
    marginLeft: s(6),
    color: "#2563EB",
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
    backgroundColor: "#2563EB",
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

  actionCard: {
    marginTop: vs(16),
    backgroundColor: "#fff",
    borderRadius: s(24),
    padding: s(20),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: vs(14),
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionIcon: {
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    justifyContent: "center",
    alignItems: "center",
  },

  actionLabel: {
    marginLeft: s(12),
    fontSize: ms(15),
    fontWeight: "700",
    color: "#0F172A",
  },

  logoutBtn: {
    marginTop: vs(20),
    backgroundColor: "#FEF2F2",
    borderRadius: s(18),
    paddingVertical: vs(16),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  logoutText: {
    marginLeft: s(8),
    color: "#DC2626",
    fontWeight: "800",
    fontSize: ms(16),
  },

  footer: {
    marginTop: vs(20),
    textAlign: "center",
    color: "#94A3B8",
    fontSize: ms(12),
  },
});