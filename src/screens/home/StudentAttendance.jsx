import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { s, vs, ms } from "react-native-size-matters";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GET_ATTENDANCE_RECORDS } from "../../services/StudentService";

const StudentAttendance = () => {
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [records, setRecords] = useState([]);

  const [subjects, setSubjects] = useState([]);

  const [subject, setSubject] = useState("all");

  const [month, setMonth] = useState("all");

  const [selectedDate, setSelectedDate] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);

  /* ------------------- */
  /* Extract Unique Data */
  /* ------------------- */

  const extractFilters = (data) => {
    const uniqueSubjects = [];
    const uniqueMonths = new Set();

    data.forEach((item) => {
      if (item.code && !uniqueSubjects.find((s) => s.code === item.code)) {
        uniqueSubjects.push({ code: item.code, name: item.subject });
      }
      if (item.date) {
        const monthPart = item.date.split("-")[1];
        if (monthPart) uniqueMonths.add(monthPart);
      }
    });

    return { uniqueSubjects, uniqueMonths: Array.from(uniqueMonths).sort() };
  };

  useEffect(() => {
    if (records.length > 0) {
      const { uniqueSubjects, uniqueMonths } = extractFilters(records);
      setSubjects(uniqueSubjects);
    }
  }, [records]);

  /* ------------------- */
  /* Helpers */
  /* ------------------- */

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  /* ------------------- */
  /* Load Data */
  /* ------------------- */

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await GET_ATTENDANCE_RECORDS();

      if (res.success) {
        setRecords(res.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ------------------- */
  /* Filter Logic */
  /* ------------------- */

  const filtered = records.filter((item) => {
    const subjectMatch = subject === "all" || item.code === subject;

    const monthMatch = month === "all" || item.date.split("-")[1] === month;

    const dateMatch = selectedDate === "" || item.date === selectedDate;

    return subjectMatch && monthMatch && dateMatch;
  });

  const total = filtered.length;

  const present = filtered.filter((i) => i.status === "Present").length;

  const absent = total - present;

  const percent = total > 0 ? Math.round((present / total) * 100) : 0;

  /* ------------------- */
  /* UI */
  /* ------------------- */

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchData(true)}
            colors={["#2563EB"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.iconWrap}>
            <Ionicons name="bar-chart-outline" size={34} color="#fff" />
          </View>

          <Text style={styles.title}>Attendance Records</Text>

          <Text style={styles.subTitle}>
            Track your attendance with smart filters.
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard label="Present" value={present} color="#16A34A" />

          <StatCard label="Absent" value={absent} color="#DC2626" />

          <StatCard label="%" value={percent} color="#2563EB" />
        </View>

        {/* Filters */}
        <View style={styles.filterCard}>
          <Text style={styles.filterTitle}>Filters</Text>

          {/* Subject */}
          <View style={styles.pickerWrap}>
            <Picker selectedValue={subject} onValueChange={setSubject}>
              <Picker.Item label="All Subjects" value="all" />
              {subjects.map((item) => (
                <Picker.Item
                  key={item.code}
                  label={`${item.name} (${item.code})`}
                  value={item.code}
                />
              ))}
            </Picker>
          </View>

          {/* Month */}
          <View
            style={[
              styles.pickerWrap,
              {
                marginTop: vs(10),
              },
            ]}
          >
            <Picker selectedValue={month} onValueChange={setMonth}>
              <Picker.Item label="All Months" value="all" />
              <Picker.Item label="January" value="01" />
              <Picker.Item label="February" value="02" />
              <Picker.Item label="March" value="03" />
              <Picker.Item label="April" value="04" />
              <Picker.Item label="May" value="05" />
              <Picker.Item label="June" value="06" />
              <Picker.Item label="July" value="07" />
              <Picker.Item label="August" value="08" />
              <Picker.Item label="September" value="09" />
              <Picker.Item label="October" value="10" />
              <Picker.Item label="November" value="11" />
              <Picker.Item label="December" value="12" />
            </Picker>
          </View>

          {/* Exact Date */}
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={18} color="#2563EB" />

            <Text style={styles.dateText}>
              {selectedDate || "Select Exact Date"}
            </Text>
          </TouchableOpacity>

          {/* Reset */}
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setSubject("all");
              setMonth("all");
              setSelectedDate("");
            }}
          >
            <Text style={styles.resetText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <Text style={styles.sectionTitle}>Records</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={{
              marginTop: vs(30),
            }}
          />
        ) : filtered.length === 0 ? (
          <Text style={styles.emptyText}>No attendance records found.</Text>
        ) : (
          filtered.map((item) => (
            <View key={item._id} style={styles.recordCard}>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text style={styles.subjectName}>{item.subject}</Text>

                <Text style={styles.recordDate}>
                  {item.date} • {item.code}
                </Text>
              </View>

              <View
                style={[
                  styles.badge,
                  item.status === "Present"
                    ? styles.presentBadge
                    : styles.absentBadge,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: item.status === "Present" ? "#166534" : "#991B1B",
                    },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Calendar */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={(date) => {
          setSelectedDate(formatDate(date));
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </SafeAreaView>
  );
};

export default StudentAttendance;

/* ------------------- */
/* Stat Card */
/* ------------------- */

const StatCard = ({ label, value, color }) => (
  <View style={styles.statCard}>
    <Text
      style={[
        styles.statValue,
        {
          color,
        },
      ]}
    >
      {value}
    </Text>

    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

/* ------------------- */
/* Styles */
/* ------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    padding: s(16),
    paddingBottom: vs(30),
  },

  heroCard: {
    backgroundColor: "#2563EB",
    borderRadius: s(24),
    padding: s(22),
    alignItems: "center",
  },

  iconWrap: {
    width: s(72),
    height: s(72),
    borderRadius: s(36),
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
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
    textAlign: "center",
    fontSize: ms(14),
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: vs(16),
  },

  statCard: {
    width: "31%",
    backgroundColor: "#fff",
    borderRadius: s(18),
    padding: s(16),
    alignItems: "center",
  },

  statValue: {
    fontSize: ms(22),
    fontWeight: "900",
  },

  statLabel: {
    marginTop: vs(4),
    color: "#64748B",
    fontSize: ms(13),
  },

  filterCard: {
    marginTop: vs(16),
    backgroundColor: "#fff",
    borderRadius: s(22),
    padding: s(16),
  },

  filterTitle: {
    fontSize: ms(15),
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: vs(10),
  },

  pickerWrap: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: s(16),
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
  },

  dateBtn: {
    marginTop: vs(10),
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: s(16),
    paddingVertical: vs(14),
    paddingHorizontal: s(14),
    flexDirection: "row",
    alignItems: "center",
  },

  dateText: {
    marginLeft: s(8),
    fontSize: ms(14),
    fontWeight: "700",
    color: "#0F172A",
  },

  resetBtn: {
    marginTop: vs(10),
    backgroundColor: "#EFF6FF",
    borderRadius: s(14),
    paddingVertical: vs(12),
    alignItems: "center",
  },

  resetText: {
    color: "#2563EB",
    fontWeight: "800",
    fontSize: ms(13),
  },

  sectionTitle: {
    marginTop: vs(18),
    marginBottom: vs(10),
    fontSize: ms(14),
    fontWeight: "900",
    color: "#64748B",
  },

  recordCard: {
    backgroundColor: "#fff",
    borderRadius: s(18),
    padding: s(16),
    marginBottom: vs(10),
    flexDirection: "row",
    alignItems: "center",
  },

  subjectName: {
    fontSize: ms(15),
    fontWeight: "800",
    color: "#0F172A",
  },

  recordDate: {
    marginTop: vs(4),
    fontSize: ms(13),
    color: "#64748B",
  },

  badge: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: s(12),
  },

  presentBadge: {
    backgroundColor: "#DCFCE7",
  },

  absentBadge: {
    backgroundColor: "#FEE2E2",
  },

  badgeText: {
    fontSize: ms(12),
    fontWeight: "800",
  },

  emptyText: {
    textAlign: "center",
    color: "#64748B",
    marginTop: vs(30),
  },
});
