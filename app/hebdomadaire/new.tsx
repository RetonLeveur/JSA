import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Stack, router } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNewHebdomadaire } from "@/hooks/use-hebdomadaire";
import { useMachines } from "@/hooks/use-machines";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Machine } from "@/types/machine";
import { HebdomadaireList } from "@/types/hebdomadaire";

type Entry = { machine: Machine; amount: number };

const today = new Date().toISOString().split("T")[0];

export default function NewHebdomadaire() {
  const [date, setDate] = useState(today);
  const [entries, setEntries] = useState<Map<number, Entry>>(new Map());

  const { data: machines, isLoading: machinesLoading } = useMachines();
  const { mutate: createHebdomadaire, isPending } = useNewHebdomadaire();

  const inputBg = useThemeColor({ light: "#f2f2f7", dark: "#2c2c2e" }, "background");
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const placeholderColor = useThemeColor({ light: "#aaa", dark: "#666" }, "text");
  const borderColor = useThemeColor({ light: "#e5e5ea", dark: "#3a3a3c" }, "background");

  const toggleMachine = (machine: Machine) => {
    setEntries((prev) => {
      const next = new Map(prev);
      if (next.has(machine.id!)) {
        next.delete(machine.id!);
      } else {
        next.set(machine.id!, { machine, amount: 0 });
      }
      return next;
    });
  };

  const changeAmount = (machineId: number, delta: number) => {
    setEntries((prev) => {
      const next = new Map(prev);
      const entry = next.get(machineId);
      if (!entry) return prev;
      const amount = Math.max(0, entry.amount + delta);
      next.set(machineId, { ...entry, amount });
      return next;
    });
  };

  const handleSubmit = () => {
    if (!date.trim()) return;
    const list: HebdomadaireList[] = Array.from(entries.values()).map((e) => ({
      machines: e.machine,
      amount: e.amount
    }));
    createHebdomadaire(
      { date: date.trim(), list },
      {
        onSuccess: () => router.back(),
        onError: (e) => Alert.alert("Error", String(e))
      }
    );
  };

  const canSubmit = date.trim().length > 0 && !isPending;

  return (
    <SafeAreaProvider>
      <Stack.Screen options={{ title: "New Hebdomadaire" }} />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
              <ThemedView style={styles.card}>
                <View style={styles.field}>
                  <ThemedText type="defaultSemiBold" style={styles.label}>
                    Date
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: inputBg, color: textColor }
                    ]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={placeholderColor}
                    value={date}
                    onChangeText={setDate}
                    returnKeyType="done"
                  />
                </View>
              </ThemedView>

              <ThemedView style={styles.card}>
                <View style={styles.machinesHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.label}>
                    Machines
                  </ThemedText>
                  {entries.size > 0 && (
                    <View style={styles.badge}>
                      <ThemedText style={styles.badgeText}>
                        {entries.size} selected
                      </ThemedText>
                    </View>
                  )}
                </View>

                {machinesLoading && (
                  <ActivityIndicator
                    size="small"
                    color="#0a7ea4"
                    style={styles.loader}
                  />
                )}

                {!machinesLoading && (!machines || machines.length === 0) && (
                  <ThemedText style={styles.emptyText}>
                    No machines available. Add machines first.
                  </ThemedText>
                )}

                {(machines ?? []).map((machine, index) => {
                  const selected = entries.has(machine.id!);
                  const entry = entries.get(machine.id!);
                  return (
                    <View
                      key={machine.id}
                      style={[
                        styles.machineRow,
                        index < (machines?.length ?? 0) - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: borderColor
                        }
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.machineLeft}
                        onPress={() => toggleMachine(machine)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            selected && styles.checkboxSelected
                          ]}
                        >
                          {selected && (
                            <IconSymbol
                              name="checkmark"
                              size={13}
                              color="#fff"
                            />
                          )}
                        </View>
                        <View style={styles.machineInfo}>
                          <ThemedText type="defaultSemiBold">
                            {machine.name}
                          </ThemedText>
                          {machine.description ? (
                            <ThemedText style={styles.machineDesc}>
                              {machine.description}
                            </ThemedText>
                          ) : null}
                        </View>
                      </TouchableOpacity>

                      {selected && entry && (
                        <View style={styles.stepper}>
                          <TouchableOpacity
                            style={styles.stepperButton}
                            onPress={() => changeAmount(machine.id!, -1)}
                            disabled={entry.amount <= 0}
                          >
                            <IconSymbol
                              name="minus"
                              size={14}
                              color={entry.amount <= 0 ? "#c7c7cc" : "#0a7ea4"}
                            />
                          </TouchableOpacity>
                          <ThemedText
                            type="defaultSemiBold"
                            style={styles.stepperValue}
                          >
                            {entry.amount}
                          </ThemedText>
                          <TouchableOpacity
                            style={styles.stepperButton}
                            onPress={() => changeAmount(machine.id!, 1)}
                          >
                            <IconSymbol name="plus" size={14} color="#0a7ea4" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                })}
              </ThemedView>

              <TouchableOpacity
                style={[styles.submitButton, !canSubmit && styles.submitDisabled]}
                onPress={handleSubmit}
              >
                <ThemedText style={styles.submitText}>
                  {isPending ? "Saving…" : "Create Hebdomadaire"}
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  keyboardView: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 32
  },
  card: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2
  },
  field: {
    gap: 6
  },
  label: {
    fontSize: 14
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16
  },
  machinesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  badge: {
    backgroundColor: "#0a7ea4",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  },
  loader: {
    marginVertical: 8
  },
  emptyText: {
    fontSize: 13,
    opacity: 0.45,
    marginVertical: 4
  },
  machineRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 8
  },
  machineLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#c7c7cc",
    alignItems: "center",
    justifyContent: "center"
  },
  checkboxSelected: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4"
  },
  machineInfo: {
    flex: 1,
    gap: 2
  },
  machineDesc: {
    fontSize: 12,
    opacity: 0.5
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: "#0a7ea4",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 4
  },
  stepperButton: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center"
  },
  stepperValue: {
    fontSize: 14,
    minWidth: 18,
    textAlign: "center",
    color: "#0a7ea4"
  },
  submitButton: {
    backgroundColor: "#0a7ea4",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center"
  },
  submitDisabled: {
    opacity: 0.45
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});
