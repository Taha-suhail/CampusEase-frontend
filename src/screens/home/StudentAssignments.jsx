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
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs, ms } from "react-native-size-matters";
import { useState, useCallback, useEffect } from "react";

import {
  GET_STUDENT_ASSIGNMENTS,
  SUBMIT_ASSIGNMENT,
  GET_MY_SUBMISSIONS,
} from "../../services/AssignmentService";

const StudentAssignments = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load assignments
  const loadAssignments = async () => {
    try {
      const [assignmentsRes, submissionsRes] = await Promise.all([
        GET_STUDENT_ASSIGNMENTS(),
        GET_MY_SUBMISSIONS(),
      ]);
      if (assignmentsRes.success) {
        setAssignments(assignmentsRes.data || []);
      } else {
        setAssignments([]);
      }
      if (submissionsRes.success) {
        setSubmissions(submissionsRes.data || []);
      } else {
        setSubmissions([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setAssignments([]);
      setSubmissions([]);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAssignments();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadAssignments();
  }, []);

  // Handle submit assignment
  const handleSubmit = async () => {
    if (!submissionText.trim()) {
      Alert.alert("Error", "Please enter your submission details");
      return;
    }

    setSubmitting(true);
    try {
      const res = await SUBMIT_ASSIGNMENT(selectedAssignment._id, {
        comment: submissionText.trim(),
      });

      if (res.success) {
        Alert.alert("Success", "Assignment submitted successfully!", [
          {
            text: "OK",
            onPress: () => {
              setSubmitModalVisible(false);
              setSubmissionText("");
              loadAssignments();
            },
          },
        ]);
      } else {
        Alert.alert("Error", res.message || "Failed to submit assignment");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Check if due date is passed
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: 0 }]}>
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
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Assignments</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Assignments List */}
        {assignments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No assignments available</Text>
          </View>
        ) : (
          assignments.map((assignment) => (
            <View key={assignment._id} style={styles.assignmentCard}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="document-text" size={22} color="#14B8A6" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                  <Text style={styles.courseName}>
                    {assignment.subject?.name || "Subject"}
                  </Text>
                </View>
                {isOverdue(assignment.dueDate) ? (
                  <View style={styles.overdueBadge}>
                    <Text style={styles.overdueBadgeText}>Overdue</Text>
                  </View>
                ) : (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Active</Text>
                  </View>
                )}
              </View>

              {/* Description */}
              <Text style={styles.description} numberOfLines={2}>
                {assignment.description}
              </Text>

              {/* Due Date */}
              <View style={styles.dueDateRow}>
                <Ionicons name="calendar-outline" size={16} color="#64748B" />
                <Text style={styles.dueDateText}>
                  Due: {formatDate(assignment.dueDate)}
                </Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  isOverdue(assignment.dueDate) && styles.submitBtnDisabled,
                ]}
                onPress={() => {
                  setSelectedAssignment(assignment);
                  setSubmitModalVisible(true);
                }}
                disabled={isOverdue(assignment.dueDate)}
              >
                <Text style={styles.submitBtnText}>
                  {isOverdue(assignment.dueDate) ? "Closed" : "Submit"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* My Grades Section */}
        {submissions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>My Grades</Text>
            {submissions.map((submission) => (
              <View key={submission._id} style={styles.gradeCard}>
                <View style={styles.gradeCardHeader}>
                  <View style={styles.gradeIconContainer}>
                    <Ionicons name="school" size={20} color="#14B8A6" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.gradeTitle}>
                      {submission.assignment?.title || "Assignment"}
                    </Text>
                    <Text style={styles.gradeDate}>
                      Submitted: {formatDate(submission.submittedAt)}
                    </Text>
                  </View>
                  {submission.grade !== null &&
                  submission.grade !== undefined ? (
                    <View style={styles.gradeBadge}>
                      <Text style={styles.gradeBadgeText}>
                        {submission.grade}/100
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.pendingGradeBadge}>
                      <Text style={styles.pendingGradeBadgeText}>Pending</Text>
                    </View>
                  )}
                </View>

                {submission.comment && (
                  <Text style={styles.gradeComment} numberOfLines={2}>
                    Your submission: {submission.comment}
                  </Text>
                )}

                {submission.feedback && (
                  <View style={styles.feedbackRow}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={14}
                      color="#64748B"
                    />
                    <Text style={styles.feedbackText}>
                      Feedback: {submission.feedback}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Submit Modal */}
      <Modal
        visible={submitModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSubmitModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Assignment</Text>
              <TouchableOpacity
                onPress={() => {
                  setSubmitModalVisible(false);
                  setSubmissionText("");
                }}
              >
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {selectedAssignment?.title}
            </Text>

            <Text style={styles.inputLabel}>Your Submission</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your answer or comments..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={submissionText}
              onChangeText={setSubmissionText}
            />

            <TouchableOpacity
              style={[styles.submitModalBtn, submitting && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitModalBtnText}>
                {submitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default StudentAssignments;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: s(16) },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: vs(20),
  },
  headerTitle: {
    fontSize: ms(18),
    fontWeight: "800",
    color: "#0F172A",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(40),
  },
  emptyText: {
    fontSize: ms(14),
    color: "#64748B",
    marginTop: vs(10),
  },
  assignmentCard: {
    backgroundColor: "#fff",
    borderRadius: s(14),
    padding: s(16),
    marginBottom: vs(14),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(10),
  },
  iconContainer: {
    backgroundColor: "#E0F7F4",
    borderRadius: s(8),
    padding: s(8),
    marginRight: s(10),
  },
  assignmentTitle: {
    fontSize: ms(16),
    fontWeight: "800",
    color: "#0F172A",
  },
  courseName: {
    fontSize: ms(12),
    color: "#14B8A6",
    fontWeight: "600",
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: s(8),
  },
  activeBadgeText: {
    fontSize: ms(11),
    fontWeight: "700",
    color: "#059669",
  },
  overdueBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: s(8),
  },
  overdueBadgeText: {
    fontSize: ms(11),
    fontWeight: "700",
    color: "#DC2626",
  },
  description: {
    fontSize: ms(13),
    color: "#64748B",
    marginBottom: vs(10),
    lineHeight: 18,
  },
  dueDateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(12),
  },
  dueDateText: {
    fontSize: ms(12),
    color: "#64748B",
    marginLeft: s(6),
  },
  submitBtn: {
    backgroundColor: "#14B8A6",
    paddingVertical: vs(10),
    borderRadius: s(10),
    alignItems: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#94A3B8",
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: ms(13),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: s(20),
    borderTopRightRadius: s(20),
    padding: s(20),
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(10),
  },
  modalTitle: {
    fontSize: ms(18),
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: ms(14),
    color: "#64748B",
    marginBottom: vs(16),
  },
  inputLabel: {
    fontSize: ms(14),
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: vs(8),
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: s(10),
    padding: s(12),
    fontSize: ms(14),
    color: "#0F172A",
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitModalBtn: {
    backgroundColor: "#14B8A6",
    paddingVertical: vs(14),
    borderRadius: s(10),
    alignItems: "center",
    marginTop: vs(16),
  },
  submitModalBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: ms(14),
  },
  btnDisabled: {
    opacity: 0.6,
  },
  sectionTitle: {
    fontSize: ms(16),
    fontWeight: "800",
    color: "#0F172A",
    marginTop: vs(20),
    marginBottom: vs(12),
  },
  gradeCard: {
    backgroundColor: "#fff",
    borderRadius: s(14),
    padding: s(16),
    marginBottom: vs(12),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  gradeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  gradeIconContainer: {
    backgroundColor: "#E0F7F4",
    borderRadius: s(8),
    padding: s(8),
    marginRight: s(10),
  },
  gradeTitle: {
    fontSize: ms(15),
    fontWeight: "800",
    color: "#0F172A",
  },
  gradeDate: {
    fontSize: ms(11),
    color: "#64748B",
    marginTop: 2,
  },
  gradeBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: s(8),
  },
  gradeBadgeText: {
    fontSize: ms(14),
    fontWeight: "900",
    color: "#059669",
  },
  pendingGradeBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: s(8),
  },
  pendingGradeBadgeText: {
    fontSize: ms(12),
    fontWeight: "700",
    color: "#D97706",
  },
  gradeComment: {
    fontSize: ms(12),
    color: "#64748B",
    marginTop: vs(10),
    fontStyle: "italic",
  },
  feedbackRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: vs(8),
    backgroundColor: "#F8FAFC",
    padding: s(10),
    borderRadius: s(8),
  },
  feedbackText: {
    fontSize: ms(12),
    color: "#475569",
    marginLeft: s(6),
    flex: 1,
  },
});
