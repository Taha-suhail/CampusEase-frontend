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
