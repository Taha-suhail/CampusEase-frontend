import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs, ms } from "react-native-size-matters";

const Dashboard = ({ navigation, onLogout }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.smallText}>Welcome Back 👋</Text>

            <Text style={styles.adminText}>Super Admin</Text>
          </View>

          <TouchableOpacity style={styles.notifyBtn}>
            <Ionicons name="notifications-outline" size={22} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlowOne} />
          <View style={styles.heroGlowTwo} />

          <View style={styles.logoCircle}>
            <Ionicons name="school" size={34} color="#fff" />
          </View>

          <Text style={styles.heroTitle}>CampusEase</Text>

          <Text style={styles.heroSub}>
            Smart College Management System built for modern universities.
          </Text>

          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => navigation.navigate("AdminDashboard")}
          >
            <Text style={styles.heroBtnText}>Open Control Panel</Text>

            <Ionicons name="arrow-forward" size={18} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* STATS */}
        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.grid}>
          <StatCard
            title="Students"
            value="1,248"
            icon="people-outline"
            color="#2563EB"
          />

          <StatCard
            title="Teachers"
            value="86"
            icon="person-outline"
            color="#14B8A6"
          />

          <StatCard
            title="Subjects"
            value="72"
            icon="book-outline"
            color="#F59E0B"
          />

          <StatCard
            title="Today %"
            value="94%"
            icon="checkmark-done-outline"
            color="#16A34A"
          />
        </View>

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <ActionCard
          title="Allowed Users"
          subtitle="Add students via CSV"
          icon="person-add-outline"
          onPress={() => navigation.navigate("AllowedUsers")}
        />

        <ActionCard
          title="Subjects"
          subtitle="Create & assign faculty"
          icon="book-outline"
          onPress={() => navigation.navigate("SubjectDashboard")}
        />

        <ActionCard
          title="Attendance Reports"
          subtitle="Track QR sessions"
          icon="analytics-outline"
          onPress={() => navigation.navigate("AttendanceReports")}
        />

        <ActionCard
          title="Teacher Requests"
          subtitle="Leave / approvals"
          icon="document-text-outline"
          onPress={() => navigation.navigate("TeacherRequests")}
        />

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />

          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>CampusEase Admin Portal</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

/* ---------------- COMPONENTS ---------------- */

const StatCard = ({ title, value, icon, color }) => (
  <View style={styles.statCard}>
    <View
      style={[
        styles.statIcon,
        {
          backgroundColor: `${color}15`,
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={color} />
    </View>

    <Text style={styles.statValue}>{value}</Text>

    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const ActionCard = ({ title, subtitle, icon, onPress }) => (
  <TouchableOpacity
    style={styles.actionCard}
    activeOpacity={0.88}
    onPress={onPress}
  >
    <View style={styles.actionLeft}>
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={20} color="#2563EB" />
      </View>

      <View>
        <Text style={styles.actionTitle}>{title}</Text>

        <Text style={styles.actionSub}>{subtitle}</Text>
      </View>
    </View>

    <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
  </TouchableOpacity>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    paddingHorizontal: s(18),
    paddingBottom: vs(30),
  },

  topBar: {
    marginTop: vs(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smallText: {
    fontSize: ms(13),
    color: "#64748B",
    fontWeight: "700",
  },

  adminText: {
    marginTop: vs(3),
    fontSize: ms(24),
    fontWeight: "900",
    color: "#0F172A",
  },

  notifyBtn: {
    width: s(44),
    height: s(44),
    borderRadius: s(14),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  heroCard: {
    marginTop: vs(18),
    backgroundColor: "#2563EB",
    borderRadius: s(28),
    padding: s(24),
    overflow: "hidden",
  },

  heroGlowOne: {
    position: "absolute",
    width: s(130),
    height: s(130),
    borderRadius: s(65),
    backgroundColor: "rgba(255,255,255,0.10)",
    top: -25,
    right: -20,
  },

  heroGlowTwo: {
    position: "absolute",
    width: s(110),
    height: s(110),
    borderRadius: s(55),
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -25,
    left: -20,
  },

  logoCircle: {
    width: s(74),
    height: s(74),
    borderRadius: s(37),
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  heroTitle: {
    marginTop: vs(16),
    fontSize: ms(28),
    fontWeight: "900",
    color: "#fff",
  },

  heroSub: {
    marginTop: vs(8),
    color: "#DBEAFE",
    fontSize: ms(14),
    lineHeight: vs(22),
    width: "90%",
  },

  heroBtn: {
    marginTop: vs(18),
    backgroundColor: "#fff",
    borderRadius: s(16),
    paddingVertical: vs(14),
    paddingHorizontal: s(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroBtnText: {
    color: "#2563EB",
    fontWeight: "900",
    fontSize: ms(15),
  },

  sectionTitle: {
    marginTop: vs(22),
    marginBottom: vs(10),
    fontSize: ms(14),
    color: "#64748B",
    fontWeight: "900",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: s(20),
    padding: s(16),
    marginBottom: vs(12),
    alignItems: "center",
  },

  statIcon: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    justifyContent: "center",
    alignItems: "center",
  },

  statValue: {
    marginTop: vs(10),
    fontSize: ms(24),
    fontWeight: "900",
    color: "#0F172A",
  },

  statTitle: {
    marginTop: vs(4),
    fontSize: ms(13),
    color: "#64748B",
    fontWeight: "700",
  },

  actionCard: {
    backgroundColor: "#fff",
    borderRadius: s(20),
    padding: s(16),
    marginBottom: vs(12),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionIcon: {
    width: s(46),
    height: s(46),
    borderRadius: s(14),
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(12),
  },

  actionTitle: {
    fontSize: ms(15),
    fontWeight: "800",
    color: "#0F172A",
  },

  actionSub: {
    marginTop: vs(2),
    fontSize: ms(12),
    color: "#64748B",
  },

  logoutBtn: {
    marginTop: vs(16),
    backgroundColor: "#EF4444",
    borderRadius: s(18),
    paddingVertical: vs(16),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    marginLeft: s(8),
    color: "#fff",
    fontSize: ms(16),
    fontWeight: "900",
  },

  footer: {
    marginTop: vs(18),
    textAlign: "center",
    color: "#94A3B8",
    fontSize: ms(12),
  },
});
