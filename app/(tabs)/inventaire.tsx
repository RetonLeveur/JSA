import { StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function InventaireScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText type="title">Inventaire</ThemedText>
          <ThemedText style={styles.subtitle}>🚧 En cours de développement</ThemedText>
          <ThemedText style={styles.description}>
            Cette section sera disponible prochainement.
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 24,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
  },
  description: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: "center",
  },
});
