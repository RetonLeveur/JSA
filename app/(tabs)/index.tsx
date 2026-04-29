import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { HebdomadaireList } from "@/types/hebdomadaire";
import { useHebdomadaire, useUpdateHebdomadaireAmount } from "@/hooks/use-hebdomadaire";

function AmountStepper({
  amount,
  onIncrement,
  onDecrement
}: {
  amount: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <View style={styles.stepper}>
      <TouchableOpacity
        style={styles.stepperButton}
        onPress={onDecrement}
        disabled={amount <= 0}
      >
        <IconSymbol
          name="minus"
          size={16}
          color={amount <= 0 ? "#c7c7cc" : "#0a7ea4"}
        />
      </TouchableOpacity>
      <ThemedText type="defaultSemiBold" style={styles.stepperValue}>
        {amount}
      </ThemedText>
      <TouchableOpacity style={styles.stepperButton} onPress={onIncrement}>
        <IconSymbol name="plus" size={16} color="#0a7ea4" />
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen() {
  const { data: hebdomadaire, isLoading, isError } = useHebdomadaire();
  const { mutate: updateAmount } = useUpdateHebdomadaireAmount();

  // Local amounts map for instant UI feedback without waiting for re-fetch
  const [localAmounts, setLocalAmounts] = useState<Map<number, number>>(
    new Map()
  );

  useEffect(() => {
    if (hebdomadaire) {
      setLocalAmounts(
        new Map(hebdomadaire.machines.map((e) => [e.machines.id!, e.amount]))
      );
    }
  }, [hebdomadaire]);

  const handleAmountChange = (machineId: number, delta: number) => {
    const current = localAmounts.get(machineId) ?? 0;
    const next = Math.max(0, current + delta);
    setLocalAmounts((prev) => new Map(prev).set(machineId, next));
    updateAmount({ machineId, amount: next });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.header}>
          <View>
            <ThemedText type="title">Hebdomadaire</ThemedText>
            {hebdomadaire && (
              <ThemedText style={styles.meta}>
                {hebdomadaire.date} · {hebdomadaire.machines.length} items
              </ThemedText>
            )}
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => router.push("/hebdomadaire/new")}
              style={styles.refreshButton}
            >
              <IconSymbol name="arrow.clockwise" size={18} color="#0a7ea4" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/hebdomadaire/report")}
              style={styles.reportButton}
            >
              <IconSymbol name="doc.text" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </ThemedView>

        {isLoading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0a7ea4" />
          </View>
        )}

        {isError && (
          <View style={styles.center}>
            <ThemedText style={styles.errorText}>
              Failed to load hebdomadaire.
            </ThemedText>
          </View>
        )}

        {!isLoading && !isError && !hebdomadaire && (
          <View style={styles.center}>
            <ThemedText style={styles.emptyText}>No hebdomadaire yet.</ThemedText>
            <TouchableOpacity
              onPress={() => router.push("/hebdomadaire/new")}
              style={styles.emptyButton}
            >
              <ThemedText style={styles.emptyButtonText}>Create one</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {hebdomadaire && (
          <FlatList
            data={hebdomadaire.machines}
            keyExtractor={(item: HebdomadaireList) =>
              item.machines.id!.toString()
            }
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }: { item: HebdomadaireList }) => {
              const amount = localAmounts.get(item.machines.id!) ?? item.amount;
              return (
                <ThemedView style={styles.card}>
                  <View style={styles.cardBody}>
                    <ThemedText type="defaultSemiBold">
                      {item.machines.name}
                    </ThemedText>
                    {item.machines.description ? (
                      <ThemedText style={styles.description}>
                        {item.machines.description}
                      </ThemedText>
                    ) : null}
                    <ThemedText style={styles.piecesCount}>
                      {item.machines.pieces.length} piece
                      {item.machines.pieces.length !== 1 ? "s" : ""}
                    </ThemedText>
                  </View>
                  <AmountStepper
                    amount={amount}
                    onIncrement={() =>
                      handleAmountChange(item.machines.id!, 1)
                    }
                    onDecrement={() =>
                      handleAmountChange(item.machines.id!, -1)
                    }
                  />
                </ThemedView>
              );
            }}
            ListFooterComponent={() => (
              <TouchableOpacity
                onPress={() => router.push("/hebdomadaire/add-machine")}
                style={styles.addButton}
              >
                <IconSymbol name="plus" size={22} color="#fff" />
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
  meta: {
    fontSize: 13,
    opacity: 0.4
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12
  },
  errorText: {
    opacity: 0.5
  },
  emptyText: {
    opacity: 0.45,
    fontSize: 15
  },
  emptyButton: {
    backgroundColor: "#0a7ea4",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "600"
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8
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
  cardBody: {
    flex: 1,
    gap: 2
  },
  description: {
    fontSize: 13,
    opacity: 0.6
  },
  piecesCount: {
    fontSize: 12,
    opacity: 0.4
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#0a7ea4",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4
  },
  stepperButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  stepperValue: {
    fontSize: 15,
    minWidth: 20,
    textAlign: "center",
    color: "#0a7ea4"
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center"
  },
  reportButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center"
  },
  addButton: {
    marginTop: 8,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center"
  }
});
