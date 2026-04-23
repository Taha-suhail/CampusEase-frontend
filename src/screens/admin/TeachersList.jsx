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

import { GET_TEACHERS, DELETE_TEACHER } from "../../services/AdminServices";

const TeachersList = ({ navigation }) => {
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const loadTeachers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await GET_TEACHERS();

      if (res.success) {
        setTeachers(res.data || []);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (teacherId) => {
    Alert.alert(
      "Delete Teacher",
      "Are you sure you want to delete this teacher?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(teacherId);
            const res = await DELETE_TEACHER(teacherId);
            setDeletingId(null);
            if (res.success) {
              Alert.alert("Success", "Teacher deleted successfully");
              loadTeachers();
            } else {
              Alert.alert("Error", res.message);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (item) => {
    navigation.navigate("EditTeacher", { teacher: item });
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const onRefresh = useCallback(() => {
    loadTeachers(true);
  }, []);

  const departments = useMemo(
    () => [...new Set(teachers.map((i) => i.department))],
    [teachers],
  );

  const filtered = useMemo(() => {
    return teachers.filter((item) => {
      const txt = [item.teacher?.fullName, item.teacher?.email, item.employeeId]
        .join(" ")
        .toLowerCase();

      const matchSearch = txt.includes(search.toLowerCase());

      const matchDept = departmentFilter
        ? item.department === departmentFilter
        : true;

      return matchSearch && matchDept;
    });
  }, [teachers, search, departmentFilter]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("TeacherDetail", {
            teacherId: item._id,
          })
        }
      >
        <View style={styles.topRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.teacher?.fullName?.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              marginLeft: s(12),
            }}
          >
            <Text style={styles.name}>{item.teacher?.fullName || "Teacher"}</Text>

            <Text style={styles.email}>{item.teacher?.email || "-"}</Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </View>

        <View style={styles.badgeRow}>
          <Badge text={item.department} color="#14B8A6" />

          <Badge
            text={item.employeeId ? `ID ${item.employeeId}` : "No ID"}
            color="#2563EB"
          />

          <Badge text={item.designation || "Teacher"} color="#8B5CF6" />
        </View>
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

          <Text style={styles.title}>Teachers</Text>

          <View
            style={{
              width: s(40),
            }}
          />
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Faculty Directory</Text>

          <Text style={styles.heroSub}>
            View teachers, departments and employee records.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color="#94A3B8" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search teacher, email, ID..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter */}
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() =>
            setDepartmentFilter(departmentFilter ? "" : departments[0] || "")
          }
        >
          <Text style={styles.filterText}>
            {departmentFilter || "Department"}
          </Text>
        </TouchableOpacity>

        {/* List */}
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: vs(30),
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No teachers found</Text>
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

export default TeachersList;

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
    fontSize: ms(14),
    color: "#0F172A",
  },

  filterBtn: {
    marginTop: vs(12),
    backgroundColor: "#fff",
    borderRadius: s(16),
    paddingVertical: vs(14),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  filterText: {
    fontSize: ms(13),
    fontWeight: "800",
    color: "#0F172A",
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

  avatar: {
    width: s(46),
    height: s(46),
    borderRadius: s(23),
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: ms(18),
  },

  name: {
    fontSize: ms(16),
    fontWeight: "900",
    color: "#0F172A",
  },

  email: {
    marginTop: vs(2),
    fontSize: ms(12),
    color: "#64748B",
  },

  badgeRow: {
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
