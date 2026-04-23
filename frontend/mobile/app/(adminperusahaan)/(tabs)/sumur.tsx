import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";

import { dataSumur } from "@/service/sumurdata";

export default function SumurScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = dataSumur.filter((i) =>
    i.nama.toLowerCase().includes(search.toLowerCase())
  );

  const getColor = (s: string) =>
    s === "kritis" ? "#EF4444" : s === "waspada" ? "#F59E0B" : "#22C55E";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* 🔥 HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Daftar Sumur</Text>
          <Text style={styles.subtitle}>
            Monitoring air tanah realtime
          </Text>
        </View>

        {/* 🔍 SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            placeholder="Cari lokasi sumur..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
        </View>

        {/* 📋 LIST */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.card}
              onPress={() => router.push(`/sumur/${item.id}`)}
            >
              {/* LEFT */}
              <View style={{ gap: 2 }}>
                <Text style={styles.name}>{item.nama}</Text>
                <Text style={styles.desc}>
                  Monitoring subsidence
                </Text>
              </View>

              {/* RIGHT */}
              <View style={styles.right}>
                <Text
                  style={[
                    styles.value,
                    { color: getColor(item.status) },
                  ]}
                >
                  {item.subsidence} cm/thn
                </Text>

                <View
                  style={[
                    styles.badge,
                    { backgroundColor: getColor(item.status) },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

      </View>
    </SafeAreaView>
  );
}

/* ================= STYLE (SEMUA DALAM 1 FILE) ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",

    // 🔥 FIX STATUS BAR ANDROID
    paddingTop:
      Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  header: {
    marginTop: 6,
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 13,
    color: "#64748B",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#0F172A",
  },

  listContainer: {
    paddingBottom: 40,
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,

    // 🔥 SHADOW IOS
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    // 🔥 ANDROID
    elevation: 2,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  desc: {
    fontSize: 12,
    color: "#64748B",
  },

  right: {
    alignItems: "flex-end",
  },

  value: {
    fontSize: 14,
    fontWeight: "700",
  },

  badge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  badgeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});