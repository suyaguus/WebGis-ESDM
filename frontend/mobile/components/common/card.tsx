import { View, Text, StyleSheet } from "react-native";

export default function Card({ title, value, sub, red, green }: any) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text
                style={[
                    styles.value,
                    red && { color: "#EF4444" },
                    green && { color: "#22C55E" },
                ]}
            >
                {value}
            </Text>
            <Text style={styles.sub}>{sub}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        padding: 14,
        borderRadius: 12,
    },
    title: { color: "#64748B", fontSize: 10 },
    value: { color: "#0F172A", fontSize: 18, fontWeight: "bold" },
    sub: { color: "#94A3B8", fontSize: 10 },
});