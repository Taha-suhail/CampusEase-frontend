import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs, ms } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  GET_TEACHER_LEAVE_REQUESTS,
  APPROVE_LEAVE_REQUEST,
  REJECT_LEAVE_REQUEST,
} from "../../services/LeaveRequestService";

const getTypeColor = (type) => {
  switch (type) {
    case "Medical":
      return {
        bg: "#FEF2F2",
        color: "#DC2626",
        icon: "medkit-outline",
      };

    case "Personal":
      return {
        bg: "#ECFDF5",
        color: "#16A34A",
        icon: "person-outline",
      };

    case "Technical":
      return {
        bg: "#EFF6FF",
        color: "#2563EB",
        icon: "code-slash-outline",
      };

    case "Emergency":
      return {
        bg: "#FEF3C7",
        color: "#D97706",
        icon: "warning-outline",
      };

    default:
      return {
        bg: "#F8FAFC",
        color: "#64748B",
        icon: "document-text-outline",
      };
  }
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const LeaveRequests = ({ navigation }) => {
  const [tab, setTab] = useState("pending");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [requests, setRequests] = useState([]);

  const fetchData = async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);

      const res = await GET_TEACHER_LEAVE_REQUESTS({
        status: tab === "pending" ? "pending" : undefined,
      });

      if (res.success) {
        setRequests(res.data?.leaveRequests || []);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const onRefresh = useCallback(() => {
    fetchData(true);
  }, [tab]);

  const handleApprove = (id) => {
    Alert.alert("Approve Request", "Approve this leave request?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Approve",
        onPress: async () => {
          const res = await APPROVE_LEAVE_REQUEST(id);

          if (res.success) {
            fetchData();
          }
        },
      },
    ]);
  };

  const handleReject = (id) => {
    Alert.alert("Reject Request", "Reject this leave request?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Reject",
        style: "destructive",
        onPress: async () => {
          const res = await REJECT_LEAVE_REQUEST(id);

          if (res.success) {
            fetchData();
          }
        },
      },
    ]);
  };

  const filtered = useMemo(() => {
    return requests.filter((item) => {
      const name = item?.student?.fullName || item?.student?.name || "";

      return name.toLowerCase().includes(search.toLowerCase());
    });
  }, [requests, search]);

  const pendingCount = requests.filter((i) => i.status === "pending").length;

  const historyCount = requests.filter((i) => i.status !== "pending").length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.title}>Leave Requests</Text>

        <View
          style={{
            width: s(40),
          }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563EB"]}
          />
        }
      >
        {/* Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Manage Student Leaves</Text>

          <Text style={styles.heroSub}>
            Review pending approvals and track request history.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#94A3B8" />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by student..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === "pending" && styles.activeTab]}
            onPress={() => setTab("pending")}
          >
            <Text
              style={[
                styles.tabText,
                tab === "pending" && styles.activeTabText,
              ]}
            >
              Pending ({pendingCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, tab === "history" && styles.activeTab]}
            onPress={() => setTab("history")}
          >
            <Text
              style={[
                styles.tabText,
                tab === "history" && styles.activeTabText,
              ]}
            >
              History ({historyCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="folder-open-outline" size={60} color="#CBD5E1" />

            <Text style={styles.emptyTitle}>No Requests</Text>

            <Text style={styles.emptySub}>Nothing to show here.</Text>
          </View>
        ) : (
          filtered.map((req) => {
            const style = getTypeColor(req.type);

            const name =
              req?.student?.fullName || req?.student?.name || "Student";

            return (
              <View key={req._id} style={styles.card}>
                {/* top */}
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {name.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      marginLeft: s(12),
                    }}
                  >
                    <Text style={styles.studentName}>{name}</Text>

                    <Text style={styles.email}>
                      {req?.student?.email || "-"}
                    </Text>
                  </View>
                </View>

                {/* type */}
                <View style={styles.metaRow}>
                  <View
                    style={[
                      styles.typeBadge,
                      {
                        backgroundColor: style.bg,
                      },
                    ]}
                  >
                    <Ionicons name={style.icon} size={14} color={style.color} />

                    <Text
                      style={[
                        styles.typeText,
                        {
                          color: style.color,
                        },
                      ]}
                    >
                      {req.type}
                    </Text>
                  </View>

                  <Text style={styles.dateText}>
                    {formatDate(req.fromDate)} - {formatDate(req.toDate)}
                  </Text>
                </View>

                {/* subject */}
                <Text style={styles.subject}>
                  Subject: {req?.subject?.name || "-"}
                </Text>

                {/* reason */}
                <View style={styles.reasonBox}>
                  <Text style={styles.reasonLabel}>Reason</Text>

                  <Text style={styles.reasonText}>{req.reason}</Text>
                </View>

                {/* actions */}
                {req.status === "pending" ? (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.approveBtn}
                      onPress={() => handleApprove(req._id)}
                    >
                      <Text style={styles.btnText}>Approve</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.rejectBtn}
                      onPress={() => handleReject(req._id)}
                    >
                      <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.footerStatus,
                      {
                        color:
                          req.status === "approved" ? "#16A34A" : "#DC2626",
                      },
                    ]}
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </Text>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaveRequests;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    paddingHorizontal: s(18),
    paddingTop: vs(10),
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
    fontSize: ms(21),
    fontWeight: "900",
    color: "#0F172A",
  },

  container: {
    padding: s(18),
    paddingBottom: vs(30),
  },

  heroCard: {
    backgroundColor: "#2563EB",
    borderRadius: s(24),
    padding: s(22),
  },

  heroTitle: {
    fontSize: ms(22),
    fontWeight: "900",
    color: "#fff",
  },

  heroSub: {
    marginTop: vs(8),
    color: "#DBEAFE",
    lineHeight: vs(22),
  },

  searchRow: {
    marginTop: vs(16),
    backgroundColor: "#fff",
    borderRadius: s(16),
    paddingHorizontal: s(14),
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  searchInput: {
    flex: 1,
    marginLeft: s(8),
    paddingVertical: vs(14),
    fontSize: ms(14),
  },

  tabs: {
    marginTop: vs(14),
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: s(16),
    padding: s(4),
  },

  tabBtn: {
    flex: 1,
    paddingVertical: vs(12),
    borderRadius: s(12),
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#EFF6FF",
  },

  tabText: {
    fontWeight: "700",
    color: "#64748B",
  },

  activeTabText: {
    color: "#2563EB",
  },

  loader: {
    marginTop: vs(40),
  },

  emptyBox: {
    alignItems: "center",
    marginTop: vs(50),
  },

  emptyTitle: {
    marginTop: vs(14),
    fontSize: ms(18),
    fontWeight: "800",
  },

  emptySub: {
    color: "#94A3B8",
    marginTop: vs(4),
  },

  card: {
    marginTop: vs(14),
    backgroundColor: "#fff",
    borderRadius: s(20),
    padding: s(16),
  },

  cardTop: {
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
  },

  studentName: {
    fontSize: ms(15),
    fontWeight: "900",
    color: "#0F172A",
  },

  email: {
    fontSize: ms(12),
    color: "#64748B",
    marginTop: vs(2),
  },

  metaRow: {
    marginTop: vs(14),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: s(12),
  },

  typeText: {
    marginLeft: s(6),
    fontWeight: "800",
    fontSize: ms(12),
  },

  dateText: {
    fontSize: ms(11),
    color: "#64748B",
  },

  subject: {
    marginTop: vs(10),
    color: "#334155",
    fontWeight: "700",
  },

  reasonBox: {
    marginTop: vs(12),
    backgroundColor: "#F8FAFC",
    borderRadius: s(14),
    padding: s(12),
  },

  reasonLabel: {
    fontWeight: "800",
    color: "#64748B",
    fontSize: ms(12),
  },

  reasonText: {
    marginTop: vs(6),
    color: "#334155",
    lineHeight: vs(20),
  },

  actionRow: {
    flexDirection: "row",
    marginTop: vs(14),
    gap: s(10),
  },

  approveBtn: {
    flex: 1,
    backgroundColor: "#16A34A",
    paddingVertical: vs(12),
    borderRadius: s(14),
    alignItems: "center",
  },

  rejectBtn: {
    flex: 1,
    backgroundColor: "#DC2626",
    paddingVertical: vs(12),
    borderRadius: s(14),
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "900",
  },

  footerStatus: {
    marginTop: vs(14),
    fontWeight: "900",
    textAlign: "center",
  },
});
