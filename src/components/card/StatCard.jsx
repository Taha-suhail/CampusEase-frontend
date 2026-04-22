import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ms, s, vs } from "react-native-size-matters";

export const StatCard = ({
  title,
  value,
  subtitle,
  highlight,
  orange,
  green,
}) => {
  return (
    <View style={[styles.card, highlight && styles.highlightCard]}>
      <Text
        style={[
          styles.cardLabel,
          orange && { color: "#F97316" },
          green && { color: "#22C55E" },
        ]}
      >
        {title}
      </Text>

      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardSub}>{subtitle}</Text>
    </View>
  );
};

export const ActionItem = ({ title, subtitle, icon, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.actionCard}>
    <Ionicons name={icon} size={22} color="#2563EB" />
    <View style={{ flex: 1 }}>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSub}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: s(16),
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: vs(10),
  },

  highlightCard: {
    backgroundColor: "#DBEAFE",
    borderColor: "#93C5FD",
  },

  cardLabel: {
    fontSize: ms(12),
    fontWeight: "700",
    color: "#2563EB",
  },

  cardValue: {
    fontSize: ms(22),
    fontWeight: "900",
    marginVertical: vs(6),
  },

  cardSub: {
    fontSize: ms(12),
    color: "#64748B",
  },

  cta: {
    backgroundColor: "#2563EB",
    padding: vs(14),
    borderRadius: s(16),
    alignItems: "center",
    marginVertical: vs(16),
  },

  ctaText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: ms(14),
  },

  sectionTitle: {
    fontSize: ms(14),
    fontWeight: "800",
    color: "#64748B",
    marginBottom: vs(10),
    textTransform: "uppercase",
  },

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(12),
    backgroundColor: "#FFFFFF",
    padding: s(14),
    borderRadius: s(14),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: vs(10),
  },

  actionTitle: {
    fontSize: ms(14),
    fontWeight: "700",
    color: "#0F172A",
  },

  actionSub: {
    fontSize: ms(12),
    color: "#64748B",
  },
});
