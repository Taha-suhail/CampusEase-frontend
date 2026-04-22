import { BASE_URL } from "../config/baseUrl";

export const parseResponse = async (response, defaultMessage) => {
  let data;

  try {
    data = await response.json(); // ✅ ONLY ONCE
  } catch (err) {
    throw new Error("Failed to parse server response");
  }

  if (!response.ok) {
    throw new Error(data?.message || defaultMessage);
  }

  return data;
};

export const CHECKELIGIBILITY = async (email) => {
  if (!email?.trim()) {
    throw new Error("Email is required.");
  }

  const response = await fetch(`${BASE_URL}/api/v1/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.trim() }),
  });

  return parseResponse(response, "Unable to check eligibility.");
};

export const REGISTERUSER = async ({ fullName, email }) => {
  if (!fullName?.trim()) {
    throw new Error("Full name is required.");
  }

  if (!email?.trim()) {
    throw new Error("Email is required.");
  }

  const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: fullName.trim(),
      email: email.trim(),
    }),
  });

  return parseResponse(response, "Unable to send OTP.");
};

export const VERIFYOTP = async ({ email, otp }) => {
  if (!email?.trim()) {
    throw new Error("Email is required.");
  }

  if (!otp?.trim()) {
    throw new Error("OTP is required.");
  }

  const response = await fetch(`${BASE_URL}/api/v1/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      otp: otp.trim(),
    }),
  });

  return parseResponse(response, "Unable to verify OTP.");
};

export const LOGIN = async ({ email, password }) => {
  if (!email?.trim()) {
    throw new Error("Email is required.");
  }

  if (!password?.trim()) {
    throw new Error("Password is required.");
  }

  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      password: password.trim(),
    }),
  });

  return await parseResponse(response, "Unable to login.");
};

import AsyncStorage from "@react-native-async-storage/async-storage";

export const GET_USER = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) throw new Error("Access token is required");
  const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await parseResponse(response, "Unable to get user.");
};

export const LOGOUT = async () => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("campusease:isSignedUp");
    await AsyncStorage.removeItem("userRole");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export default {
  CHECKELIGIBILITY,
  REGISTERUSER,
  VERIFYOTP,
  LOGIN,
  GET_USER,
  LOGOUT,
};
