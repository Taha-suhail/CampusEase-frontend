import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs, ms } from "react-native-size-matters";

import { GET_SUBJECTS, DELETE_SUBJECT } from "../../services/AdminServices";

const SubjectsList = ({ navigation }) => {
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const loadSubjects = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await GET_SUBJECTS();

      if (res.success) {
        setSubjects(res.data || []);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (subjectId) => {
    Alert.alert(
      "Delete Subject",
      "Are you sure you want to delete this subject?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(subjectId);
            const res = await DELETE_SUBJECT(subjectId);
            setDeletingId(null);
            if (res.success) {
              Alert.alert("Success", "Subject deleted successfully");
              loadSubjects();
            } else {
              Alert.alert("Error", res.message);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (item) => {
    navigation.navigate("EditSubject", { subject: item });
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const onRefresh = useCallback(() => {
    loadSubjects(true);
  }, []);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((item) => {
      const txt = [
        item.name,
        item.code,
        item.department,
        item.teacher?.fullName,
      ]
        .join(" ")
        .toLowerCase();

      return txt.includes(search.toLowerCase());
    });
  }, [subjects, search]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.cardContent}
        onPress={() =>
          navigation.navigate("AssignSubjectToTeacher", {
            subjectId: item._id,
          })
        }
      >
        <View style={styles.topRow}>
          <View style={styles.subjectIcon}>
            <Ionicons name="book-outline" size={20} color="#2563EB" />
          </View>

          <View
            style={{
              flex: 1,
              marginLeft: s(12),
            }}
          >
            <Text style={styles.subjectName}>{item.name}</Text>

            <Text style={styles.subjectCode}>{item.code}</Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </View>

        <View style={styles.metaWrap}>
          <Badge text={item.department || "N/A"} color="#14B8A6" />

          <Badge text={`Sem ${item.semester || "-"}`} color="#8B5CF6" />

          <Badge
            text={item.teacher ? "Assigned" : "Pending"}
            color={item.teacher ? "#16A34A" : "#F59E0B"}
          />
        </View>

        <Text style={styles.teacherText}>
          {item.teacher?.fullName
            ? `Faculty: ${item.teacher.fullName}`
            : "No teacher assigned"}
        </Text>
      </TouchableOpacity>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create-outline" size={18} color="#2563EB" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item._id)}
          disabled={deletingId === item._id}
        >
          {deletingId === item._id ? (
            <ActivityIndicator size="small" color="#DC2626" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={18} color="#DC2626" />
              <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.title}>Subjects</Text>

          <View
            style={{
              width: s(40),
            }}
          />
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.glow1} />
          <View style={styles.glow2} />

          <Text style={styles.heroTitle}>Subject Management</Text>

          <Text style={styles.heroSub}>
            Manage courses, assign faculty and track semesters.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color="#94A3B8" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search subject, code, teacher..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          <FlatList
            data={filteredSubjects}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: vs(30),
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No subjects found</Text>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#2563EB"]}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SubjectsList;

/* ---------- Badge ---------- */

const Badge = ({ text, color }) => (
  <View
    style={[
      styles.badge,
      {
        backgroundColor: `${color}15`,
      },
    ]}
  >
    <Text
      style={[
        styles.badgeText,
        {
          color,
        },
      ]}
    >
      {text}
    </Text>
  </View>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
    paddingHorizontal: s(18),
  },

  header: {
    marginTop: vs(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: ms(22),
    fontWeight: "900",
    color: "#0F172A",
  },

  heroCard: {
    marginTop: vs(18),
    backgroundColor: "#2563EB",
    borderRadius: s(24),
    padding: s(22),
    overflow: "hidden",
  },

  glow1: {
    position: "absolute",
    width: s(120),
    height: s(120),
    borderRadius: s(60),
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -20,
    right: -20,
  },

  glow2: {
    position: "absolute",
    width: s(90),
    height: s(90),
    borderRadius: s(45),
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: -20,
    left: -20,
  },

  heroTitle: {
    fontSize: ms(24),
    fontWeight: "900",
    color: "#fff",
  },

  heroSub: {
    marginTop: vs(8),
    color: "#DBEAFE",
    fontSize: ms(14),
    lineHeight: vs(22),
  },

  searchWrap: {
    marginTop: vs(16),
    backgroundColor: "#fff",
    borderRadius: s(18),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(14),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  searchInput: {
    flex: 1,
    paddingVertical: vs(14),
    marginLeft: s(8),
    color: "#0F172A",
    fontSize: ms(14),
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    marginTop: vs(14),
    backgroundColor: "#fff",
    borderRadius: s(22),
    padding: s(16),
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  subjectIcon: {
    width: s(44),
    height: s(44),
    borderRadius: s(14),
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  subjectName: {
    fontSize: ms(16),
    fontWeight: "900",
    color: "#0F172A",
  },

  subjectCode: {
    marginTop: vs(2),
    fontSize: ms(12),
    color: "#64748B",
    fontWeight: "700",
  },

  metaWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: vs(14),
  },

  badge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: s(12),
    marginRight: s(8),
    marginBottom: vs(8),
  },

  badgeText: {
    fontSize: ms(11),
    fontWeight: "800",
  },

  teacherText: {
    marginTop: vs(6),
    fontSize: ms(13),
    color: "#475569",
    fontWeight: "600",
  },

  emptyText: {
    marginTop: vs(50),
    textAlign: "center",
    color: "#94A3B8",
    fontSize: ms(14),
  },

  cardContent: {
    flex: 1,
  },

  actionRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    marginTop: vs(12),
    paddingTop: vs(12),
  },

  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(8),
    marginHorizontal: s(4),
    borderRadius: s(10),
    backgroundColor: "#EFF6FF",
  },

  deleteBtn: {
    backgroundColor: "#FEF2F2",
  },

  actionText: {
    marginLeft: s(6),
    fontSize: ms(13),
    fontWeight: "800",
    color: "#2563EB",
  },

  deleteText: {
    color: "#DC2626",
  },
});
