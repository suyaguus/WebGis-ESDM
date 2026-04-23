import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeafletMap from "@/components/common/leaflet";

// 🔥 ambil data pusat
import { dataSumur } from "@/service/sumurdata";

export default function PetaScreen() {
    // 🔥 hitung statistik (opsional tapi bagus untuk UI)
    const total = dataSumur.length;
    const totalKritis = dataSumur.filter(d => d.status === "kritis").length;
    const totalWaspada = dataSumur.filter(d => d.status === "waspada").length;
    const totalNormal = dataSumur.filter(d => d.status === "normal").length;

    return (
        <SafeAreaView style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>Peta Sumur</Text>
                <Text style={styles.subtitle}></Text>
            </View>

            {/* RINGKASAN */}
            <View style={styles.summary}>
                <Text style={styles.text}>🔴 Kritis: {totalKritis}</Text>
                <Text style={styles.text}>🟠 Waspada: {totalWaspada}</Text>
                <Text style={styles.text}>🟢 Normal: {totalNormal}</Text>
                <Text style={styles.text}>📊 Total: {total}</Text>
            </View>

            {/* MAP FULL */}
            <View style={styles.mapContainer}>
                <LeafletMap data={dataSumur} />
            </View>

        </SafeAreaView>
    );
}

/* ================= STYLE ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    header: {
        padding: 16,
    },

    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0F172A",
    },

    subtitle: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 4,
    },

    summary: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        backgroundColor: "#F8FAFC",
    },

    text: {
        fontSize: 12,
        fontWeight: "500",
    },

    mapContainer: {
        flex: 1, // 🔥 full screen map
    },
});