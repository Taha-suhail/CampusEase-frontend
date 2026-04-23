import React, {
  useState,
  useEffect,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import {
  s,
  vs,
  ms,
} from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { MARK_ATTENDANCE } from "../../services/StudentService";

const StudentScanQR = () => {
  const [
    permission,
    requestPermission,
  ] =
    useCameraPermissions();

  const [scanned, setScanned] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(null);

  useEffect(() => {
    if (
      !permission
    ) {
      requestPermission();
    }
  }, []);

  /* ---------------------- */
  /* Handle Scan */
  /* ---------------------- */

  const handleScan =
    async ({
      data,
    }) => {
      if (
        scanned ||
        loading
      )
        return;

      try {
        setScanned(
          true
        );
        setLoading(
          true
        );

        const parsed =
          JSON.parse(
            data
          );

        const res = await MARK_ATTENDANCE(parsed.token, parsed.subjectId);

        if (
          res.success
        ) {
          setSuccess({
            title:
              "Attendance Marked",
            message:
              res.message,
          });
        } else {
          setSuccess({
            title:
              "Failed",
            message:
              res.message,
          });
        }
      } catch (error) {
        Alert.alert(
          "Invalid QR",
          "Unable to read attendance session."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  const scanAgain =
    () => {
      setScanned(
        false
      );
      setSuccess(
        null
      );
    };

  /* ---------------------- */
  /* Permission States */
  /* ---------------------- */

  if (
    !permission
  ) {
    return (
      <View
        style={
          styles.loaderWrap
        }
      >
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />
      </View>
    );
  }

  if (
    !permission.granted
  ) {
    return (
      <SafeAreaView
        style={
          styles.safeArea
        }
      >
        <View
          style={
            styles.permissionCard
          }
        >
          <Ionicons
            name="camera-outline"
            size={50}
            color="#2563EB"
          />

          <Text
            style={
              styles.permissionTitle
            }
          >
            Camera Access Required
          </Text>

          <Text
            style={
              styles.permissionText
            }
          >
            Please allow camera
            permission to scan QR
            attendance codes.
          </Text>

          <TouchableOpacity
            style={
              styles.button
            }
            onPress={
              requestPermission
            }
          >
            <Text
              style={
                styles.buttonText
              }
            >
              Grant Permission
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* ---------------------- */
  /* Main UI */
  /* ---------------------- */

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      {!success ? (
        <>
          {/* Header */}
          <View
            style={
              styles.header
            }
          >
            <View
              style={
                styles.iconCircle
              }
            >
              <Ionicons
                name="scan-outline"
                size={36}
                color="#fff"
              />
            </View>

            <Text
              style={
                styles.title
              }
            >
              Scan Attendance QR
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Point your camera at
              teacher's QR code to
              mark attendance.
            </Text>
          </View>

          {/* Camera */}
          <View
            style={
              styles.cameraWrap
            }
          >
            <CameraView
              style={
                styles.camera
              }
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes:
                  [
                    "qr",
                  ],
              }}
              onBarcodeScanned={
                scanned
                  ? undefined
                  : handleScan
              }
            />

            {/* Overlay */}
            <View
              style={
                styles.overlayBox
              }
            />
          </View>

          {/* Bottom */}
          <View
            style={
              styles.bottomCard
            }
          >
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#2563EB"
              />
            ) : (
              <>
                <Text
                  style={
                    styles.tip
                  }
                >
                  Hold phone steady
                  for best scanning
                  result.
                </Text>

                <View
                  style={
                    styles.liveBadge
                  }
                >
                  <View
                    style={
                      styles.liveDot
                    }
                  />

                  <Text
                    style={
                      styles.liveText
                    }
                  >
                    Scanner Ready
                  </Text>
                </View>
              </>
            )}
          </View>
        </>
      ) : (
        /* Success */
        <View
          style={
            styles.successWrap
          }
        >
          <View
            style={
              styles.successCircle
            }
          >
            <Ionicons
              name="checkmark"
              size={50}
              color="#fff"
            />
          </View>

          <Text
            style={
              styles.successTitle
            }
          >
            {
              success.title
            }
          </Text>

          <Text
            style={
              styles.successText
            }
          >
            {
              success.message
            }
          </Text>

          <TouchableOpacity
            style={
              styles.button
            }
            onPress={
              scanAgain
            }
          >
            <Text
              style={
                styles.buttonText
              }
            >
              Scan Again
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default StudentScanQR;

/* ---------------------- */
/* Styles */
/* ---------------------- */

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        "#F8FAFC",
    },

    loaderWrap: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
      backgroundColor:
        "#F8FAFC",
    },

    header: {
      paddingHorizontal:
        s(20),
      paddingTop:
        vs(10),
      alignItems:
        "center",
    },

    iconCircle: {
      width: s(80),
      height: s(80),
      borderRadius:
        s(40),
      backgroundColor:
        "#2563EB",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    title: {
      marginTop: vs(14),
      fontSize: ms(24),
      fontWeight: "900",
      color: "#0F172A",
    },

    subtitle: {
      marginTop: vs(8),
      textAlign:
        "center",
      fontSize: ms(14),
      color: "#64748B",
      lineHeight:
        vs(22),
    },

    cameraWrap: {
      flex: 1,
      marginHorizontal:
        s(20),
      marginTop: vs(18),
      borderRadius:
        s(24),
      overflow:
        "hidden",
      borderWidth: 1,
      borderColor:
        "#E2E8F0",
    },

    camera: {
      flex: 1,
    },

    overlayBox: {
      position:
        "absolute",
      top: "28%",
      left: "18%",
      width: "64%",
      height: "30%",
      borderWidth: 3,
      borderColor:
        "#fff",
      borderRadius:
        s(20),
    },

    bottomCard: {
      padding: s(20),
      alignItems:
        "center",
    },

    tip: {
      fontSize: ms(14),
      color: "#64748B",
      textAlign:
        "center",
    },

    liveBadge: {
      marginTop: vs(12),
      flexDirection:
        "row",
      alignItems:
        "center",
      backgroundColor:
        "#DCFCE7",
      paddingHorizontal:
        s(12),
      paddingVertical:
        vs(8),
      borderRadius:
        s(14),
    },

    liveDot: {
      width: s(8),
      height: s(8),
      borderRadius:
        s(4),
      backgroundColor:
        "#16A34A",
    },

    liveText: {
      marginLeft: s(8),
      color: "#166534",
      fontWeight: "800",
      fontSize: ms(13),
    },

    successWrap: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
      paddingHorizontal:
        s(24),
    },

    successCircle: {
      width: s(110),
      height: s(110),
      borderRadius:
        s(55),
      backgroundColor:
        "#16A34A",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    successTitle: {
      marginTop: vs(22),
      fontSize: ms(26),
      fontWeight: "900",
      color: "#0F172A",
    },

    successText: {
      marginTop: vs(10),
      fontSize: ms(15),
      color: "#64748B",
      textAlign:
        "center",
      lineHeight:
        vs(22),
    },

    permissionCard: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
      paddingHorizontal:
        s(24),
    },

    permissionTitle: {
      marginTop: vs(18),
      fontSize: ms(22),
      fontWeight: "900",
      color: "#0F172A",
    },

    permissionText: {
      marginTop: vs(10),
      fontSize: ms(14),
      color: "#64748B",
      textAlign:
        "center",
      lineHeight:
        vs(22),
    },

    button: {
      marginTop: vs(24),
      backgroundColor:
        "#2563EB",
      borderRadius:
        s(18),
      paddingVertical:
        vs(16),
      paddingHorizontal:
        s(28),
      flexDirection:
        "row",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    buttonText: {
      color: "#fff",
      fontSize: ms(15),
      fontWeight: "800",
    },
  });