import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    StatusBar,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { LineChart } from "react-native-chart-kit";

import { dataSumur } from "@/service/sumurdata";
import LeafletMap from "@/components/common/leaflet";

const screenWidth = Dimensions.get("window").width;

export default function DetailSumur() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const data = dataSumur.find(
        (i) => i.id === Number(id)
    );

    if (!data) return null;

    const getColor = (s: string) =>
        s === "kritis" ? "#EF4444" : s === "waspada" ? "#F59E0B" : "#22C55E";

    // 🔥 DATA GRAFIK (LEBIH HALUS)
    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
        datasets: [
            {
                data: [
                    data.subsidence - 1.2,
                    data.subsidence - 0.8,
                    data.subsidence - 0.5,
                    data.subsidence,
                    data.subsidence + 0.3,
                    data.subsidence + 0.6,
                ],
                strokeWidth: 2,
            },
        ],
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled" // 🔥 FIX TOUCH
            >

                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backBtn}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={22} color="#0F172A" />
                    </TouchableOpacity>
                </View>

                {/* TITLE */}
                <Text style={styles.pageTitle}>Detail Sumur</Text>

                <View style={styles.titleWrapper}>
                    <Text style={styles.name}>{data.nama}</Text>
                    <Text style={styles.subtitle}>
                        Monitoring kondisi tanah realtime
                    </Text>

                    <View
                        style={[
                            styles.badge,
                            { backgroundColor: getColor(data.status) },
                        ]}
                    >
                        <Text style={styles.badgeText}>
                            {data.status.toUpperCase()}
                        </Text>
                    </View>
                </View>

                {/* MAP */}
                <Text style={styles.section}>Lokasi Sumur</Text>
                <View style={styles.mapBox}>
                    <LeafletMap data={[data]} mode="single" />
                </View>

                {/* GRAFIK */}
                <Text style={styles.section}>Grafik Subsidence</Text>

                <View style={styles.chartWrapper}>
                    <LineChart
                        data={chartData}
                        width={screenWidth - 32}
                        height={180}
                        bezier
                        withShadow={false}
                        withVerticalLines={false}
                        withOuterLines={false}
                        withInnerLines={true}
                        chartConfig={{
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",

                            decimalPlaces: 1,

                            color: () => "#2563EB",
                            labelColor: () => "#94A3B8",

                            propsForDots: {
                                r: "3",
                                strokeWidth: "2",
                                stroke: "#2563EB",
                            },

                            propsForBackgroundLines: {
                                stroke: "#E2E8F0",
                            },
                        }}
                        style={styles.chart}
                    />
                </View>

                {/* ACTION */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.btnPrimary}>
                        <Text style={styles.btnText}>Lihat Laporan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnDanger}>
                        <Text style={styles.btnText}>Tandai Alert</Text>
                    </TouchableOpacity>
                </View>

                {/* UPDATE */}
                <Text style={styles.update}>
                    Terakhir diperbarui: 08 Apr 2026 • 14:32 WIB
                </Text>

            </ScrollView>
        </SafeAreaView>
    );
}

/* ================= STYLE ================= */

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop:
            Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },

    header: {
        paddingHorizontal: 16,
        paddingTop: 6,
        zIndex: 20, // 🔥 FIX BACK BUTTON
        elevation: 5,
    },

    backBtn: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F1F5F9",
    },

    pageTitle: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        marginTop: 6,
        color: "#0F172A",
    },

    titleWrapper: {
        paddingHorizontal: 16,
        marginTop: 10,
    },

    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0F172A",
    },

    subtitle: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 4,
    },

    badge: {
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        alignSelf: "flex-start",
    },

    badgeText: {
        color: "#fff",
        fontSize: 11,
    },

    section: {
        marginTop: 16,
        marginLeft: 16,
        marginBottom: 8,
        fontWeight: "600",
        color: "#0F172A",
    },

    mapBox: {
        height: 220,
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: "hidden",
        zIndex: 1,
    },

    chartWrapper: {
        marginHorizontal: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 10,
        zIndex: 1,
        elevation: 1,
    },

    chart: {
        borderRadius: 16,
    },

    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginTop: 14,
    },

    btnPrimary: {
        flex: 1,
        backgroundColor: "#2563EB",
        padding: 12,
        borderRadius: 12,
        marginRight: 6,
        alignItems: "center",
    },

    btnDanger: {
        flex: 1,
        backgroundColor: "#EF4444",
        padding: 12,
        borderRadius: 12,
        marginLeft: 6,
        alignItems: "center",
    },

    btnText: {
        color: "#fff",
        fontWeight: "600",
    },

    update: {
        textAlign: "center",
        fontSize: 12,
        color: "#64748B",
        marginTop: 12,
        marginBottom: 20,
    },
});