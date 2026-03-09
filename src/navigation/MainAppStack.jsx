import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthStack from "./AuthStack";
import HomeStack from "./HomeStack";

const SIGNUP_STATUS_KEY = "campusease:isSignedUp";

const MainAppStack = () => {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrapAuthState = async () => {
      try {
        const storedSignupStatus = await AsyncStorage.getItem(SIGNUP_STATUS_KEY);
        setIsSignedUp(storedSignupStatus === "true");
      } catch (error) {
        setIsSignedUp(false);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(SIGNUP_STATUS_KEY);
    } catch (error) {
      // Continue logout in UI even if storage fails.
    }
    setIsSignedUp(false);
  };

  if (isBootstrapping) {
    return null;
  }

  if (isSignedUp) {
    return <HomeStack onLogout={handleLogout} />;
  }

  return <AuthStack onSignupComplete={handleSignupComplete} />;
};

export default MainAppStack;
