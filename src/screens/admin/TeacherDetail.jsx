import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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

import { GET_TEACHER_BY_ID } from "../../services/AdminServices";

const TeacherDetail = ({
  route,
  navigation,
}) => {
  const { teacherId } =
    route.params || {};

  const [teacher, setTeacher] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const loadTeacher =
    async (
      isRefresh = false
    ) => {
      try {
        if (
          isRefresh
        ) {
          setRefreshing(
            true
          );
        } else {
          setLoading(
            true
          );
        }

        const res =
          await GET_TEACHER_BY_ID(
            teacherId
          );

        if (
          res.success
        ) {
          setTeacher(
            res.data
          );
        }
      } finally {
        setLoading(
          false
        );
        setRefreshing(
          false
        );
      }
    };

  useEffect(() => {
    loadTeacher();
  }, [teacherId]);

  const onRefresh =
    useCallback(() => {
      loadTeacher(
        true
      );
    }, [teacherId]);

  if (loading) {
    return (
      <SafeAreaView
        style={
          styles.safeArea
        }
      >
        <View
          style={
            styles.loader
          }
        >
          <ActivityIndicator
            size="large"
            color="#2563EB"
          />
        </View>
      </SafeAreaView>
    );
  }

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
        contentContainerStyle={
          styles.container
        }
      >
        {/* Header */}
        <View
          style={
            styles.header
          }
        >
          <TouchableOpacity
            style={
              styles.backBtn
            }
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color="#0F172A"
            />
          </TouchableOpacity>

          <Text
            style={
              styles.title
            }
          >
            Teacher Details
          </Text>

          <View
            style={{
              width:
                s(
                  40
                ),
            }}
          />
        </View>

        {/* Hero */}
        <View
          style={
            styles.heroCard
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
              {teacher?.teacher?.fullName
                ?.charAt(
                  0
                )
                .toUpperCase() ||
                "T"}
            </Text>
          </View>

          <Text
            style={
              styles.heroName
            }
          >
            {teacher?.teacher
              ?.fullName ||
              "Teacher"}
          </Text>

          <Text
            style={
              styles.heroEmail
            }
          >
            {teacher?.teacher
              ?.email ||
              "-"}
          </Text>

          <View
            style={
              styles.badge
            }
          >
            <Text
              style={
                styles.badgeText
              }
            >
              Faculty Member
            </Text>
          </View>
        </View>

        {/* Info Cards */}
        <InfoCard
          icon="business-outline"
          label="Department"
          value={
            teacher?.department ||
            "Not Assigned"
          }
        />

        <InfoCard
          icon="card-outline"
          label="Employee ID"
          value={
            teacher?.employeeId ||
            "Not Assigned"
          }
        />

        <InfoCard
          icon="briefcase-outline"
          label="Designation"
          value={
            teacher?.designation ||
            "Teacher"
          }
        />

        <View
          style={
            styles.subjectCard
          }
        >
          <View
            style={
              styles.subjectHead
            }
          >
            <Ionicons
              name="book-outline"
              size={18}
              color="#2563EB"
            />

            <Text
              style={
                styles.subjectTitle
              }
            >
              Assigned Subjects
            </Text>
          </View>

          {teacher
            ?.assignedSubjects
            ?.length ? (
            teacher.assignedSubjects.map(
              (
                item,
                index
              ) => (
                <View
                  key={
                    index
                  }
                  style={
                    styles.subjectItem
                  }
                >
                  <Text
                    style={
                      styles.subjectText
                    }
                  >
                    {
                      item.name
                    }
                  </Text>
                </View>
              )
            )
          ) : (
            <Text
              style={
                styles.emptyText
              }
            >
              No subjects assigned
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TeacherDetail;

/* ---------- Components ---------- */

const InfoCard = ({
  icon,
  label,
  value,
}) => (
  <View
    style={
      styles.infoCard
    }
  >
    <View
      style={
        styles.infoLeft
      }
    >
      <View
        style={
          styles.iconWrap
        }
      >
        <Ionicons
          name={icon}
          size={18}
          color="#2563EB"
        />
      </View>

      <View>
        <Text
          style={
            styles.infoLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.infoValue
          }
        >
          {value}
        </Text>
      </View>
    </View>
  </View>
);

/* ---------- Styles ---------- */

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

    loader: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    header: {
      marginTop: vs(10),
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
    },

    backBtn: {
      width: s(40),
      height: s(40),
      borderRadius:
        s(12),
      backgroundColor:
        "#fff",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    title: {
      fontSize: ms(21),
      fontWeight: "900",
      color: "#0F172A",
    },

    heroCard: {
      marginTop: vs(18),
      backgroundColor:
        "#2563EB",
      borderRadius:
        s(28),
      padding: s(24),
      alignItems:
        "center",
    },

    avatar: {
      width: s(78),
      height: s(78),
      borderRadius:
        s(39),
      backgroundColor:
        "rgba(255,255,255,0.18)",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    avatarText: {
      fontSize: ms(30),
      fontWeight: "900",
      color: "#fff",
    },

    heroName: {
      marginTop: vs(14),
      fontSize: ms(24),
      fontWeight: "900",
      color: "#fff",
    },

    heroEmail: {
      marginTop: vs(4),
      fontSize: ms(13),
      color: "#DBEAFE",
    },

    badge: {
      marginTop: vs(14),
      backgroundColor:
        "rgba(255,255,255,0.18)",
      paddingHorizontal:
        s(14),
      paddingVertical:
        vs(7),
      borderRadius:
        s(14),
    },

    badgeText: {
      color: "#fff",
      fontWeight: "800",
      fontSize: ms(12),
    },

    infoCard: {
      marginTop: vs(14),
      backgroundColor:
        "#fff",
      borderRadius:
        s(22),
      padding: s(16),
    },

    infoLeft: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    iconWrap: {
      width: s(44),
      height: s(44),
      borderRadius:
        s(14),
      backgroundColor:
        "#EFF6FF",
      justifyContent:
        "center",
      alignItems:
        "center",
      marginRight:
        s(12),
    },

    infoLabel: {
      fontSize: ms(12),
      color: "#64748B",
      fontWeight: "700",
    },

    infoValue: {
      marginTop: vs(4),
      fontSize: ms(15),
      fontWeight: "900",
      color: "#0F172A",
    },

    subjectCard: {
      marginTop: vs(14),
      backgroundColor:
        "#fff",
      borderRadius:
        s(22),
      padding: s(16),
    },

    subjectHead: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom:
        vs(12),
    },

    subjectTitle: {
      marginLeft: s(8),
      fontSize: ms(15),
      fontWeight: "900",
      color: "#0F172A",
    },

    subjectItem: {
      backgroundColor:
        "#F8FAFC",
      borderRadius:
        s(14),
      paddingVertical:
        vs(12),
      paddingHorizontal:
        s(12),
      marginBottom:
        vs(8),
    },

    subjectText: {
      fontSize: ms(14),
      fontWeight: "700",
      color: "#334155",
    },

    emptyText: {
      fontSize: ms(13),
      color: "#94A3B8",
    },
  });