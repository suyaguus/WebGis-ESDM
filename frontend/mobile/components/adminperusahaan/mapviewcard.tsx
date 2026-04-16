import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

export default function MapViewCard() {

    const sumurData = [
        { id: 1, nama: "Sumur PT Jaya Abadi", lat: -6.2, lng: 106.8, status: "kritis" },
        { id: 2, nama: "Sumur PT Surya Kencana", lat: -6.6, lng: 106.8, status: "normal" },
        { id: 3, nama: "Sumur PT Nusantara", lat: -6.24, lng: 107.0, status: "waspada" },
        { id: 4, nama: "Sumur PT Maju Jaya", lat: -6.9, lng: 107.6, status: "normal" },
        { id: 5, nama: "Sumur PT Indo Nusa", lat: -6.7, lng: 108.5, status: "kritis" },
        { id: 6, nama: "Sumur PT Karya Mandiri", lat: -7.0, lng: 110.4, status: "normal" },
        { id: 7, nama: "Sumur PT Sumber Air", lat: -7.57, lng: 110.8, status: "waspada" },
        { id: 8, nama: "Sumur PT Tirta", lat: -7.8, lng: 110.36, status: "normal" },
        { id: 9, nama: "Sumur PT Jaya Mandiri", lat: -7.25, lng: 112.75, status: "kritis" },
        { id: 10, nama: "Sumur PT Satu Nusa", lat: -7.98, lng: 112.63, status: "normal" },
    ];

    const getColor = (status: string) => {
        if (status === "kritis") return "#EF4444";
        if (status === "waspada") return "#F59E0B";
        return "#22C55E";
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -7.2,
                    longitude: 109.5,
                    latitudeDelta: 4,
                    longitudeDelta: 4,
                }}
            >
                {sumurData.map((item) => (
                    <Marker
                        key={item.id}
                        coordinate={{
                            latitude: item.lat,
                            longitude: item.lng,
                        }}
                        title={item.nama}
                        anchor={{ x: 0.5, y: 0.9 }} // 🔥 lebih presisi dari 1
                    >
                        <View style={styles.markerContainer}>
                            <Ionicons
                                name="water"
                                size={28}
                                color={getColor(item.status)}
                            />
                        </View>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        height: 150,
        borderRadius: 12,
        overflow: "hidden",
    },
    map: {
        flex: 1,
    },
});