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

// Student: Create leave request
export const CREATE_LEAVE_REQUEST = async (leaveData) => {
  const headers = await getAuthHeader();
  const response = await fetch(`${BASE_URL}/api/v1/leave`, {
    method: "POST",
    headers,
    body: JSON.stringify(leaveData),
  });
  return parseResponse(response, "Unable to create leave request.");
};

// Student: Get my leave requests
export const GET_MY_LEAVE_REQUESTS = async (options = {}) => {
  const { status, page = 1, limit = 20 } = options;
  const headers = await getAuthHeader();
  const queryParams = new URLSearchParams();
  if (status) queryParams.append("status", status);
  queryParams.append("page", page);
  queryParams.append("limit", limit);

  const response = await fetch(
    `${BASE_URL}/api/v1/leave/my-requests?${queryParams.toString()}`,
    {
      method: "GET",
      headers,
    }
  );
  return parseResponse(response, "Unable to get leave requests.");
};

// Teacher: Get leave requests for their subjects
export const GET_TEACHER_LEAVE_REQUESTS = async (options = {}) => {
  const { status, page = 1, limit = 20 } = options;
  const headers = await getAuthHeader();
  const queryParams = new URLSearchParams();
  if (status) queryParams.append("status", status);
  queryParams.append("page", page);
  queryParams.append("limit", limit);

  const response = await fetch(
    `${BASE_URL}/api/v1/leave/teacher?${queryParams.toString()}`,
    {
      method: "GET",
      headers,
    }
  );
  return parseResponse(response, "Unable to get leave requests.");
};

// Teacher: Approve leave request
export const APPROVE_LEAVE_REQUEST = async (id) => {
  const headers = await getAuthHeader();
  const response = await fetch(`${BASE_URL}/api/v1/leave/${id}/approve`, {
    method: "POST",
    headers,
  });
  return parseResponse(response, "Unable to approve leave request.");
};

// Teacher: Reject leave request
export const REJECT_LEAVE_REQUEST = async (id, rejectionReason = "") => {
  const headers = await getAuthHeader();
  const response = await fetch(`${BASE_URL}/api/v1/leave/${id}/reject`, {
    method: "POST",
    headers,
    body: JSON.stringify({ rejectionReason }),
  });
  return parseResponse(response, "Unable to reject leave request.");
};

// Admin: Get all leave requests
export const GET_ALL_LEAVE_REQUESTS = async (options = {}) => {
  const { status, page = 1, limit = 20 } = options;
  const headers = await getAuthHeader();
  const queryParams = new URLSearchParams();
  if (status) queryParams.append("status", status);
  queryParams.append("page", page);
  queryParams.append("limit", limit);

  const response = await fetch(
    `${BASE_URL}/api/v1/leave?${queryParams.toString()}`,
    {
      method: "GET",
      headers,
    }
  );
  return parseResponse(response, "Unable to get leave requests.");
};

// Get pending leave requests count
export const GET_PENDING_LEAVE_COUNT = async () => {
  const headers = await getAuthHeader();
  const response = await fetch(`${BASE_URL}/api/v1/leave/count`, {
    method: "GET",
    headers,
  });
  return parseResponse(response, "Unable to get pending count.");
};

export default {
  CREATE_LEAVE_REQUEST,
  GET_MY_LEAVE_REQUESTS,
  GET_TEACHER_LEAVE_REQUESTS,
  APPROVE_LEAVE_REQUEST,
  REJECT_LEAVE_REQUEST,
  GET_ALL_LEAVE_REQUESTS,
  GET_PENDING_LEAVE_COUNT,
};