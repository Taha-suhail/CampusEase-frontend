import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
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

import { GET_USER } from "../../services/AuthServices";
import { GET_ADMIN_DASHBOARD } from "../../services/AdminServices";

const AdminDashboard = ({
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

  /* ---------------- */
  /* API Loaders */
  /* ---------------- */

  const loadUser =
    async () => {
      const res =
        await GET_USER();

      if (
        res.success
      ) {
        setUser(
          res.data
        );
      }
    };

  const loadDashboard =
    async () => {
      const res =
        await GET_ADMIN_DASHBOARD();

      if (
        res.success
      ) {
        setDashboard(
          res.data
        );
      }
    };

  useEffect(() => {
    Promise.all([
      loadUser(),
      loadDashboard(),
    ]);
  }, []);

  const onRefresh =
    useCallback(
      async () => {
        setRefreshing(
          true
        );

        await Promise.all(
          [
            loadUser(),
            loadDashboard(),
          ]
        );

        setRefreshing(
          false
        );
      },
      []
    );

  /* ---------------- */
  /* Quick Actions */
  /* ---------------- */

  const actions = [
    {
      title:
        "Add Student",
      icon: "school-outline",
      route:
        "AddStudent",
      color:
        "#2563EB",
    },
    {
      title:
        "Add Teacher",
      icon: "person-outline",
      route:
        "AddTeacher",
      color:
        "#14B8A6",
    },
    {
      title:
        "Bulk Upload",
      icon: "cloud-upload-outline",
      route:
        "BulkAddUsers",
      color:
        "#8B5CF6",
    },
    {
      title:
        "Subjects",
      icon: "book-outline",
      route:
        "SubjectsList",
      color:
        "#F59E0B",
    },
    {
      title:
        "Students",
      icon: "people-outline",
      route:
        "StudentsList",
      color:
        "#10B981",
    },
    {
      title:
        "Teachers",
      icon: "person-add-outline",
      route:
        "TeachersList",
      color:
        "#EF4444",
    },
  ];

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2563EB"
      />

      <ScrollView
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
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
        {/* HEADER */}
        <View
          style={
            styles.topBar
          }
        >
          <View>
            <Text
              style={
                styles.welcome
              }
            >
              Welcome Back 👋
            </Text>

            <Text
              style={
                styles.adminName
              }
            >
              {user?.name ||
                "Admin"}
            </Text>
          </View>

          <TouchableOpacity
            style={
              styles.notifyBtn
            }
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color="#0F172A"
            />
          </TouchableOpacity>
        </View>

        {/* HERO CARD */}
        <View
          style={
            styles.heroCard
          }
        >
          <View
            style={
              styles.glow1
            }
          />
          <View
            style={
              styles.glow2
            }
          />

          <View
            style={
              styles.logoCircle
            }
          >
            <Ionicons
              name="school"
              size={34}
              color="#fff"
            />
          </View>

          <Text
            style={
              styles.heroTitle
            }
          >
            CampusEase
          </Text>

          <Text
            style={
              styles.heroSub
            }
          >
            Premium university
            management control
            panel for smarter
            operations.
          </Text>

          <TouchableOpacity
            style={
              styles.liveBadge
            }
          >
            <Text
              style={
                styles.liveText
              }
            >
              ● Live
            </Text>
          </TouchableOpacity>
        </View>

        {/* STATS */}
        <Text
          style={
            styles.sectionTitle
          }
        >
          Overview
        </Text>

        <View
          style={
            styles.statsGrid
          }
        >
          <StatCard
            title="Users"
            value={
              dashboard?.totalUsers ||
              0
            }
            icon="people-outline"
            color="#2563EB"
          />

          <StatCard
            title="Students"
            value={
              dashboard?.totalStudents ||
              0
            }
            icon="school-outline"
            color="#14B8A6"
          />

          <StatCard
            title="Teachers"
            value={
              dashboard?.totalTeachers ||
              0
            }
            icon="person-outline"
            color="#F59E0B"
          />

          <StatCard
            title="Subjects"
            value={
              dashboard?.totalSubjects ||
              0
            }
            icon="book-outline"
            color="#8B5CF6"
          />
        </View>

        {/* QUICK ACTIONS */}
        <Text
          style={
            styles.sectionTitle
          }
        >
          Quick Actions
        </Text>

        <View
          style={
            styles.actionGrid
          }
        >
          {actions.map(
            (
              item,
              index
            ) => (
              <TouchableOpacity
                key={
                  index
                }
                style={
                  styles.actionCard
                }
                onPress={() =>
                  navigation.navigate(
                    item.route
                  )
                }
              >
                <View
                  style={[
                    styles.actionIcon,
                    {
                      backgroundColor:
                        `${item.color}15`,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      item.icon
                    }
                    size={
                      22
                    }
                    color={
                      item.color
                    }
                  />
                </View>

                <Text
                  style={
                    styles.actionText
                  }
                >
                  {
                    item.title
                  }
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={
            styles.logoutBtn
          }
          onPress={
            onLogout
          }
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color="#fff"
          />

          <Text
            style={
              styles.logoutText
            }
          >
            Logout
          </Text>
        </TouchableOpacity>

        <Text
          style={
            styles.footer
          }
        >
          CampusEase Admin Portal
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;

/* ---------------- */
/* Components */
/* ---------------- */

const StatCard = ({
  title,
  value,
  icon,
  color,
}) => (
  <View
    style={
      styles.statCard
    }
  >
    <View
      style={[
        styles.statIcon,
        {
          backgroundColor:
            `${color}15`,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={color}
      />
    </View>

    <Text
      style={
        styles.statValue
      }
    >
      {value}
    </Text>

    <Text
      style={
        styles.statTitle
      }
    >
      {title}
    </Text>
  </View>
);

/* ---------------- */
/* Styles */
/* ---------------- */

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        "#F8FAFC",
    },

    container: {
      paddingHorizontal:
        s(18),
      paddingBottom:
        vs(30),
    },

    topBar: {
      marginTop: vs(10),
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
    },

    welcome: {
      fontSize: ms(13),
      color: "#64748B",
      fontWeight: "700",
    },

    adminName: {
      fontSize: ms(24),
      fontWeight: "900",
      color: "#0F172A",
      marginTop: vs(3),
    },

    notifyBtn: {
      width: s(44),
      height: s(44),
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
      padding: s(24),
      overflow:
        "hidden",
    },

    glow1: {
      position:
        "absolute",
      width: s(130),
      height: s(130),
      borderRadius:
        s(65),
      backgroundColor:
        "rgba(255,255,255,0.10)",
      top: -20,
      right: -20,
    },

    glow2: {
      position:
        "absolute",
      width: s(110),
      height: s(110),
      borderRadius:
        s(55),
      backgroundColor:
        "rgba(255,255,255,0.08)",
      bottom: -20,
      left: -20,
    },

    logoCircle: {
      width: s(72),
      height: s(72),
      borderRadius:
        s(36),
      backgroundColor:
        "rgba(255,255,255,0.18)",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    heroTitle: {
      marginTop: vs(16),
      fontSize: ms(28),
      fontWeight: "900",
      color: "#fff",
    },

    heroSub: {
      marginTop: vs(8),
      fontSize: ms(14),
      color: "#DBEAFE",
      lineHeight:
        vs(22),
      width: "92%",
    },

    liveBadge: {
      marginTop: vs(18),
      alignSelf:
        "flex-start",
      backgroundColor:
        "rgba(255,255,255,0.18)",
      paddingHorizontal:
        s(14),
      paddingVertical:
        vs(8),
      borderRadius:
        s(14),
    },

    liveText: {
      color: "#fff",
      fontWeight: "800",
      fontSize: ms(13),
    },

    sectionTitle: {
      marginTop: vs(22),
      marginBottom:
        vs(12),
      fontSize: ms(14),
      color: "#64748B",
      fontWeight: "900",
    },

    statsGrid: {
      flexDirection:
        "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
    },

    statCard: {
      width: "48%",
      backgroundColor:
        "#fff",
      borderRadius:
        s(20),
      padding: s(16),
      marginBottom:
        vs(12),
      alignItems:
        "center",
    },

    statIcon: {
      width: s(44),
      height: s(44),
      borderRadius:
        s(22),
      justifyContent:
        "center",
      alignItems:
        "center",
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

    actionGrid: {
      flexDirection:
        "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
    },

    actionCard: {
      width: "48%",
      backgroundColor:
        "#fff",
      borderRadius:
        s(20),
      paddingVertical:
        vs(18),
      paddingHorizontal:
        s(10),
      marginBottom:
        vs(12),
      alignItems:
        "center",
    },

    actionIcon: {
      width: s(48),
      height: s(48),
      borderRadius:
        s(24),
      justifyContent:
        "center",
      alignItems:
        "center",
      marginBottom:
        vs(10),
    },

    actionText: {
      fontSize: ms(13),
      fontWeight: "800",
      color: "#0F172A",
      textAlign:
        "center",
    },

    logoutBtn: {
      marginTop: vs(16),
      backgroundColor:
        "#EF4444",
      borderRadius:
        s(18),
      paddingVertical:
        vs(16),
      flexDirection:
        "row",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    logoutText: {
      marginLeft: s(8),
      color: "#fff",
      fontWeight: "900",
      fontSize: ms(16),
    },

    footer: {
      marginTop: vs(18),
      textAlign:
        "center",
      color: "#94A3B8",
      fontSize: ms(12),
    },
  });