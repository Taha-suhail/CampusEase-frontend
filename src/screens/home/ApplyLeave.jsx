import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import {
  Picker,
} from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  s,
  vs,
  ms,
} from "react-native-size-matters";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {
  GET_STUDENT_DASHBOARD,
} from "../../services/StudentService";

import {
  CREATE_LEAVE_REQUEST,
} from "../../services/LeaveRequestService";

const ApplyLeave = ({
  navigation,
}) => {
  const [
    subjects,
    setSubjects,
  ] =
    useState(
      []
    );

  const [
    subject,
    setSubject,
  ] =
    useState(
      ""
    );

  const [
    fromDate,
    setFromDate,
  ] =
    useState(
      ""
    );

  const [
    toDate,
    setToDate,
  ] =
    useState(
      ""
    );

  const [
    type,
    setType,
  ] =
    useState(
      ""
    );

  const [
    reason,
    setReason,
  ] =
    useState(
      ""
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );

  const [
    pageLoading,
    setPageLoading,
  ] =
    useState(
      true
    );

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(
      false
    );

  const [
    showFromPicker,
    setShowFromPicker,
  ] =
    useState(
      false
    );

  const [
    showToPicker,
    setShowToPicker,
  ] =
    useState(
      false
    );

  /* ------------------ */
  /* Helpers */
  /* ------------------ */

  const formatDate =
    (
      date
    ) => {
      return date
        .toISOString()
        .split(
          "T"
        )[0];
    };

  /* ------------------ */
  /* Load Subjects */
  /* ------------------ */

  const fetchSubjects =
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
          setPageLoading(
            true
          );
        }

        const res =
          await GET_STUDENT_DASHBOARD();

        let list =
          [];

        if (
          res.success &&
          Array.isArray(
            res.data
          )
        ) {
          list =
            res.data;
        } else if (
          res.success &&
          Array.isArray(
            res.data
              ?.subjects
          )
        ) {
          list =
            res.data
              .subjects;
        }

        setSubjects(
          list
        );
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to load subjects"
        );
      } finally {
        setRefreshing(
          false
        );
        setPageLoading(
          false
        );
      }
    };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const onRefresh =
    useCallback(
      () => {
        fetchSubjects(
          true
        );
      },
      []
    );

  const selectedSubject =
    subjects.find(
      (
        item
      ) =>
        item._id ===
        subject
    );

  /* ------------------ */
  /* Submit */
  /* ------------------ */

  const handleSubmit =
    async () => {
      if (
        !subject ||
        !fromDate ||
        !toDate ||
        !type ||
        !reason
      ) {
        Alert.alert(
          "Missing Fields",
          "Please fill all required fields."
        );
        return;
      }

      if (
        new Date(
          toDate
        ) <
        new Date(
          fromDate
        )
      ) {
        Alert.alert(
          "Invalid Dates",
          "To Date cannot be before From Date."
        );
        return;
      }

      try {
        setLoading(
          true
        );

        const res =
          await CREATE_LEAVE_REQUEST(
            {
              subjectId:
                subject,
              fromDate,
              toDate,
              type,
              reason,
            }
          );

        if (
          res.success
        ) {
          Alert.alert(
            "Success",
            "Leave request submitted successfully."
          );

          setSubject(
            ""
          );
          setFromDate(
            ""
          );
          setToDate(
            ""
          );
          setType(
            ""
          );
          setReason(
            ""
          );

          navigation.goBack();
        } else {
          Alert.alert(
            "Error",
            res.message
          );
        }
      } catch (error) {
        Alert.alert(
          "Error",
          error.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <ScrollView
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
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* Hero */}
        <View
          style={
            styles.heroCard
          }
        >
          <View
            style={
              styles.iconWrap
            }
          >
            <Ionicons
              name="calendar-outline"
              size={
                34
              }
              color="#fff"
            />
          </View>

          <Text
            style={
              styles.title
            }
          >
            Apply Leave
          </Text>

          <Text
            style={
              styles.subTitle
            }
          >
            Submit leave request
            quickly with calendar
            date selection.
          </Text>
        </View>

        {pageLoading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={{
              marginTop:
                vs(
                  30
                ),
            }}
          />
        ) : (
          <View
            style={
              styles.formCard
            }
          >
            {/* Subject */}
            <Label
              icon="book-outline"
              text="Subject *"
            />

            <View
              style={
                styles.pickerWrap
              }
            >
              <Picker
                selectedValue={
                  subject
                }
                onValueChange={
                  setSubject
                }
              >
                <Picker.Item
                  label="Select Subject"
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
                      label={
                        item.name
                      }
                      value={
                        item._id
                      }
                    />
                  )
                )}
              </Picker>
            </View>

            {/* Teacher */}
            <Label
              icon="person-outline"
              text="Teacher"
            />

            <View
              style={
                styles.readonly
              }
            >
              <Text
                style={
                  styles.readonlyText
                }
              >
                {selectedSubject
                  ?.teacher
                  ?.fullName ||
                  "Not Assigned"}
              </Text>
            </View>

            {/* From Date */}
            <Label
              icon="calendar-outline"
              text="From Date *"
            />

            <TouchableOpacity
              style={
                styles.input
              }
              onPress={() =>
                setShowFromPicker(
                  true
                )
              }
            >
              <Text
                style={
                  styles.dateText
                }
              >
                {fromDate ||
                  "Select From Date"}
              </Text>
            </TouchableOpacity>

            {/* To Date */}
            <Label
              icon="calendar-outline"
              text="To Date *"
            />

            <TouchableOpacity
              style={
                styles.input
              }
              onPress={() =>
                setShowToPicker(
                  true
                )
              }
            >
              <Text
                style={
                  styles.dateText
                }
              >
                {toDate ||
                  "Select To Date"}
              </Text>
            </TouchableOpacity>

            {/* Leave Type */}
            <Label
              icon="list-outline"
              text="Leave Type *"
            />

            <View
              style={
                styles.pickerWrap
              }
            >
              <Picker
                selectedValue={
                  type
                }
                onValueChange={
                  setType
                }
              >
                <Picker.Item
                  label="Select Type"
                  value=""
                />
                <Picker.Item
                  label="Medical"
                  value="Medical"
                />
                <Picker.Item
                  label="Personal"
                  value="Personal"
                />
                <Picker.Item
                  label="Emergency"
                  value="Emergency"
                />
                <Picker.Item
                  label="Technical"
                  value="Technical"
                />
                <Picker.Item
                  label="Other"
                  value="Other"
                />
              </Picker>
            </View>

            {/* Reason */}
            <Label
              icon="document-text-outline"
              text="Reason *"
            />

            <TextInput
              style={[
                styles.input,
                styles.textArea,
              ]}
              placeholder="Write your reason..."
              multiline
              value={
                reason
              }
              onChangeText={
                setReason
              }
            />

            {/* Submit */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                loading &&
                  styles.disabledBtn,
              ]}
              onPress={
                handleSubmit
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
                      styles.submitText
                    }
                  >
                    Submit Request
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={
                      18
                    }
                    color="#fff"
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Date Pickers */}
      <DateTimePickerModal
        isVisible={
          showFromPicker
        }
        mode="date"
        minimumDate={
          new Date()
        }
        onConfirm={(
          date
        ) => {
          setFromDate(
            formatDate(
              date
            )
          );
          setShowFromPicker(
            false
          );
        }}
        onCancel={() =>
          setShowFromPicker(
            false
          )
        }
      />

      <DateTimePickerModal
        isVisible={
          showToPicker
        }
        mode="date"
        minimumDate={
          fromDate
            ? new Date(
                fromDate
              )
            : new Date()
        }
        onConfirm={(
          date
        ) => {
          setToDate(
            formatDate(
              date
            )
          );
          setShowToPicker(
            false
          );
        }}
        onCancel={() =>
          setShowToPicker(
            false
          )
        }
      />
    </SafeAreaView>
  );
};

export default ApplyLeave;

/* ------------------ */
/* Label */
/* ------------------ */

const Label = ({
  icon,
  text,
}) => (
  <View
    style={
      styles.labelRow
    }
  >
    <Ionicons
      name={icon}
      size={16}
      color="#2563EB"
    />
    <Text
      style={
        styles.label
      }
    >
      {text}
    </Text>
  </View>
);

/* ------------------ */
/* Styles */
/* ------------------ */

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        "#F8FAFC",
    },

    container: {
      padding: s(16),
      paddingBottom:
        vs(30),
    },

    heroCard: {
      backgroundColor:
        "#2563EB",
      borderRadius:
        s(24),
      padding: s(22),
      alignItems:
        "center",
    },

    iconWrap: {
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

    title: {
      marginTop: vs(14),
      fontSize: ms(24),
      fontWeight: "900",
      color: "#fff",
    },

    subTitle: {
      marginTop: vs(8),
      color: "#DBEAFE",
      fontSize: ms(14),
      textAlign:
        "center",
      lineHeight:
        vs(22),
    },

    formCard: {
      marginTop: vs(16),
      backgroundColor:
        "#fff",
      borderRadius:
        s(22),
      padding: s(18),
    },

    labelRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginTop: vs(12),
      marginBottom:
        vs(8),
    },

    label: {
      marginLeft: s(8),
      fontSize: ms(14),
      fontWeight: "800",
      color: "#334155",
    },

    input: {
      backgroundColor:
        "#F8FAFC",
      borderWidth: 1,
      borderColor:
        "#E2E8F0",
      borderRadius:
        s(16),
      paddingHorizontal:
        s(14),
      paddingVertical:
        vs(14),
      justifyContent:
        "center",
    },

    dateText: {
      fontSize: ms(14),
      color: "#0F172A",
      fontWeight: "700",
    },

    textArea: {
      height: vs(100),
      textAlignVertical:
        "top",
    },

    pickerWrap: {
      backgroundColor:
        "#F8FAFC",
      borderWidth: 1,
      borderColor:
        "#E2E8F0",
      borderRadius:
        s(16),
      overflow:
        "hidden",
    },

    readonly: {
      backgroundColor:
        "#F8FAFC",
      borderWidth: 1,
      borderColor:
        "#E2E8F0",
      borderRadius:
        s(16),
      paddingHorizontal:
        s(14),
      paddingVertical:
        vs(15),
    },

    readonlyText: {
      color: "#0F172A",
      fontSize: ms(14),
      fontWeight: "700",
    },

    submitBtn: {
      marginTop: vs(22),
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

    disabledBtn: {
      opacity: 0.7,
    },

    submitText: {
      color: "#fff",
      fontSize: ms(16),
      fontWeight: "900",
      marginRight:
        s(8),
    },
  });