import React from "react";
import { ScrollView, StyleSheet, RefreshControl, View } from "react-native";

const RefreshableView = ({
  children,
  onRefresh,
  refreshing = false,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  style,
}) => {
  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#14B8A6"]}
            tintColor="#14B8A6"
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});

export default RefreshableView;