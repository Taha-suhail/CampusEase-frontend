import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "./AdminServices";
import { BASE_URL } from "../config/baseUrl";
const API_BASE_URL = `${BASE_URL}/api/v1`;
const Student_API_URL = `${API_BASE_URL}/students/`;

// ✅ Get Dashboard Data
export const GET_STUDENT_DASHBOARD = async () => {
  return await apiRequest(`${Student_API_URL}dashboard`, {
    method: "GET",
  });
};

// ✅ Enroll in Subject
export const ENROLL_SUBJECT = async (subjectId) => {
  return await apiRequest(`${Student_API_URL}enroll`, {
    method: "POST",
    body: JSON.stringify({ subjectId }),
  });
};

// ✅ Mark Attendance via QR Code
export const MARK_ATTENDANCE = async (sessionCode, subjectId) => {
  try {
    const data = await apiRequest(`${Student_API_URL}mark-attendance`, {
      method: "POST",
      body: JSON.stringify({
        sessionCode,
        subjectId,
      }),
    });

    return {
      success: data.success || false,
      message: data.message || "Attendance marked successfully",
      data: data.data || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to mark attendance",
    };
  }
};

// ✅ Get Own Attendance Records
export const GET_ATTENDANCE_RECORDS = async () => {
  try {
    const data = await apiRequest(`${Student_API_URL}my-attendance`, {
      method: "GET",
    });

    return {
      success: true,
      data: data.data || [],
      message: "Attendance records fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch attendance records",
      data: [],
    };
  }
};

// ✅ Get My Student Details
export const GET_MY_STUDENT_DETAILS = async () => {
  try {
    const data = await apiRequest(`${Student_API_URL}me`, {
      method: "GET",
    });

    return {
      success: true,
      data: data.data || null,
      message: "Student details fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch student details",
      data: null,
    };
  }
};
