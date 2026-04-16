import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/adminperusahaan/card";
import MenuItem from "../../components/adminperusahaan/menuitem";
import MapViewCard from "../../components/adminperusahaan/mapviewcard";


export default function DashboardScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

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
                    <Card title="SUMUR AKTIF" value="10" sub="Total sensor" />
                    <Card title="ONLINE" value="7" sub="75% aktif" green />
                </View>

                <View style={styles.row}>
                    <Card title="ALERT" value="3" sub="2 kemarin" red />
                    <Card title="AVG SUBSIDENCE" value="-2.71" sub="cm/tahun" />
                </View>

                {/* PROGRESS */}
                <Text style={styles.section}>Kuota Air Tanah</Text>
                <View style={styles.progressCard}>
                    <View style={styles.progressBar}>
                        <View style={styles.progressFill} />
                    </View>
                    <Text style={styles.progressText}>75%</Text>
                </View>

                {/* ✅ PETA SUDAH AKTIF */}
                <Text style={styles.section}>Peta Sumur</Text>
                <MapViewCard />


                {/* ALERT */}
                <Text style={styles.section}>Alert Terkini</Text>

                <View style={styles.alertCard}>
                    <Text style={styles.alertBadge}>KRITIS</Text>
                    <Text style={styles.alertTitle}>
                        SW-007 subsidence -4.82 cm/thn
                    </Text>
                    <Text style={styles.alertDesc}>
                        Cengkareng • 08:14 WIB
                    </Text>
                </View>

                <View style={styles.alertCard}>
                    <Text style={styles.alertBadgeYellow}>WASPADA</Text>
                    <Text style={styles.alertTitle}>
                        Kuota 87% mendekati batas
                    </Text>
                    <Text style={styles.alertDesc}>
                        PT Maju Jaya • Update otomatis
                    </Text>
                </View>

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

    progressCard: {
        backgroundColor: "#F8FAFC",
        padding: 12,
        borderRadius: 12,
    },

    progressBar: {
        height: 6,
        backgroundColor: "#E5E7EB",
        borderRadius: 10,
        overflow: "hidden",
    },

    progressFill: {
        width: "87%",
        height: "100%",
        backgroundColor: "#2563EB",
    },

    progressText: {
        color: "#2563EB",
        marginTop: 5,
        textAlign: "right",
    },

    mapBox: {
        height: 150,
        backgroundColor: "#F1F5F9",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    mapPlaceholder: {
        color: "#94A3B8",
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

    alertBadgeYellow: {
        color: "#F59E0B",
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