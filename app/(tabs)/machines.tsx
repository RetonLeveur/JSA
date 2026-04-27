import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useMachines } from "@/hooks/use-machines";

export default function MachinesList() {
  const { data: machines, isLoading, isError } = useMachines();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.header}>
          <View>
            <ThemedText type="title">Machines</ThemedText>
            <ThemedText style={styles.count}>
              {machines?.length ?? 0} items
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/machines/add")}
            style={styles.addButton}
          >
            <IconSymbol name="plus" size={22} color="#fff" />
          </TouchableOpacity>
        </ThemedView>

        {isLoading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0a7ea4" />
          </View>
        )}

        {isError && (
          <View style={styles.center}>
            <ThemedText style={styles.errorText}>
              Failed to load machines.
            </ThemedText>
          </View>
        )}

        {!isLoading && !isError && (
          <FlatList
            data={machines}
            keyExtractor={(item) => item.id!.toString()}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push(`/machines/${item.id}`)}
              >
                <ThemedView style={styles.card}>
                  <View style={styles.cardBadge}>
                    <ThemedText type="defaultSemiBold" style={styles.badgeText}>
                      #{item.id}
                    </ThemedText>
                  </View>
                  <View style={styles.cardBody}>
                    <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                    {item.description ? (
                      <ThemedText style={styles.description}>
                        {item.description}
                      </ThemedText>
                    ) : null}
                    <ThemedText style={styles.meta}>
                      {item.pieces.length} piece
                      {item.pieces.length !== 1 ? "s" : ""}
                    </ThemedText>
                  </View>
                </ThemedView>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  errorText: {
    opacity: 0.5
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  separator: {
    height: 8
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2
  },
  cardBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center"
  },
  badgeText: {
    color: "#fff",
    fontSize: 13
  },
  cardBody: {
    flex: 1,
    gap: 2
  },
  description: {
    fontSize: 13,
    opacity: 0.6
  },
  meta: {
    fontSize: 12,
    opacity: 0.4
  },
  count: {
    fontSize: 13,
    opacity: 0.4
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center"
  }
});
