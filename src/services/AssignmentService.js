import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/baseUrl";

const parseResponse = async (response, defaultMessage) => {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error("Failed to parse server response");
  }
  if (!response.ok) {
    throw new Error(data?.message || defaultMessage);
  }
  return data;
};

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) throw new Error("Access token is required");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ============ ASSIGNMENT APIs ============

// Teacher: Create assignment
export const CREATE_ASSIGNMENT = async (assignmentData) => {
  const headers = await getAuthHeader();
  const response = await fetch(`${BASE_URL}/api/v1/assignments`, {
    method: "POST",
    headers,
    body: JSON.stringify(assignmentData),
  });
  return parseResponse(response, "Unable to create assignment.");
};

// Teacher: Get all assignments (for teacher)
export const GET_TEACHER_ASSIGNMENTS = async (options = {}) => {
  const { courseId } = options;
  const headers = await getAuthHeader();
  const queryParams = new URLSearchParams();
  if (courseId) queryParams.append("courseId", courseId);

  const response = await fetch(
    `${BASE_URL}/api/v1/assignments?${queryParams.toString()}`,
    {
      method: "GET",
      headers,
    }
  );
  return parseResponse(response, "Unable to get assignments.");
};

// Student: Get assignments (for student's enrolled subjects)
export const GET_STUDENT_ASSIGNMENTS = async (options = {}) => {
  const { courseId } = options;
  const headers = await getAuthHeader();
  const queryParams = new URLSearchParams();
  if (courseId) queryParams.append("courseId", courseId);

  const response = await fetch(
    `${BASE_URL}/api/v1/assignments?${queryParams.toString()}`,
    {
      method: "GET",
      headers,
    }
  );
  return parseResponse(response, "Unable to get assignments.");
};

// Get single assignment details
export const GET_ASSIGNMENT_DETAILS = async (assignmentId) => {
  const headers = await getAuthHeader();
  const response = await fetch(
    `${BASE_URL}/api/v1/assignments/${assignmentId}`,
    {
      method: "GET",
      headers,
    }
  );
  return parseResponse(response, "Unable to get assignment details.");
};

// Teacher: Update assignment
export const UPDATE_ASSIGNMENT = async (assignmentId, updateData) => {
  const headers = await getAuthHeader();
  const response = await fetch(
    `${BASE_URL}/api/v1/assignments/${assignmentId}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(updateData),
    }
  );
  return parseResponse(response, "Unable to update assignment.");
};

// Teacher: Delete assignment
export const DELETE_ASSIGNMENT = async (assignmentId) => {
  const headers = await getAuthHeader();
  const response = await fetch(
    `${BASE_URL}/api/v1/assignments/${assignmentId}`,
    {
      method: "DELETE",
      headers,
    }
  );
  return parseResponse(response, "Unable to delete assignment.");
};

// ============ SUBMISSION APIs ============

// Student: Submit assignment
export const SUBMIT_ASSIGNMENT = async (assignmentId, submissionData) => {
  const headers = await getAuthHeader();
  const response = await fetch(
    `${BASE_URL}/api/v1/assignments/${assignmentId}/submit`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(submissionData),
    }
  );
  return parseResponse(response, "Unable to submit assignment.");
};

// Teacher: Get submissions for an assignment
export const GET_ASSIGNMENT_SUBMISSIONS = async (assignmentId) => {
  const headers = await getAuthHeader();
  const response = await fetch(
    `${BASE_URL}/api/v1/assignments/${assignmentId}/submissions`,
    {
      method: "GET",
      headers,
    }
  );
  return parseResponse(response, "Unable to get submissions.");
};

// Teacher: Grade submission
export const GRADE_SUBMISSION = async (submissionId, gradeData) => {
  const headers = await getAuthHeader();
  const response = await fetch(
    `${BASE_URL}/api/v1/assignments/submissions/${submissionId}/grade`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(gradeData),
    }
  );
  return parseResponse(response, "Unable to grade submission.");
};

// Student: Get my submissions with grades
export const GET_MY_SUBMISSIONS = async () => {
  const headers = await getAuthHeader();
  const response = await fetch(`${BASE_URL}/api/v1/assignments/my-submissions`, {
    method: "GET",
    headers,
  });
  return parseResponse(response, "Unable to get submissions.");
};

export default {
  CREATE_ASSIGNMENT,
  GET_TEACHER_ASSIGNMENTS,
  GET_STUDENT_ASSIGNMENTS,
  GET_ASSIGNMENT_DETAILS,
  UPDATE_ASSIGNMENT,
  DELETE_ASSIGNMENT,
  SUBMIT_ASSIGNMENT,
  GET_ASSIGNMENT_SUBMISSIONS,
  GRADE_SUBMISSION,
  GET_MY_SUBMISSIONS,
};