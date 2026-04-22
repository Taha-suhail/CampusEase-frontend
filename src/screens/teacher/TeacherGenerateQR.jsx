import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, vs, ms } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import QRCode from "react-native-qrcode-svg";
import { Picker } from "@react-native-picker/picker";

/**
 * Replace APIs:
 * GET_TEACHER_SUBJECTS()
 * CREATE_ATTENDANCE_SESSION()
 * TERMINATE_SESSION()
 */

const TeacherGenerateQR = () => {
  const [subjects, setSubjects] = useState([]);

  const [subjectId, setSubjectId] = useState("");

  const [duration, setDuration] = useState(5); // minutes

  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  const [session, setSession] = useState(null);

  const [secondsLeft, setSecondsLeft] = useState(0);

  /* ---------------------- */
  /* Load Subjects */
  /* ---------------------- */

  const fetchSubjects = async () => {
    try {
      setLoading(true);

      // Replace with API
      const res = {
        success: true,
        data: [
          {
            _id: "1",
            name: "Operating System",
            code: "BCS544",
          },
          {
            _id: "2",
            name: "Big Data",
            code: "BCS333",
          },
        ],
      };

      if (res.success) {
        setSubjects(res.data);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  /* ---------------------- */
  /* Countdown */
  /* ---------------------- */

  useEffect(() => {
    let timer;

    if (secondsLeft > 0) {
      timer = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
    }

    if (secondsLeft === 0 && session) {
      handleTerminate(true);
    }

    return () => clearTimeout(timer);
  }, [secondsLeft, session]);

  /* ---------------------- */
  /* Generate Session */
  /* ---------------------- */

  const handleGenerate = async () => {
    if (!subjectId) {
      Alert.alert("Select Subject", "Please select subject first.");
      return;
    }

    try {
      setCreating(true);

      const selected = subjects.find((s) => s._id === subjectId);

      const token = "SESSION_" + Date.now();

      const payload = JSON.stringify({
        token,
        subjectId,
        duration,
        createdAt: new Date(),
      });

      setSession({
        token,
        payload,
        subject: selected,
        startedAt: new Date(),
      });

      setSecondsLeft(duration * 60);
    } catch (error) {
      Alert.alert("Error", "Could not create session");
    } finally {
      setCreating(false);
    }
  };

  /* ---------------------- */
  /* Terminate */
  /* ---------------------- */

  const handleTerminate = async (auto = false) => {
    try {
      // await TERMINATE_SESSION(session.token)

      setSession(null);
      setSecondsLeft(0);

      if (!auto) {
        Alert.alert("Ended", "Attendance session terminated.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not terminate session");
    }
  };

  /* ---------------------- */
  /* Helpers */
  /* ---------------------- */

  const selectedSubject = subjects.find((item) => item._id === subjectId);

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const rem = sec % 60;

    return `${min}:${rem.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="qr-code-outline" size={38} color="#fff" />
          </View>

          <Text style={styles.title}>Attendance Session</Text>

          <Text style={styles.subtitle}>
            Generate live QR code. Choose duration and manage attendance session
            in real-time.
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.card}>
          <Text style={styles.label}>Select Subject</Text>

          <View style={styles.pickerWrap}>
            <Picker selectedValue={subjectId} onValueChange={setSubjectId}>
              <Picker.Item label="Choose Subject" value="" />

              {subjects.map((item) => (
                <Picker.Item
                  key={item._id}
                  label={`${item.name} (${item.code})`}
                  value={item._id}
                />
              ))}
            </Picker>
          </View>

          <Text
            style={[
              styles.label,
              {
                marginTop: vs(14),
              },
            ]}
          >
            Session Time
          </Text>

          <View style={styles.pickerWrap}>
            <Picker selectedValue={duration} onValueChange={setDuration}>
              <Picker.Item label="2 Minutes" value={2} />
              <Picker.Item label="5 Minutes" value={5} />
              <Picker.Item label="10 Minutes" value={10} />
              <Picker.Item label="15 Minutes" value={15} />
            </Picker>
          </View>

          {!session ? (
            <TouchableOpacity
              style={styles.button}
              onPress={handleGenerate}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Start Session</Text>

                  <Ionicons name="play" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.endBtn}
              onPress={() => handleTerminate(false)}
            >
              <Text style={styles.buttonText}>End Session</Text>

              <Ionicons name="stop" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* QR Session */}
        {session && (
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Live QR Attendance</Text>

            <Text style={styles.subjectName}>{session.subject.name}</Text>

            <Text style={styles.timer}>Ends in {formatTime(secondsLeft)}</Text>

            <View style={styles.qrBox}>
              <QRCode value={session.payload} size={220} />
            </View>

            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />

              <Text style={styles.liveText}>Session Active</Text>
            </View>
          </View>
        )}

        {loading && (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={{
              marginTop: vs(30),
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TeacherGenerateQR;

/* ---------------------- */
/* Styles */
/* ---------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    paddingHorizontal: s(18),
    paddingBottom: vs(30),
  },

  heroCard: {
    marginTop: vs(12),
    backgroundColor: "#fff",
    borderRadius: s(26),
    padding: s(24),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  iconCircle: {
    width: s(84),
    height: s(84),
    borderRadius: s(42),
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginTop: vs(16),
    fontSize: ms(24),
    fontWeight: "900",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: vs(10),
    textAlign: "center",
    color: "#64748B",
    fontSize: ms(14),
    lineHeight: vs(22),
  },

  card: {
    marginTop: vs(16),
    backgroundColor: "#fff",
    borderRadius: s(24),
    padding: s(20),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  label: {
    fontSize: ms(14),
    fontWeight: "800",
    color: "#334155",
    marginBottom: vs(8),
  },

  pickerWrap: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: s(16),
    overflow: "hidden",
  },

  button: {
    marginTop: vs(20),
    backgroundColor: "#16A34A",
    borderRadius: s(18),
    paddingVertical: vs(16),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  endBtn: {
    marginTop: vs(20),
    backgroundColor: "#DC2626",
    borderRadius: s(18),
    paddingVertical: vs(16),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: "#fff",
    fontSize: ms(16),
    fontWeight: "800",
    marginRight: s(8),
  },

  qrCard: {
    marginTop: vs(18),
    backgroundColor: "#fff",
    borderRadius: s(26),
    padding: s(22),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  qrTitle: {
    fontSize: ms(20),
    fontWeight: "900",
    color: "#0F172A",
  },

  subjectName: {
    marginTop: vs(8),
    fontSize: ms(14),
    color: "#64748B",
    fontWeight: "700",
  },

  timer: {
    marginTop: vs(8),
    fontSize: ms(15),
    color: "#DC2626",
    fontWeight: "900",
  },

  qrBox: {
    marginTop: vs(18),
    backgroundColor: "#fff",
    padding: s(18),
    borderRadius: s(18),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  liveBadge: {
    marginTop: vs(16),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    borderRadius: s(14),
  },

  liveDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: "#16A34A",
  },

  liveText: {
    marginLeft: s(8),
    color: "#166534",
    fontWeight: "800",
    fontSize: ms(13),
  },
});
