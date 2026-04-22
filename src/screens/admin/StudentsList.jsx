import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ActivityIndicator,
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

import { GET_STUDENTS } from "../../services/AdminServices";

const StudentsList = ({ navigation }) => {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] = useState("");

  const [semesterFilter, setSemesterFilter] = useState("");

  const loadStudents = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await GET_STUDENTS();

      if (res.success) {
        const data = (res.data || []).map((item) => ({
          id: item._id,
          name: item.user?.fullName || "-",
          email: item.user?.email || "-",
          rollNo: item.rollNumber,
          department: item.department,
          semester: item.semester,
          branch: item.department,
          year: item.year,
        }));

        setStudents(data);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const onRefresh = useCallback(() => {
    loadStudents(true);
  }, []);

  const departments = useMemo(
    () => [...new Set(students.map((i) => i.department))],
    [students],
  );

  const semesters = useMemo(
    () => [...new Set(students.map((i) => String(i.semester)))],
    [students],
  );

  const filtered = useMemo(() => {
    return students.filter((item) => {
      const txt = [item.name, item.email, item.rollNo].join(" ").toLowerCase();

      const matchSearch = txt.includes(search.toLowerCase());

      const matchDept = departmentFilter
        ? item.department === departmentFilter
        : true;

      const matchSem = semesterFilter
        ? String(item.semester) === semesterFilter
        : true;

      return matchSearch && matchDept && matchSem;
    });
  }, [students, search, departmentFilter, semesterFilter]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("StudentDetail", {
          studentId: item.id,
        })
      }
    >
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name?.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            marginLeft: s(12),
          }}
        >
          <Text style={styles.name}>{item.name}</Text>

          <Text style={styles.email}>{item.email}</Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </View>

      <View style={styles.badgeRow}>
        <Badge text={`Sem ${item.semester}`} color="#8B5CF6" />

        <Badge text={item.department} color="#14B8A6" />

        <Badge text={`Roll ${item.rollNo}`} color="#2563EB" />
      </View>
    </TouchableOpacity>
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

          <Text style={styles.title}>Students</Text>

          <View
            style={{
              width: s(40),
            }}
          />
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Student Directory</Text>

          <Text style={styles.heroSub}>
            Manage enrolled students, details and academic info.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color="#94A3B8" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search name, email, roll..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
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

          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() =>
              setSemesterFilter(semesterFilter ? "" : semesters[0] || "")
            }
          >
            <Text style={styles.filterText}>
              {semesterFilter ? `Sem ${semesterFilter}` : "Semester"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: vs(30),
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No students found</Text>
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

export default StudentsList;

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

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: vs(12),
  },

  filterBtn: {
    width: "48%",
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
});
