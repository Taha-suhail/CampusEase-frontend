import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  FlatList,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs, ms } from "react-native-size-matters";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  GET_TEACHER_ASSIGNMENTS,
  CREATE_ASSIGNMENT,
  GET_ASSIGNMENT_SUBMISSIONS,
  GRADE_SUBMISSION,
  DELETE_ASSIGNMENT,
} from "../../services/AssignmentService";

import { GET_ASSIGNED_SUBJECTS } from "../../services/TeacherServices";

const TeacherAssignments = ({ navigation }) => {
  const [assignments, setAssignments] = useState([]);

  const [subjects, setSubjects] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const [submissionsModalVisible, setSubmissionsModalVisible] = useState(false);

  const [gradeModalVisible, setGradeModalVisible] = useState(false);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [selectedSubject, setSelectedSubject] = useState(null);

  const [dueDate, setDueDate] = useState(new Date());

  const [showCalendar, setShowCalendar] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [submissions, setSubmissions] = useState([]);

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [grade, setGrade] = useState("");

  const [feedback, setFeedback] = useState("");

  const loadData = async () => {
    const [assignRes, subjectRes] = await Promise.all([
      GET_TEACHER_ASSIGNMENTS(),
      GET_ASSIGNED_SUBJECTS(),
    ]);

    if (assignRes.success) setAssignments(assignRes.data || []);

    if (subjectRes.success) setSubjects(subjectRes.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleCreate = async () => {
    if (!title || !description || !selectedSubject) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    const res = await CREATE_ASSIGNMENT({
      title,
      description,
      courseId: selectedSubject._id,
      dueDate,
    });

    if (res.success) {
      setCreateModalVisible(false);
      resetForm();
      loadData();
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedSubject(null);
    setDueDate(new Date());
  };

  const handleDelete = (item) => {
    Alert.alert("Delete", "Delete this assignment?", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const res = await DELETE_ASSIGNMENT(item._id);

          if (res.success) loadData();
        },
      },
    ]);
  };

  const openSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);

    const res = await GET_ASSIGNMENT_SUBMISSIONS(assignment._id);

    if (res.success) {
      setSubmissions(res.data || []);

      setSubmissionsModalVisible(true);
    }
  };

  const submitGrade = async () => {
    const res = await GRADE_SUBMISSION(selectedSubmission._id, {
      grade: parseInt(grade),
      feedback,
    });

    if (res.success) {
      setGradeModalVisible(false);
      openSubmissions(selectedAssignment);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563EB"]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Assignments</Text>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setCreateModalVisible(true)}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Manage Assignments</Text>

          <Text style={styles.heroSub}>
            Create tasks, review submissions and grade students.
          </Text>
        </View>

        {/* Cards */}
        {assignments.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="document-text-outline" size={64} color="#CBD5E1" />

            <Text style={styles.emptyText}>No assignments yet</Text>
          </View>
        ) : (
          assignments.map((item) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#2563EB"
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    marginLeft: s(12),
                  }}
                >
                  <Text style={styles.cardTitle}>{item.title}</Text>

                  <Text style={styles.subjectText}>
                    {item?.subject?.name || "Subject"}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                </TouchableOpacity>
              </View>

              <Text style={styles.desc} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={15} color="#64748B" />
                <Text style={styles.dateText}>
                  Due: {formatDate(item.dueDate)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => openSubmissions(item)}
              >
                <Text style={styles.actionBtnText}>View Submissions</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Create Modal */}
      <Modal visible={createModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Create Assignment</Text>

            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              style={[
                styles.input,
                {
                  height: vs(90),
                  textAlignVertical: "top",
                },
              ]}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {subjects.map((sub) => (
                <TouchableOpacity
                  key={sub._id}
                  style={[
                    styles.chip,
                    selectedSubject?._id === sub._id && styles.activeChip,
                  ]}
                  onPress={() => setSelectedSubject(sub)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedSubject?._id === sub._id && {
                        color: "#fff",
                      },
                    ]}
                  >
                    {sub.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Calendar */}
            <TouchableOpacity
              style={styles.calendarBtn}
              onPress={() => setShowCalendar(true)}
            >
              <Ionicons name="calendar-outline" size={18} color="#2563EB" />

              <Text style={styles.calendarText}>{formatDate(dueDate)}</Text>
            </TouchableOpacity>

            {showCalendar && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                minimumDate={new Date()}
                display="default"
                onChange={(e, date) => {
                  setShowCalendar(false);

                  if (date) setDueDate(date);
                }}
              />
            )}

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
              <Text style={styles.submitText}>Create</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Submissions Modal */}
      <Modal
        visible={submissionsModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Submissions</Text>

            <FlatList
              data={submissions}
              keyExtractor={(i) => i._id}
              renderItem={({ item }) => (
                <View style={styles.submissionCard}>
                  <Text style={styles.studentName}>
                    {item?.student?.fullName || "Student"}
                  </Text>

                  <Text style={styles.comment}>
                    {item.comment || "No comment"}
                  </Text>

                  <TouchableOpacity
                    style={styles.gradeBtn}
                    onPress={() => {
                      setSelectedSubmission(item);
                      setGradeModalVisible(true);
                    }}
                  >
                    <Text style={styles.gradeBtnText}>Grade</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            <TouchableOpacity onPress={() => setSubmissionsModalVisible(false)}>
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Grade Modal */}
      <Modal visible={gradeModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Grade Submission</Text>

            <TextInput
              placeholder="Grade"
              keyboardType="numeric"
              value={grade}
              onChangeText={setGrade}
              style={styles.input}
            />

            <TextInput
              placeholder="Feedback"
              value={feedback}
              onChangeText={setFeedback}
              style={[
                styles.input,
                {
                  height: vs(90),
                  textAlignVertical: "top",
                },
              ]}
              multiline
            />

            <TouchableOpacity style={styles.submitBtn} onPress={submitGrade}>
              <Text style={styles.submitText}>Submit Grade</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setGradeModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TeacherAssignments;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    padding: s(16),
    paddingBottom: vs(40),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(18),
  },

  headerTitle: {
    fontSize: ms(22),
    fontWeight: "900",
    color: "#0F172A",
  },

  addBtn: {
    width: s(42),
    height: s(42),
    borderRadius: s(14),
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  heroCard: {
    backgroundColor: "#2563EB",
    borderRadius: s(24),
    padding: s(22),
    marginBottom: vs(16),
  },

  heroTitle: {
    fontSize: ms(22),
    fontWeight: "900",
    color: "#fff",
  },

  heroSub: {
    color: "#DBEAFE",
    marginTop: vs(8),
  },

  emptyBox: {
    alignItems: "center",
    marginTop: vs(50),
  },

  emptyText: {
    marginTop: vs(12),
    color: "#64748B",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: s(20),
    padding: s(16),
    marginBottom: vs(14),
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: s(42),
    height: s(42),
    borderRadius: s(14),
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: ms(15),
    fontWeight: "900",
    color: "#0F172A",
  },

  subjectText: {
    fontSize: ms(12),
    color: "#2563EB",
    marginTop: vs(2),
  },

  desc: {
    marginTop: vs(12),
    color: "#64748B",
    lineHeight: vs(20),
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vs(10),
  },

  dateText: {
    marginLeft: s(6),
    color: "#64748B",
    fontSize: ms(12),
  },

  actionBtn: {
    marginTop: vs(14),
    backgroundColor: "#2563EB",
    borderRadius: s(14),
    paddingVertical: vs(12),
    alignItems: "center",
  },

  actionBtnText: {
    color: "#fff",
    fontWeight: "800",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: s(24),
    borderTopRightRadius: s(24),
    padding: s(18),
    maxHeight: "88%",
  },

  modalTitle: {
    fontSize: ms(18),
    fontWeight: "900",
    marginBottom: vs(14),
    color: "#0F172A",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: s(14),
    padding: s(12),
    marginBottom: vs(12),
  },

  chip: {
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    backgroundColor: "#F1F5F9",
    borderRadius: s(20),
    marginRight: s(8),
    marginBottom: vs(12),
  },

  activeChip: {
    backgroundColor: "#2563EB",
  },

  chipText: {
    fontWeight: "700",
    color: "#475569",
  },

  calendarBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: s(14),
    borderRadius: s(14),
    marginBottom: vs(14),
  },

  calendarText: {
    marginLeft: s(8),
    color: "#2563EB",
    fontWeight: "800",
  },

  submitBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: vs(14),
    borderRadius: s(14),
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontWeight: "900",
  },

  cancelText: {
    textAlign: "center",
    marginTop: vs(14),
    color: "#64748B",
    fontWeight: "700",
  },

  submissionCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: s(14),
    padding: s(14),
    marginBottom: vs(10),
  },

  studentName: {
    fontWeight: "900",
    color: "#0F172A",
  },

  comment: {
    marginTop: vs(6),
    color: "#64748B",
  },

  gradeBtn: {
    marginTop: vs(10),
    backgroundColor: "#2563EB",
    paddingVertical: vs(10),
    borderRadius: s(12),
    alignItems: "center",
  },

  gradeBtnText: {
    color: "#fff",
    fontWeight: "800",
  },
});
