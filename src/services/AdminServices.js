import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/baseUrl";
const API_BASE_URL = `${BASE_URL}/api/v1`;
const ADMIN_API_URL = `${API_BASE_URL}/admin`;

export const sessionExpiredEmitter = {
  listeners: [],
  subscribe(listener) {
    this.listeners.push(listener);
    const unsubscribe = () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
    return { remove: unsubscribe };
  },
  emit() {
    this.listeners.forEach((listener) => listener());
  },
};

let isRefreshing = false;

/**
 * Generic API request handler with automatic token refresh
 * Handles 401 responses by refreshing tokens and retrying
 */
export const apiRequest = async (url, options = {}) => {
  let accessToken = await AsyncStorage.getItem("accessToken");

  const makeRequest = async () => {
    return fetch(`${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
    });
  };

  let response = await makeRequest();

  // 🔴 If access token expired (401) and not already refreshing
  if (response.status === 401 && !isRefreshing) {
    isRefreshing = true;

    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      // Refresh token request
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const refreshData = await refreshRes.json();

      if (!refreshRes.ok) {
        throw new Error("Session expired");
      }

      // ✅ Save new tokens
      await AsyncStorage.setItem("accessToken", refreshData.data.accessToken);
      await AsyncStorage.setItem("refreshToken", refreshData.data.refreshToken);

      accessToken = refreshData.data.accessToken;

      // 🔁 Retry original request with new token
      response = await makeRequest();
    } catch (err) {
      // ❌ Logout user - clear all storage
      await AsyncStorage.multiRemove([
        "accessToken",
        "refreshToken",
        "userRole",
        "campusease:isSignedUp",
      ]);
      sessionExpiredEmitter.emit();
      const error = new Error("Session expired. Please login again.");
      error.code = "SESSION_EXPIRED";
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

/**
 * Add a new student to the system
 * @param {Object} studentData - Student information
 * @returns {Object} - Response object with success status
 */
export const ADD_STUDENT = async (studentData) => {
  try {
    const data = await apiRequest(`${ADMIN_API_URL}/allowed-users`, {
      method: "POST",
      body: JSON.stringify({
        ...studentData,
        role: "student",
      }),
    });

    return {
      success: true,
      data,
      message: data.message || "Student added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to add student",
    };
  }
};

/**
 * Add a new teacher to the system
 * @param {Object} teacherData - Teacher information
 * @returns {Object} - Response object with success status
 */
export const BULK_ADD_USERS = async (csvUri) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: csvUri,
      name: "bulk_users.csv",
      type: "text/csv",
    });

    const data = await apiRequest(
      `http://192.168.29.74:3000/api/v1/admin/allowed-users/bulk`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return {
      success: true,
      data,
      message: data.message || "Bulk user upload successful",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Bulk upload failed",
    };
  }
};

export const ADD_TEACHER = async (teacherData) => {
  try {
    const data = await apiRequest(`${ADMIN_API_URL}/allowed-users`, {
      method: "POST",
      body: JSON.stringify({
        ...teacherData,
        role: "teacher",
      }),
    });

    return {
      success: true,
      data,
      message: data.message || "Teacher added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to add teacher",
    };
  }
};

/**
 * Create a new subject
 * @param {Object} subjectData - Subject information
 * @returns {Object} - Response object with success status
 */
export const CREATE_SUBJECT = async (subjectData) => {
  try {
    const data = await apiRequest(`${ADMIN_API_URL}/subjects`, {
      method: "POST",
      body: JSON.stringify(subjectData),
    });

    return {
      success: true,
      data,
      message: data.message || "Subject created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to create subject",
    };
  }
};

/**
 * Get admin dashboard data
 * @returns {Object} - Response object with dashboard stats
 */
export const GET_ADMIN_DASHBOARD = async () => {
  try {
    const data = await apiRequest(`${ADMIN_API_URL}/dashboard`, {
      method: "GET",
    });

    return {
      success: true,
      data: data.data || {},
      message: "Dashboard data fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch dashboard data",
    };
  }
};

/**
 * Get list of teachers
 * @returns {Object} - Response object with teachers list
 */
export const GET_TEACHERS = async () => {
  try {
    const data = await apiRequest(`${ADMIN_API_URL}/teachers`, {
      method: "GET",
    });

    return {
      success: true,
      data: data.data || [],
      message: "Teachers fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch teachers",
    };
  }
};

/**
 * Get list of subjects
 * @returns {Object} - Response object with subjects list
 */
export const GET_SUBJECTS = async () => {
  try {
    const data = await apiRequest(`${ADMIN_API_URL}/subjects`, {
      method: "GET",
    });

    return {
      success: true,
      data: data.data || [],
      message: "Subjects fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch subjects",
    };
  }
};

export const GET_STUDENTS = async (query = {}) => {
  try {
    const queryString = Object.keys(query).length
      ? `?${new URLSearchParams(query).toString()}`
      : "";
    const data = await apiRequest(`${ADMIN_API_URL}/students${queryString}`, {
      method: "GET",
    });

    return {
      success: true,
      data: data.data || [],
      message: "Students fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch students",
    };
  }
};

export const GET_STUDENT_BY_ID = async (studentId) => {
  try {
    const data = await apiRequest(`${ADMIN_API_URL}/students/${studentId}`, {
      method: "GET",
    });

    return {
      success: true,
      data: data.data || null,
      message: "Student fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch student",
    };
  }
};

export const GET_TEACHER_BY_ID = async (teacherId) => {
  try {
    const data = await apiRequest(`${ADMIN_API_URL}/teachers/${teacherId}`, {
      method: "GET",
    });

    return {
      success: true,
      data: data.data || null,
      message: "Teacher fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch teacher",
    };
  }
};

/**
 * Assign subject to teacher
 * @param {Object} assignmentData - Assignment information
 * @returns {Object} - Response object with success status
 */
export const ASSIGN_SUBJECT_TO_TEACHER = async (assignmentData) => {
  try {
    const data = await apiRequest(`${ADMIN_API_URL}/assign-subject`, {
      method: "POST",
      body: JSON.stringify(assignmentData),
    });

    return {
      success: true,
      data,
      message: data.message || "Subject assigned successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to assign subject",
    };
  }
};
