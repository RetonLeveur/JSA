import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHebdomadaire } from "@/hooks/use-hebdomadaire";
import { HebdomadaireList } from "@/types/hebdomadaire";
import { Piece } from "@/types/piece";

type PieceTotal = { piece: Piece; quantity: number };

function aggregatePieces(machines: HebdomadaireList[]): PieceTotal[] {
  const totals = new Map<string, PieceTotal>();
  for (const entry of machines) {
    if (entry.amount <= 0) continue;
    for (const piece of entry.machines.pieces) {
      const key = piece.id != null ? `id:${piece.id}` : `name:${piece.name}`;
      const existing = totals.get(key);
      if (existing) {
        existing.quantity += entry.amount;
      } else {
        totals.set(key, { piece, quantity: entry.amount });
      }
    }
  }
  return Array.from(totals.values()).sort((a, b) =>
    a.piece.name.localeCompare(b.piece.name)
  );
}

export default function HebdomadaireReport() {
  const { data: hebdomadaire, isLoading, isError } = useHebdomadaire();

  const producedMachines =
    hebdomadaire?.machines.filter((m) => m.amount > 0) ?? [];
  const pieceTotals = aggregatePieces(producedMachines);
  const totalUnitsBuilt = producedMachines.reduce(
    (sum, m) => sum + m.amount,
    0
  );
  const totalPiecesBuilt = pieceTotals.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <SafeAreaProvider>
      <Stack.Screen options={{ title: "Report" }} />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        {isLoading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0a7ea4" />
          </View>
        )}

        {isError && (
          <View style={styles.center}>
            <ThemedText style={styles.errorText}>
              Failed to load report.
            </ThemedText>
          </View>
        )}

        {!isLoading && !isError && !hebdomadaire && (
          <View style={styles.center}>
            <ThemedText style={styles.emptyText}>
              No hebdomadaire yet.
            </ThemedText>
          </View>
        )}

        {hebdomadaire && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ThemedView style={styles.headerCard}>
              <ThemedText style={styles.headerLabel}>Hebdomadaire</ThemedText>
              <ThemedText type="title" style={styles.headerDate}>
                {hebdomadaire.date}
              </ThemedText>
              {producedMachines.length > 0 && (
                <View style={styles.headerStats}>
                  <View style={styles.headerStat}>
                    <ThemedText style={styles.headerStatValue}>
                      {totalUnitsBuilt}
                    </ThemedText>
                    <ThemedText style={styles.headerStatLabel}>
                      unit{totalUnitsBuilt !== 1 ? "s" : ""} built
                    </ThemedText>
                  </View>
                  <View style={styles.headerStatDivider} />
                  <View style={styles.headerStat}>
                    <ThemedText style={styles.headerStatValue}>
                      {producedMachines.length}
                    </ThemedText>
                    <ThemedText style={styles.headerStatLabel}>
                      machine{producedMachines.length !== 1 ? "s" : ""}
                    </ThemedText>
                  </View>
                  <View style={styles.headerStatDivider} />
                  <View style={styles.headerStat}>
                    <ThemedText style={styles.headerStatValue}>
                      {totalPiecesBuilt}
                    </ThemedText>
                    <ThemedText style={styles.headerStatLabel}>
                      piece{totalPiecesBuilt !== 1 ? "s" : ""}
                    </ThemedText>
                  </View>
                </View>
              )}
            </ThemedView>

            {producedMachines.length === 0 ? (
              <ThemedView style={styles.card}>
                <ThemedText style={styles.emptyState}>
                  No production recorded.
                </ThemedText>
              </ThemedView>
            ) : (
              <>
                <ThemedText style={styles.sectionTitle}>
                  By machine
                </ThemedText>
                {producedMachines.map((entry) => (
                  <ThemedView
                    key={entry.machines.id ?? entry.machines.name}
                    style={styles.card}
                  >
                    <View style={styles.machineHeader}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.machineName}
                      >
                        {entry.machines.name}
                      </ThemedText>
                      <View style={styles.amountBadge}>
                        <ThemedText style={styles.amountBadgeText}>
                          × {entry.amount}
                        </ThemedText>
                      </View>
                    </View>

                    {entry.machines.pieces.length === 0 ? (
                      <ThemedText style={styles.noPieces}>
                        No pieces defined for this machine.
                      </ThemedText>
                    ) : (
                      <View style={styles.piecesList}>
                        {entry.machines.pieces.map((piece, idx) => (
                          <View
                            key={piece.id ?? `${piece.name}-${idx}`}
                            style={styles.pieceRow}
                          >
                            <ThemedText style={styles.pieceName}>
                              {piece.name}
                            </ThemedText>
                            <ThemedText
                              type="defaultSemiBold"
                              style={styles.pieceAmount}
                            >
                              {entry.amount}
                            </ThemedText>
                          </View>
                        ))}
                      </View>
                    )}
                  </ThemedView>
                ))}

                {pieceTotals.length > 0 && (
                  <>
                    <ThemedText style={styles.sectionTitle}>
                      Total pieces
                    </ThemedText>
                    <ThemedView style={styles.card}>
                      <View style={styles.piecesList}>
                        {pieceTotals.map((entry, idx) => (
                          <View
                            key={entry.piece.id ?? `${entry.piece.name}-${idx}`}
                            style={styles.pieceRow}
                          >
                            <ThemedText
                              type="defaultSemiBold"
                              style={styles.pieceName}
                            >
                              {entry.piece.name}
                            </ThemedText>
                            <View style={styles.totalBadge}>
                              <ThemedText style={styles.totalBadgeText}>
                                {entry.quantity}
                              </ThemedText>
                            </View>
                          </View>
                        ))}
                      </View>
                    </ThemedView>
                  </>
                )}
              </>
            )}
          </ScrollView>
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
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 32
  },
  headerCard: {
    borderRadius: 12,
    padding: 16,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2
  },
  headerLabel: {
    fontSize: 12,
    opacity: 0.5,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  headerDate: {
    fontSize: 26,
    lineHeight: 32
  },
  headerStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#c7c7cc"
  },
  headerStat: {
    flex: 1,
    alignItems: "center",
    gap: 2
  },
  headerStatValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0a7ea4"
  },
  headerStatLabel: {
    fontSize: 11,
    opacity: 0.5
  },
  headerStatDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    backgroundColor: "#c7c7cc"
  },
  sectionTitle: {
    fontSize: 13,
    opacity: 0.5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 8,
    marginLeft: 4
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
  machineHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  machineName: {
    flex: 1,
    fontSize: 16
  },
  amountBadge: {
    backgroundColor: "#0a7ea4",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  amountBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13
  },
  noPieces: {
    fontSize: 13,
    opacity: 0.45
  },
  piecesList: {
    gap: 2
  },
  pieceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#c7c7cc"
  },
  pieceName: {
    flex: 1,
    fontSize: 14
  },
  pieceAmount: {
    color: "#0a7ea4",
    fontSize: 14,
    minWidth: 32,
    textAlign: "right"
  },
  totalBadge: {
    minWidth: 36,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#0a7ea4",
    alignItems: "center"
  },
  totalBadgeText: {
    color: "#0a7ea4",
    fontWeight: "700",
    fontSize: 14
  },
  emptyState: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: "center",
    paddingVertical: 16
  }
});
