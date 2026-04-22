import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthStack from "./AuthStack";
import StudentStack from "./StudentStack";
import TeacherStack from "./TeacherStack";
import AdminStack from "./AdminStack";
import { sessionExpiredEmitter } from "../services/AdminServices";

const SIGNUP_STATUS_KEY = "campusease:isSignedUp";
const USER_ROLE_KEY = "userRole";

const MainAppStack = () => {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrapAuthState = async () => {
      try {
        const storedSignupStatus =
          await AsyncStorage.getItem(SIGNUP_STATUS_KEY);
        const storedUserRole = await AsyncStorage.getItem(USER_ROLE_KEY);
        setIsSignedUp(storedSignupStatus === "true");
        setUserRole(storedUserRole);
      } catch (error) {
        setIsSignedUp(false);
        setUserRole(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrapAuthState();
  }, []);

  const handleSignupComplete = async () => {
    try {
      await AsyncStorage.setItem(SIGNUP_STATUS_KEY, "true");
    } catch (error) {
      // Keep user moving forward even if persistence fails.
    }
    setIsSignedUp(true);
  };

  // Re-fetch role when isSignedUp becomes true (after login)
  useEffect(() => {
    if (isSignedUp && !userRole) {
      const fetchRole = async () => {
        try {
          const storedRole = await AsyncStorage.getItem(USER_ROLE_KEY);
          setUserRole(storedRole);
        } catch (error) {
          console.error("Failed to fetch user role:", error);
        }
      };
      fetchRole();
    }
  }, [isSignedUp]);

  // Session expiration listener
  useEffect(() => {
    const subscription = sessionExpiredEmitter.subscribe(() => {
      handleLogout();
    });

    return () => subscription.remove();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(SIGNUP_STATUS_KEY);
      await AsyncStorage.removeItem(USER_ROLE_KEY);
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
    } catch (error) {
      // Continue logout in UI even if storage fails.
    }
    setIsSignedUp(false);
    setUserRole(null);
  };

  if (isBootstrapping) {
    return null;
  }

  if (!isSignedUp) {
    return <AuthStack onSignupComplete={handleSignupComplete} />;
  }

  // Render stack based on role
  switch (userRole) {
    case "student":
      return <StudentStack onLogout={handleLogout} />;
    case "teacher":
      return <TeacherStack onLogout={handleLogout} />;
    case "admin":
      return <AdminStack onLogout={handleLogout} />;
    default:
      // Fallback to AuthStack if role is unknown
      return <AuthStack onSignupComplete={handleSignupComplete} />;
  }
};

export default MainAppStack;
