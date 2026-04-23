import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import Card from "@/components/common/card";
import MenuItem from "@/components/adminperusahaan/menuitem";
import LeafletMap from "@/components/common/leaflet";

import { dataSumur } from "@/service/sumurdata";

export default function DashboardScreen() {

    // FIX SCROLL BUG
    const [scrollEnabled, setScrollEnabled] = useState(true);

    // data dashboard (tidak diubah)
    const dashboardData = dataSumur;

    const total = dashboardData.length;
    const totalKritis = dashboardData.filter(d => d.status === "kritis").length;
    const totalWaspada = dashboardData.filter(d => d.status === "waspada").length;
    const totalNormal = dashboardData.filter(d => d.status === "normal").length;

    const avgSubsidence =
        total > 0
            ? dashboardData.reduce((a, b) => a + b.subsidence, 0) / total
            : 0;

    return (
        <SafeAreaView style={styles.safeArea}>

            <ScrollView
                contentContainerStyle={styles.container}
                scrollEnabled={scrollEnabled}
                showsVerticalScrollIndicator={false}
            >

                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.appName}>WebGIS</Text>
                    <View style={styles.profile}>
                        <Text style={styles.avatar}>RM</Text>
                    </View>
                </View>

                <Text style={styles.subtitle}>DASHBOARD - ADMIN PERUSAHAAN</Text>

                <Text style={styles.greeting}>Selamat siang, Rudi</Text>
                <Text style={styles.company}>PT MAJU JAYA TBK • 08 APR 2026</Text>

                {/* MENU */}
                <View style={styles.menuRow}>
                    <MenuItem icon="document-text-outline" label="Laporan" />
                    <MenuItem icon="pulse-outline" label="Realtime" />
                    <MenuItem icon="people-outline" label="Tim" />
                    <MenuItem icon="checkmark-circle-outline" label="Verifikasi" />
                </View>

                {/* STATS */}
                <View style={styles.row}>
                    <Card title="SUMUR AKTIF" value={total} sub="Total sensor" />
                    <Card
                        title="ONLINE"
                        value={Math.round((totalNormal / total) * 100) + "%"}
                        sub="Status normal"
                        green
                    />
                </View>

                {/* ALERT & AVG */}
                <View style={styles.row}>
                    <Card title="ALERT" value={totalKritis} sub="Kritis aktif" red />
                    <Card
                        title="AVG SUBSIDENCE"
                        value={avgSubsidence.toFixed(2)}
                        sub="cm/tahun"
                    />
                </View>

                {/* STATUS SUMMARY */}
                <View style={styles.row}>
                    <Card title="KRITIS" value={totalKritis} red />
                    <Card title="WASPADA" value={totalWaspada} />
                    <Card title="NORMAL" value={totalNormal} green />
                </View>

                {/* MAP */}
                <Text style={styles.section}>Peta Monitoring Sumur</Text>

                <View
                    style={styles.mapBox}
                    onTouchStart={() => setScrollEnabled(false)}
                    onTouchEnd={() => setScrollEnabled(true)}
                    onTouchCancel={() => setScrollEnabled(true)}
                >
                    <LeafletMap data={dashboardData} />
                </View>

                {/* ALERT LIST */}
                <Text style={styles.section}>Alert Terkini</Text>

                {dashboardData
                    .filter(item => item.status === "kritis")
                    .slice(0, 2)
                    .map((item, index) => (
                        <View key={index} style={styles.alertCard}>
                            <Text style={styles.alertBadge}>KRITIS</Text>
                            <Text style={styles.alertTitle}>
                                {item.nama} subsidence {item.subsidence} cm/thn
                            </Text>
                            <Text style={styles.alertDesc}>
                                Update otomatis
                            </Text>
                        </View>
                    ))}

            </ScrollView>
        </SafeAreaView>
    );
}

/* ================= STYLE ================= */

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    container: {
        padding: 16,
        paddingBottom: 40,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    appName: {
        color: "#0F172A",
        fontSize: 16,
        fontWeight: "bold",
    },

    profile: {
        backgroundColor: "#2563EB",
        padding: 8,
        borderRadius: 20,
    },

    avatar: {
        color: "#fff",
        fontWeight: "bold",
    },

    subtitle: {
        color: "#2563EB",
        marginTop: 10,
        fontSize: 12,
    },

    greeting: {
        color: "#0F172A",
        fontSize: 18,
        marginTop: 8,
        fontWeight: "600",
    },

    company: {
        color: "#64748B",
        fontSize: 12,
        marginBottom: 16,
    },

    menuRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    row: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 12,
    },

    section: {
        color: "#0F172A",
        marginTop: 16,
        marginBottom: 8,
        fontWeight: "600",
    },

    mapBox: {
        height: 220,
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 8,
    },

    alertCard: {
        backgroundColor: "#F8FAFC",
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
    },

    alertBadge: {
        color: "#EF4444",
        fontSize: 10,
    },

    alertTitle: {
        color: "#0F172A",
        fontWeight: "600",
    },

    alertDesc: {
        color: "#64748B",
        fontSize: 12,
    },
});