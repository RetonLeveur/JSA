import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function MachineDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaProvider>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => {}}>
                <IconSymbol name="pencil" size={22} color="#0a7ea4" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <IconSymbol name="trash.fill" size={22} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          )
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ThemedView style={styles.card}>
          <View style={styles.badge}>
            <ThemedText type="defaultSemiBold" style={styles.badgeText}>
              #{id}
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.name}>
            Machine {id}
          </ThemedText>
          <ThemedText style={styles.description}>
            Description of Machine {id}
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
