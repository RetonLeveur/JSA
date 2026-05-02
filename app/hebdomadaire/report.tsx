import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHebdomadaire } from "@/hooks/use-hebdomadaire";
import { HebdomadaireList } from "@/types/hebdomadaire";
import { Piece } from "@/types/piece";

type PieceTotal = { piece: Piece; quantity: number; time: number };

function aggregatePieces(machines: HebdomadaireList[]): PieceTotal[] {
  const totals = new Map<string, PieceTotal>();
  for (const entry of machines) {
    if (entry.amount <= 0) continue;
    for (const piece of entry.machines.pieces) {
      const key = piece.id != null ? `id:${piece.id}` : `name:${piece.name}`;
      const used = (piece.quantity ?? 1) * entry.amount;
      const time = used * (piece.estimate_time ?? 0);
      const existing = totals.get(key);
      if (existing) {
        existing.quantity += used;
        existing.time += time;
      } else {
        totals.set(key, { piece, quantity: used, time });
      }
    }
  }
  return Array.from(totals.values()).sort((a, b) =>
    a.piece.name.localeCompare(b.piece.name)
  );
}

function fmtMin(n: number): string {
  if (n < 60) return `${n} min`;
  const h = Math.floor(n / 60);
  const m = n % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
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
  const totalMachineTime = producedMachines.reduce(
    (sum, m) => sum + m.amount * (m.machines.estimate_time ?? 0),
    0
  );
  const totalPieceTime = pieceTotals.reduce((sum, p) => sum + p.time, 0);
  const totalTime = totalMachineTime + totalPieceTime;

  return (
    <>
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
                {producedMachines.map((entry) => {
                  const machineEst = entry.machines.estimate_time ?? 0;
                  const machineTotalTime = machineEst * entry.amount;
                  return (
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

                      {machineEst > 0 && (
                        <View style={styles.machineTimeRow}>
                          <ThemedText style={styles.metaLabel}>
                            Machine time
                          </ThemedText>
                          <ThemedText style={styles.metaValue}>
                            {fmtMin(machineEst)} × {entry.amount} ={" "}
                            <ThemedText
                              type="defaultSemiBold"
                              style={styles.metaTotal}
                            >
                              {fmtMin(machineTotalTime)}
                            </ThemedText>
                          </ThemedText>
                        </View>
                      )}

                      {entry.machines.pieces.length === 0 ? (
                        <ThemedText style={styles.noPieces}>
                          No pieces defined for this machine.
                        </ThemedText>
                      ) : (
                        <View style={styles.piecesList}>
                          {entry.machines.pieces.map((piece, idx) => {
                            const used = (piece.quantity ?? 1) * entry.amount;
                            const pieceTime = used * (piece.estimate_time ?? 0);
                            return (
                              <View
                                key={piece.id ?? `${piece.name}-${idx}`}
                                style={styles.pieceRow}
                              >
                                <View style={styles.pieceInfo}>
                                  <ThemedText style={styles.pieceName}>
                                    {piece.name}
                                  </ThemedText>
                                  {pieceTime > 0 && (
                                    <ThemedText style={styles.pieceSub}>
                                      {fmtMin(pieceTime)}
                                    </ThemedText>
                                  )}
                                </View>
                                <ThemedText
                                  type="defaultSemiBold"
                                  style={styles.pieceAmount}
                                >
                                  {used}
                                </ThemedText>
                              </View>
                            );
                          })}
                        </View>
                      )}
                    </ThemedView>
                  );
                })}

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
                            <View style={styles.pieceInfo}>
                              <ThemedText
                                type="defaultSemiBold"
                                style={styles.pieceName}
                              >
                                {entry.piece.name}
                              </ThemedText>
                              {entry.time > 0 && (
                                <ThemedText style={styles.pieceSub}>
                                  {fmtMin(entry.time)}
                                </ThemedText>
                              )}
                            </View>
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

                {totalTime > 0 && (
                  <>
                    <ThemedText style={styles.sectionTitle}>Time</ThemedText>
                    <ThemedView style={styles.card}>
                      <View style={styles.timeRow}>
                        <ThemedText style={styles.timeLabel}>
                          Total machine time
                        </ThemedText>
                        <ThemedText
                          type="defaultSemiBold"
                          style={styles.timeValue}
                        >
                          {fmtMin(totalMachineTime)}
                        </ThemedText>
                      </View>
                      <View style={styles.timeRow}>
                        <ThemedText style={styles.timeLabel}>
                          Total piece time
                        </ThemedText>
                        <ThemedText
                          type="defaultSemiBold"
                          style={styles.timeValue}
                        >
                          {fmtMin(totalPieceTime)}
                        </ThemedText>
                      </View>
                      <View style={[styles.timeRow, styles.timeRowTotal]}>
                        <ThemedText
                          type="defaultSemiBold"
                          style={styles.timeLabelTotal}
                        >
                          Total time
                        </ThemedText>
                        <ThemedText
                          type="defaultSemiBold"
                          style={styles.timeValueTotal}
                        >
                          {fmtMin(totalTime)}
                        </ThemedText>
                      </View>
                    </ThemedView>
                  </>
                )}
              </>
            )}
          </ScrollView>
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
  pieceInfo: {
    flex: 1,
    gap: 1
  },
  pieceName: {
    fontSize: 14
  },
  pieceSub: {
    fontSize: 11,
    opacity: 0.5
  },
  pieceAmount: {
    color: "#0a7ea4",
    fontSize: 14,
    minWidth: 32,
    textAlign: "right"
  },
  machineTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: -4
  },
  metaLabel: {
    fontSize: 12,
    opacity: 0.5
  },
  metaValue: {
    fontSize: 12,
    opacity: 0.7
  },
  metaTotal: {
    color: "#0a7ea4",
    fontSize: 12
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6
  },
  timeLabel: {
    fontSize: 14,
    opacity: 0.7
  },
  timeValue: {
    fontSize: 14,
    color: "#0a7ea4"
  },
  timeRowTotal: {
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#c7c7cc"
  },
  timeLabelTotal: {
    fontSize: 15
  },
  timeValueTotal: {
    fontSize: 17,
    color: "#0a7ea4"
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
