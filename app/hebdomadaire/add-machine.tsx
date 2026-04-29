import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { Stack, router } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAddHebdomadaireMachine } from "@/hooks/use-hebdomadaire";
import { useHebdomadaire } from "@/hooks/use-hebdomadaire";
import { useMachines } from "@/hooks/use-machines";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Machine } from "@/types/machine";

export default function AddHebdomadaireMachine() {
  const { data: hebdomadaire, isLoading: hebLoading } = useHebdomadaire();
  const { data: machines, isLoading: machinesLoading } = useMachines();
  const { mutate: addMachine, isPending } = useAddHebdomadaireMachine();

  const borderColor = useThemeColor({ light: "#e5e5ea", dark: "#3a3a3c" }, "background");

  const existingIds = new Set(
    (hebdomadaire?.machines ?? []).map((e) => e.machines.id!)
  );

  const available = (machines ?? []).filter((m) => !existingIds.has(m.id!));

  const handleAdd = (machine: Machine) => {
    addMachine(
      { machine, amount: 0 },
      {
        onSuccess: () => router.back(),
        onError: (e) => Alert.alert("Error", String(e))
      }
    );
  };

  const isLoading = hebLoading || machinesLoading;

  return (
    <SafeAreaProvider>
      <Stack.Screen options={{ title: "Add Machine" }} />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.card}>
            {isLoading && (
              <ActivityIndicator size="small" color="#0a7ea4" style={styles.loader} />
            )}

            {!isLoading && available.length === 0 && (
              <ThemedText style={styles.emptyText}>
                All machines are already in this hebdomadaire.
              </ThemedText>
            )}

            {available.map((machine, index) => (
              <TouchableOpacity
                key={machine.id}
                style={[
                  styles.row,
                  index < available.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor
                  }
                ]}
                onPress={() => handleAdd(machine)}
                disabled={isPending}
                activeOpacity={0.7}
              >
                <View style={styles.rowInfo}>
                  <ThemedText type="defaultSemiBold">{machine.name}</ThemedText>
                  {machine.description ? (
                    <ThemedText style={styles.desc}>{machine.description}</ThemedText>
                  ) : null}
                </View>
                <IconSymbol name="plus.circle" size={22} color="#0a7ea4" />
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32
  },
  card: {
    borderRadius: 12,
    padding: 16,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2
  },
  loader: {
    marginVertical: 8
  },
  emptyText: {
    fontSize: 13,
    opacity: 0.45,
    marginVertical: 4
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12
  },
  rowInfo: {
    flex: 1,
    gap: 2
  },
  desc: {
    fontSize: 12,
    opacity: 0.5
  }
});
