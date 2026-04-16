import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MenuItem({ icon, label }: any) {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={20} color="#2563EB" />
            <Text style={styles.text}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#F1F5F9",
        padding: 12,
        borderRadius: 12,
        marginHorizontal: 4,
    },
    text: {
        marginTop: 5,
        fontSize: 10,
        color: "#0F172A",
    },
});