import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs, ms } from "react-native-size-matters";

import { GET_ASSIGNED_SUBJECTS } from "../../services/TeacherServices";

const AssignedSubjects = ({ navigation }) => {
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const loadSubjects = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await GET_ASSIGNED_SUBJECTS();

      if (res.success) {
        setSubjects(res.data || []);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const onRefresh = useCallback(() => {
    loadSubjects(true);
  }, []);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((item) => {
      const text = [item.name, item.code, item.department]
        .join(" ")
        .toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [subjects, search]);

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      {/* Top */}
      <View style={styles.cardTop}>
        <View style={styles.iconBox}>
          <Ionicons name="book-outline" size={22} color="#2563EB" />
        </View>

        <View
          style={{
            flex: 1,
            marginLeft: s(12),
          }}
        >
          <Text style={styles.subjectName}>{item.name}</Text>

          <Text style={styles.subjectDept}>
            {item.department || "No Department"}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </View>

      {/* Code */}
      <Text style={styles.subjectCode}>
        {item.code ? `Code: ${item.code}` : "No Code"}
      </Text>

      {/* Badges */}
      <View style={styles.badgeRow}>
        <Badge
          text={item.semester ? `Semester ${item.semester}` : "Semester N/A"}
          color="#8B5CF6"
        />

        <Badge text="Assigned" color="#16A34A" />
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

          <Text style={styles.title}>My Subjects</Text>

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

          <Text style={styles.heroTitle}>Assigned Subjects</Text>

          <Text style={styles.heroSub}>
            Manage all your courses, semesters and teaching load.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color="#94A3B8" />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search subjects..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
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
            keyExtractor={(item) => String(item._id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: vs(30),
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No assigned subjects found.</Text>
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

export default AssignedSubjects;

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
    borderRadius: s(26),
    padding: s(22),
    overflow: "hidden",
  },

  glow1: {
    position: "absolute",
    top: -20,
    right: -20,
    width: s(110),
    height: s(110),
    borderRadius: s(55),
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  glow2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: s(90),
    height: s(90),
    borderRadius: s(45),
    backgroundColor: "rgba(255,255,255,0.07)",
  },

  heroTitle: {
    fontSize: ms(24),
    fontWeight: "900",
    color: "#fff",
  },

  heroSub: {
    marginTop: vs(8),
    fontSize: ms(14),
    color: "#DBEAFE",
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

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: s(46),
    height: s(46),
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

  subjectDept: {
    marginTop: vs(2),
    fontSize: ms(12),
    color: "#64748B",
  },

  subjectCode: {
    marginTop: vs(10),
    fontSize: ms(13),
    color: "#475569",
    fontWeight: "600",
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: vs(12),
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
    textAlign: "center",
    marginTop: vs(50),
    color: "#94A3B8",
    fontSize: ms(14),
  },
});
