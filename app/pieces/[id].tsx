import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePiece, useDeletePiece } from "@/hooks/use-pieces";

export default function PieceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pieceId = Number(id);

  const { data: piece, isLoading, isError } = usePiece(pieceId);
  const { mutate: deletePiece, isPending: isDeleting } = useDeletePiece();

  const handleDelete = () => {
    deletePiece(pieceId, { onSuccess: () => router.back() });
  };

  return (
    <SafeAreaProvider>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => router.push(`/pieces/edit?id=${pieceId}`)}>
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
              Failed to load piece.
            </ThemedText>
          </View>
        )}

        {piece && (
          <ThemedView style={styles.card}>
            <View style={styles.badge}>
              <ThemedText type="defaultSemiBold" style={styles.badgeText}>
                #{piece.id}
              </ThemedText>
            </View>
            <ThemedText type="title" style={styles.name}>
              {piece.name}
            </ThemedText>
            {piece.description ? (
              <ThemedText style={styles.description}>
                {piece.description}
              </ThemedText>
            ) : null}
          </ThemedView>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
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
  }
});
