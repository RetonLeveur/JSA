import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Piece } from "@/types/piece";

export default function Pieces() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.header}>
          <View>
            <ThemedText type="title">Pieces</ThemedText>
            <ThemedText style={styles.count}>{temp.length} items</ThemedText>
          </View>
          <TouchableOpacity onPress={() => {}} style={styles.addButton}>
            <IconSymbol name="plus" size={22} color="#fff" />
          </TouchableOpacity>
        </ThemedView>
        <FlatList
          data={temp}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(`/pieces/${item.id}`)}
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
                </View>
              </ThemedView>
            </TouchableOpacity>
          )}
        />
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

const temp: Piece[] = [
  { id: 1, name: "Piece 1", description: "Description of Piece 1" },
  { id: 2, name: "Piece 2", description: "Description of Piece 2" },
  { id: 3, name: "Piece 3", description: "Description of Piece 3" },
  { id: 4, name: "Piece 4", description: "Description of Piece 4" },
  { id: 5, name: "Piece 5", description: "Description of Piece 5" },
  { id: 6, name: "Piece 6", description: "Description of Piece 6" },
  { id: 7, name: "Piece 7", description: "Description of Piece 7" },
  { id: 8, name: "Piece 8", description: "Description of Piece 8" },
  { id: 9, name: "Piece 9", description: "Description of Piece 9" },
  { id: 10, name: "Piece 10", description: "Description of Piece 10" },
  { id: 11, name: "Piece 11", description: "Description of Piece 11" },
  { id: 12, name: "Piece 12", description: "Description of Piece 12" },
  { id: 13, name: "Piece 13", description: "Description of Piece 13" },
  { id: 14, name: "Piece 14", description: "Description of Piece 14" },
  { id: 15, name: "Piece 15", description: "Description of Piece 15" },
  { id: 16, name: "Piece 16", description: "Description of Piece 16" },
  { id: 17, name: "Piece 17", description: "Description of Piece 17" },
  { id: 18, name: "Piece 18", description: "Description of Piece 18" },
  { id: 19, name: "Piece 19", description: "Description of Piece 19" },
  { id: 20, name: "Piece 20", description: "Description of Piece 20" }
];
