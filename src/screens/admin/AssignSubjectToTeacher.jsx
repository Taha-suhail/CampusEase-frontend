import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
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
  ASSIGN_SUBJECT_TO_TEACHER,
  GET_TEACHERS,
  GET_SUBJECTS,
} from "../../services/AdminServices";

const AssignSubjectToTeacher = ({
  route,
  navigation,
}) => {
  const { subjectId } =
    route.params || {};

  const [teachers, setTeachers] =
    useState([]);

  const [subjects, setSubjects] =
    useState([]);

  const [
    selectedTeacher,
    setSelectedTeacher,
  ] = useState("");

  const [
    selectedSubject,
    setSelectedSubject,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const fetchData =
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
          setFetching(
            true
          );
        }

        const [
          teachersRes,
          subjectsRes,
        ] =
          await Promise.all(
            [
              GET_TEACHERS(),
              GET_SUBJECTS(),
            ]
          );

        if (
          teachersRes.success
        ) {
          setTeachers(
            teachersRes.data ||
              []
          );
        }

        if (
          subjectsRes.success
        ) {
          const list =
            subjectsRes.data ||
            [];

          setSubjects(
            list
          );

          if (
            subjectId
          ) {
            const found =
              list.find(
                (
                  item
                ) =>
                  String(
                    item._id
                  ) ===
                  String(
                    subjectId
                  )
              );

            if (
              found
            ) {
              setSelectedSubject(
                found._id
              );
            }
          }
        }
      } finally {
        setFetching(
          false
        );
        setRefreshing(
          false
        );
      }
    };

  useEffect(() => {
    fetchData();
  }, [subjectId]);

  const onRefresh =
    useCallback(() => {
      fetchData(
        true
      );
    }, [subjectId]);

  const handleAssign =
    async () => {
      if (
        !selectedTeacher ||
        !selectedSubject
      ) {
        Alert.alert(
          "Required",
          "Please select teacher and subject."
        );
        return;
      }

      try {
        setLoading(
          true
        );

        const res =
          await ASSIGN_SUBJECT_TO_TEACHER(
            {
              teacherId:
                selectedTeacher,
              subjectId:
                selectedSubject,
            }
          );

        if (
          res.success
        ) {
          Alert.alert(
            "Success",
            "Subject assigned successfully."
          );

          navigation.goBack();
        } else {
          Alert.alert(
            "Error",
            res.message
          );
        }
      } catch (
        error
      ) {
        Alert.alert(
          "Error",
          error.message
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  if (fetching) {
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

          <Text
            style={
              styles.loadingText
            }
          >
            Loading data...
          </Text>
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
            Assign Subject
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
              styles.heroIcon
            }
          >
            <Ionicons
              name="git-network-outline"
              size={34}
              color="#fff"
            />
          </View>

          <Text
            style={
              styles.heroTitle
            }
          >
            Faculty Mapping
          </Text>

          <Text
            style={
              styles.heroSub
            }
          >
            Assign subject to the
            right teacher in one tap.
          </Text>
        </View>

        {/* Form */}
        <View
          style={
            styles.formCard
          }
        >
          <Text
            style={
              styles.label
            }
          >
            Select Teacher
          </Text>

          <View
            style={
              styles.pickerWrap
            }
          >
            <Picker
              selectedValue={
                selectedTeacher
              }
              onValueChange={
                setSelectedTeacher
              }
              style={
                styles.picker
              }
            >
              <Picker.Item
                label="Choose Teacher"
                value=""
              />

              {teachers.map(
                (
                  item
                ) => (
                  <Picker.Item
                    key={
                      item
                        .teacher
                        ?._id
                    }
                    label={`${item.teacher?.fullName} (${item.employeeId || "ID"})`}
                    value={
                      item
                        .teacher
                        ?._id
                    }
                  />
                )
              )}
            </Picker>
          </View>

          <Text
            style={[
              styles.label,
              {
                marginTop:
                  vs(
                    14
                  ),
              },
            ]}
          >
            Select Subject
          </Text>

          <View
            style={
              styles.pickerWrap
            }
          >
            <Picker
              selectedValue={
                selectedSubject
              }
              onValueChange={
                setSelectedSubject
              }
              style={
                styles.picker
              }
            >
              <Picker.Item
                label="Choose Subject"
                value=""
              />

              {subjects.map(
                (
                  item
                ) => (
                  <Picker.Item
                    key={
                      item._id
                    }
                    label={`${item.name} (${item.code})`}
                    value={
                      item._id
                    }
                  />
                )
              )}
            </Picker>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={
              styles.assignBtn
            }
            onPress={
              handleAssign
            }
            disabled={
              loading
            }
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text
                  style={
                    styles.assignText
                  }
                >
                  Assign Subject
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#fff"
                />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.cancelBtn
            }
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text
              style={
                styles.cancelText
              }
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AssignSubjectToTeacher;

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

    loadingText: {
      marginTop: vs(12),
      color: "#64748B",
      fontWeight: "700",
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

    heroIcon: {
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
      marginTop: vs(14),
      fontSize: ms(24),
      fontWeight: "900",
      color: "#fff",
    },

    heroSub: {
      marginTop: vs(8),
      color: "#DBEAFE",
      fontSize: ms(14),
      textAlign:
        "center",
    },

    formCard: {
      marginTop: vs(16),
      backgroundColor:
        "#fff",
      borderRadius:
        s(24),
      padding: s(18),
    },

    label: {
      fontSize: ms(13),
      fontWeight: "800",
      color: "#334155",
      marginBottom:
        vs(8),
    },

    pickerWrap: {
      backgroundColor:
        "#F8FAFC",
      borderRadius:
        s(16),
      borderWidth: 1,
      borderColor:
        "#E2E8F0",
      overflow:
        "hidden",
    },

    picker: {
      height: vs(52),
      color: "#0F172A",
    },

    assignBtn: {
      marginTop: vs(18),
      backgroundColor:
        "#2563EB",
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

    assignText: {
      color: "#fff",
      fontWeight: "900",
      fontSize: ms(16),
      marginRight:
        s(8),
    },

    cancelBtn: {
      marginTop: vs(10),
      borderWidth: 1,
      borderColor:
        "#E2E8F0",
      borderRadius:
        s(16),
      paddingVertical:
        vs(14),
      alignItems:
        "center",
    },

    cancelText: {
      color: "#64748B",
      fontWeight: "800",
      fontSize: ms(14),
    },
  });