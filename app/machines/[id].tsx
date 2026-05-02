import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useMachine, useDeleteMachine } from "@/hooks/use-machines";

export default function MachineDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const machineId = Number(id);

  const { data: machine, isLoading, isError } = useMachine(machineId);
  const { mutate: deleteMachine, isPending: isDeleting } = useDeleteMachine();

  const handleDelete = () => {
    deleteMachine(machineId, { onSuccess: () => router.back() });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => router.push(`/machines/edit?id=${machineId}`)}>
                <IconSymbol name="pencil" size={22} color="#0a7ea4" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} disabled={isDeleting}>
                <IconSymbol
                  name="trash.fill"
                  size={22}
                  color={isDeleting ? "#ccc" : "#e74c3c"}
                />
              </TouchableOpacity>
            </View>
          )
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        {isLoading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0a7ea4" />
          </View>
        )}

        {isError && (
          <View style={styles.center}>
            <ThemedText style={styles.errorText}>
              Failed to load machine.
            </ThemedText>
          </View>
        )}

        {machine && (
          <ThemedView style={styles.card}>
            <View style={styles.badge}>
              <ThemedText type="defaultSemiBold" style={styles.badgeText}>
                #{machine.id}
              </ThemedText>
            </View>
            <ThemedText type="title" style={styles.name}>
              {machine.name}
            </ThemedText>
            {machine.description ? (
              <ThemedText style={styles.description}>
                {machine.description}
              </ThemedText>
            ) : null}

            {machine.estimate_time != null && (
              <View style={styles.estimateRow}>
                <IconSymbol name="clock" size={14} color="#0a7ea4" />
                <ThemedText style={styles.estimateText}>
                  {machine.estimate_time} min
                </ThemedText>
              </View>
            )}

            {machine.pieces.length > 0 && (
              <View style={styles.piecesSection}>
                <ThemedText type="defaultSemiBold" style={styles.piecesTitle}>
                  Pieces ({machine.pieces.length})
                </ThemedText>
                {machine.pieces.map((piece) => (
                  <View key={piece.id} style={styles.pieceRow}>
                    <View style={styles.pieceDot} />
                    <ThemedText style={styles.pieceName}>{piece.name}</ThemedText>
                    <View style={styles.qtyBadge}>
                      <ThemedText type="defaultSemiBold" style={styles.qtyText}>
                        × {piece.quantity ?? 1}
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ThemedView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  errorText: {
    opacity: 0.5
  },
  headerButtons: {
    flexDirection: "row",
    gap: 16
  },
  card: {
    margin: 16,
    borderRadius: 12,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  badgeText: {
    color: "#fff",
    fontSize: 13
  },
  name: {
    marginTop: 4
  },
  description: {
    opacity: 0.6
  },
  estimateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4
  },
  estimateText: {
    color: "#0a7ea4",
    fontSize: 14,
    fontWeight: "600"
  },
  piecesSection: {
    marginTop: 4,
    gap: 8
  },
  piecesTitle: {
    fontSize: 14,
    opacity: 0.7
  },
  pieceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  pieceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0a7ea4"
  },
  pieceName: {
    flex: 1
  },
  qtyBadge: {
    minWidth: 36,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#0a7ea4",
    alignItems: "center"
  },
  qtyText: {
    color: "#0a7ea4",
    fontSize: 13
  }
});
