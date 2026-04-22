import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs, ms } from "react-native-size-matters";

import { BULK_ADD_USERS } from "../../services/AdminServices";

const BulkAddUsers = ({ navigation }) => {
  const [fileInfo, setFileInfo] = useState(null);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const pickCsv = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "*/*"],
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;

      const asset = res.assets?.[0];

      if (!asset?.name?.toLowerCase().endsWith(".csv")) {
        Alert.alert("Invalid", "Please select CSV file.");
        return;
      }

      setFileInfo(asset);
    } catch (error) {
      Alert.alert("Error", "Unable to pick file.");
    }
  };

  const handleUpload = async () => {
    if (!fileInfo) {
      Alert.alert("Required", "Please select CSV file.");
      return;
    }

    try {
      setLoading(true);
      setProgress(30);

      const res = await BULK_ADD_USERS(fileInfo.uri);

      setProgress(100);

      if (res.success) {
        Alert.alert("Success", "Bulk import successful.");

        setFileInfo(null);
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);

      setTimeout(() => setProgress(0), 600);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Bulk Import</Text>

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

          <View style={styles.heroIcon}>
            <Ionicons name="cloud-upload-outline" size={34} color="#fff" />
          </View>

          <Text style={styles.heroTitle}>Import Records</Text>

          <Text style={styles.heroSub}>
            Upload CSV files for students and teachers in one tap.
          </Text>
        </View>

        {/* Upload Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Select CSV File</Text>

          <TouchableOpacity style={styles.dropZone} onPress={pickCsv}>
            <Ionicons name="document-text-outline" size={38} color="#2563EB" />

            <Text style={styles.dropTitle}>Tap to Choose File</Text>

            <Text style={styles.dropSub}>Only CSV format supported</Text>
          </TouchableOpacity>

          {fileInfo ? (
            <View style={styles.fileBox}>
              <Ionicons name="document-outline" size={18} color="#14B8A6" />

              <View
                style={{
                  marginLeft: s(8),
                  flex: 1,
                }}
              >
                <Text style={styles.fileName}>{fileInfo.name}</Text>

                <Text style={styles.fileSize}>
                  {Math.round((fileInfo.size || 0) / 1024)} KB
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noFile}>No file selected</Text>
          )}

          {/* Progress */}
          {progress > 0 && (
            <View style={styles.progressWrap}>
              <Text style={styles.progressText}>Uploading {progress}%</Text>

              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress}%`,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Upload Button */}
          <TouchableOpacity
            style={styles.uploadBtn}
            disabled={loading}
            onPress={handleUpload}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.uploadText}>Upload CSV</Text>

                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Templates */}
          <TouchableOpacity
            style={styles.templateBtn}
            onPress={() =>
              Alert.alert("Template", "Download Student CSV Template")
            }
          >
            <Ionicons name="download-outline" size={18} color="#2563EB" />

            <Text style={styles.templateText}>Student Template</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.templateBtn}
            onPress={() =>
              Alert.alert("Template", "Download Teacher CSV Template")
            }
          >
            <Ionicons name="download-outline" size={18} color="#2563EB" />

            <Text style={styles.templateText}>Teacher Template</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>CampusEase Admin Portal</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BulkAddUsers;

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    paddingHorizontal: s(18),
    paddingBottom: vs(30),
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

  headerTitle: {
    fontSize: ms(20),
    fontWeight: "900",
    color: "#0F172A",
  },

  heroCard: {
    marginTop: vs(18),
    backgroundColor: "#2563EB",
    borderRadius: s(26),
    padding: s(24),
    overflow: "hidden",
    alignItems: "center",
  },

  glow1: {
    position: "absolute",
    width: s(120),
    height: s(120),
    borderRadius: s(60),
    backgroundColor: "rgba(255,255,255,0.10)",
    top: -20,
    right: -20,
  },

  glow2: {
    position: "absolute",
    width: s(100),
    height: s(100),
    borderRadius: s(50),
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -20,
    left: -20,
  },

  heroIcon: {
    width: s(72),
    height: s(72),
    borderRadius: s(36),
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  heroTitle: {
    marginTop: vs(14),
    fontSize: ms(26),
    fontWeight: "900",
    color: "#fff",
  },

  heroSub: {
    marginTop: vs(8),
    fontSize: ms(14),
    color: "#DBEAFE",
    textAlign: "center",
  },

  card: {
    marginTop: vs(16),
    backgroundColor: "#fff",
    borderRadius: s(24),
    padding: s(18),
  },

  sectionTitle: {
    fontSize: ms(16),
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: vs(12),
  },

  dropZone: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#93C5FD",
    backgroundColor: "#EFF6FF",
    borderRadius: s(20),
    paddingVertical: vs(28),
    alignItems: "center",
  },

  dropTitle: {
    marginTop: vs(10),
    fontSize: ms(15),
    fontWeight: "900",
    color: "#0F172A",
  },

  dropSub: {
    marginTop: vs(4),
    color: "#64748B",
    fontSize: ms(13),
  },

  fileBox: {
    marginTop: vs(14),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: s(16),
    padding: s(12),
  },

  fileName: {
    fontSize: ms(14),
    fontWeight: "800",
    color: "#0F172A",
  },

  fileSize: {
    marginTop: vs(2),
    fontSize: ms(12),
    color: "#64748B",
  },

  noFile: {
    marginTop: vs(14),
    textAlign: "center",
    color: "#94A3B8",
    fontSize: ms(13),
  },

  progressWrap: {
    marginTop: vs(14),
  },

  progressText: {
    fontSize: ms(13),
    fontWeight: "700",
    color: "#334155",
    marginBottom: vs(6),
  },

  progressBg: {
    height: vs(8),
    backgroundColor: "#E2E8F0",
    borderRadius: s(6),
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#14B8A6",
  },

  uploadBtn: {
    marginTop: vs(16),
    backgroundColor: "#2563EB",
    borderRadius: s(18),
    paddingVertical: vs(16),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  uploadText: {
    color: "#fff",
    fontSize: ms(16),
    fontWeight: "900",
    marginRight: s(8),
  },

  templateBtn: {
    marginTop: vs(10),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: vs(14),
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  templateText: {
    marginLeft: s(8),
    color: "#2563EB",
    fontWeight: "800",
    fontSize: ms(14),
  },

  footer: {
    marginTop: vs(18),
    textAlign: "center",
    color: "#94A3B8",
    fontSize: ms(12),
  },
});
