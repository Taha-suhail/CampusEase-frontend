import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  s,
  vs,
  ms,
} from "react-native-size-matters";

import {
  GET_USER,
  LOGOUT,
} from "../../services/AuthServices";

import {
  GET_TEACHER_DASHBOARD,
} from "../../services/TeacherServices";

import {
  StatCard,
  ActionItem,
} from "../../components/card/StatCard";

const TeacherDashboard = ({
  navigation,
  onLogout,
}) => {
  const [user, setUser] =
    useState(null);

  const [
    dashboard,
    setDashboard,
  ] = useState(null);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  const loadData =
    async () => {
      const [
        userRes,
        dashRes,
      ] =
        await Promise.all(
          [
            GET_USER(),
            GET_TEACHER_DASHBOARD(),
          ]
        );

      if (
        userRes.success
      ) {
        setUser(
          userRes.data
        );
      }

      if (
        dashRes.success
      ) {
        setDashboard(
          dashRes.data
        );
      }
    };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh =
    useCallback(
      async () => {
        setRefreshing(
          true
        );
        await loadData();
        setRefreshing(
          false
        );
      },
      []
    );

  const handleLogout =
    () => {
      Alert.alert(
        "Logout",
        "Are you sure?",
        [
          {
            text: "Cancel",
            style:
              "cancel",
          },
          {
            text: "Logout",
            style:
              "destructive",
            onPress:
              async () => {
                try {
                  setLoggingOut(
                    true
                  );
                  await LOGOUT();

                  onLogout &&
                    onLogout();
                } finally {
                  setLoggingOut(
                    false
                  );
                }
              },
          },
        ]
      );
    };

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.container
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              onRefresh
            }
            colors={[
              "#2563EB",
            ]}
          />
        }
      >
        {/* Header */}
        <View
          style={
            styles.header
          }
        >
          <View
            style={
              styles.profileRow
            }
          >
            <View
              style={
                styles.avatar
              }
            >
              <Text
                style={
                  styles.avatarText
                }
              >
                {user?.name
                  ?.charAt(
                    0
                  ) ||
                  "T"}
              </Text>
            </View>

            <View>
              <Text
                style={
                  styles.brand
                }
              >
                CampusEase
              </Text>

              <Text
                style={
                  styles.portal
                }
              >
                Faculty Portal
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={
              styles.logoutBtn
            }
            onPress={
              handleLogout
            }
            disabled={
              loggingOut
            }
          >
            {loggingOut ? (
              <ActivityIndicator
                color="#DC2626"
                size="small"
              />
            ) : (
              <Ionicons
                name="log-out-outline"
                size={22}
                color="#DC2626"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View
          style={
            styles.heroCard
          }
        >
          <View
            style={
              styles.heroGlow1
            }
          />
          <View
            style={
              styles.heroGlow2
            }
          />

          <Text
            style={
              styles.heroTitle
            }
          >
            Welcome,
            {" "}
            {user?.name ||
              "Professor"}
          </Text>

          <Text
            style={
              styles.heroSub
            }
          >
            {user?.department ||
              "Department"}
          </Text>

          <TouchableOpacity
            style={
              styles.heroBtn
            }
            onPress={() =>
              navigation.navigate(
                "TeacherGenerateQR"
              )
            }
          >
            <Ionicons
              name="qr-code-outline"
              size={18}
              color="#2563EB"
            />
            <Text
              style={
                styles.heroBtnText
              }
            >
              Start Attendance
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <Text
          style={
            styles.sectionTitle
          }
        >
          Overview
        </Text>

        <View
          style={
            styles.grid
          }
        >
          <StatCard
            title="SUBJECTS"
            value={
              dashboard?.totalSubjects?.toString() ||
              "0"
            }
            subtitle="Assigned"
          />

          <StatCard
            title="STUDENTS"
            value={
              dashboard?.totalStudents?.toString() ||
              "0"
            }
            subtitle="Enrolled"
            green
          />

          <StatCard
            title="PENDING"
            value={
              dashboard?.pendingLeaves?.toString() ||
              "0"
            }
            subtitle="Leave Requests"
            orange
          />

          <StatCard
            title="TODAY"
            value="3"
            subtitle="Classes"
            highlight
          />
        </View>

        {/* Quick Actions */}
        <Text
          style={
            styles.sectionTitle
          }
        >
          Quick Actions
        </Text>

        <ActionItem
          title="Generate QR Code"
          subtitle="Take attendance instantly"
          icon="qr-code-outline"
          onPress={() =>
            navigation.navigate(
              "TeacherGenerateQR"
            )
          }
        />

        <ActionItem
          title="Leave Requests"
          subtitle="Approve / Reject student leave"
          icon="checkmark-done-outline"
          onPress={() =>
            navigation.navigate(
              "LeaveRequests"
            )
          }
        />

        <ActionItem
          title="Assigned Subjects"
          subtitle="View all subjects"
          icon="book-outline"
          onPress={() =>
            navigation.navigate(
              "AssignedSubjects"
            )
          }
        />

        <ActionItem
          title="Assignments"
          subtitle="Create & manage tasks"
          icon="document-text-outline"
          onPress={() =>
            navigation.navigate(
              "TeacherAssignments"
            )
          }
        />

        <ActionItem
          title="My Profile"
          subtitle="Teacher details"
          icon="person-outline"
          onPress={() =>
            navigation.navigate(
              "TeacherProfile"
            )
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TeacherDashboard;

/* ---------- Styles ---------- */

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        "#F8FAFC",
    },

    container: {
      padding:
        s(18),
      paddingBottom:
        vs(40),
    },

    header: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
    },

    profileRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    avatar: {
      width: s(48),
      height: s(48),
      borderRadius:
        s(24),
      backgroundColor:
        "#2563EB",
      justifyContent:
        "center",
      alignItems:
        "center",
      marginRight:
        s(12),
    },

    avatarText: {
      color: "#fff",
      fontWeight: "900",
      fontSize: ms(18),
    },

    brand: {
      fontSize: ms(18),
      fontWeight: "900",
      color: "#0F172A",
    },

    portal: {
      color: "#64748B",
      fontSize: ms(12),
      marginTop: vs(2),
    },

    logoutBtn: {
      width: s(42),
      height: s(42),
      borderRadius:
        s(14),
      backgroundColor:
        "#fff",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    heroCard: {
      marginTop: vs(18),
      backgroundColor:
        "#2563EB",
      borderRadius:
        s(28),
      padding:
        s(24),
      overflow:
        "hidden",
    },

    heroGlow1: {
      position:
        "absolute",
      top: -20,
      right: -20,
      width: s(110),
      height: s(110),
      borderRadius:
        s(55),
      backgroundColor:
        "rgba(255,255,255,0.08)",
    },

    heroGlow2: {
      position:
        "absolute",
      bottom: -20,
      left: -20,
      width: s(90),
      height: s(90),
      borderRadius:
        s(45),
      backgroundColor:
        "rgba(255,255,255,0.07)",
    },

    heroTitle: {
      fontSize: ms(24),
      fontWeight: "900",
      color: "#fff",
    },

    heroSub: {
      marginTop: vs(6),
      color: "#DBEAFE",
      fontSize: ms(14),
    },

    heroBtn: {
      marginTop: vs(18),
      backgroundColor:
        "#fff",
      paddingVertical:
        vs(12),
      paddingHorizontal:
        s(16),
      borderRadius:
        s(16),
      flexDirection:
        "row",
      alignItems:
        "center",
      alignSelf:
        "flex-start",
    },

    heroBtnText: {
      marginLeft:
        s(8),
      color: "#2563EB",
      fontWeight: "900",
      fontSize: ms(14),
    },

    sectionTitle: {
      marginTop: vs(20),
      marginBottom:
        vs(10),
      fontSize: ms(14),
      fontWeight: "900",
      color: "#64748B",
      textTransform:
        "uppercase",
    },

    grid: {
      flexDirection:
        "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
      gap: s(10),
    },
  });