const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://campusease.up.railway.app";

const parseResponse = async (response, fallbackMessage) => {
  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage);
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

export default {
  CHECKELIGIBILITY,
  REGISTERUSER,
  VERIFYOTP,
};
