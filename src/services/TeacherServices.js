import { BASE_URL } from "../config/baseUrl";
import { apiRequest } from "./AdminServices";
const API_BASE_URL = `${BASE_URL}/api/v1`;
const TEACHER_API_URL = `${API_BASE_URL}/teachers`;

/**
 * Get assigned subjects for logged-in teacher
 */
export const GET_ASSIGNED_SUBJECTS = async () => {
  try {
    const data = await apiRequest(`${TEACHER_API_URL}/subjects`, {
      method: "GET",
    });

    return {
      success: true,
      data: data.data || [],
      message: "Assigned subjects fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch assigned subjects",
    };
  }
};

/**
 * Get teacher dashboard data
 */
export const GET_TEACHER_DASHBOARD = async () => {
  try {
    const data = await apiRequest(`${TEACHER_API_URL}/dashboard`, {
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
