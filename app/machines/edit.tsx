import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useMachine, useUpdateMachine } from "@/hooks/use-machines";
import { usePieces } from "@/hooks/use-pieces";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Piece } from "@/types/piece";

export default function EditMachine() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const machineId = Number(id);

  const { data: machine, isLoading: machineLoading } = useMachine(machineId);
  const { data: pieces, isLoading: piecesLoading } = usePieces();
  const { mutate: updateMachine, isPending } = useUpdateMachine();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [estimateTime, setEstimateTime] = useState("");
  const [pieceQuantities, setPieceQuantities] = useState<Map<number, number>>(
    new Map()
  );

  useEffect(() => {
    if (machine) {
      setName(machine.name);
      setDescription(machine.description ?? "");
      setEstimateTime(
        machine.estimate_time != null ? String(machine.estimate_time) : ""
      );
      setPieceQuantities(
        new Map(machine.pieces.map((p) => [p.id!, p.quantity ?? 1]))
      );
    }
  }, [machine]);

  const inputBg = useThemeColor({ light: "#f2f2f7", dark: "#2c2c2e" }, "background");
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const placeholderColor = useThemeColor({ light: "#aaa", dark: "#666" }, "text");
  const borderColor = useThemeColor({ light: "#e5e5ea", dark: "#3a3a3c" }, "background");

  const togglePiece = (pieceId: number) => {
    setPieceQuantities((prev) => {
      const next = new Map(prev);
      next.has(pieceId) ? next.delete(pieceId) : next.set(pieceId, 1);
      return next;
    });
  };

  const changeQty = (pieceId: number, delta: number) => {
    setPieceQuantities((prev) => {
      const next = new Map(prev);
      const qty = Math.max(1, (next.get(pieceId) ?? 1) + delta);
      next.set(pieceId, qty);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const selectedPieces: Piece[] = (pieces ?? [])
      .filter((p) => pieceQuantities.has(p.id!))
      .map((p) => ({ ...p, quantity: pieceQuantities.get(p.id!) ?? 1 }));
    const parsedTime = parseInt(estimateTime, 10);
    updateMachine(
      {
        id: machineId,
        name: name.trim(),
        description: description.trim() || undefined,
        estimate_time: Number.isFinite(parsedTime) ? parsedTime : undefined,
        pieces: selectedPieces
      },
      { onSuccess: () => router.back() }
    );
  };

  const isLoading = machineLoading || piecesLoading;

  return (
    <>
      <Stack.Screen options={{ title: "Edit Machine" }} />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0a7ea4" />
          </View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <ThemedView style={styles.form}>
                <View style={styles.field}>
                  <ThemedText type="defaultSemiBold" style={styles.label}>
                    Name
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: inputBg, color: textColor }
                    ]}
                    placeholder="Machine name"
                    placeholderTextColor={placeholderColor}
                    value={name}
                    onChangeText={setName}
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.field}>
                  <ThemedText type="defaultSemiBold" style={styles.label}>
                    Description
                    <ThemedText style={styles.optional}> (optional)</ThemedText>
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      styles.multiline,
                      { backgroundColor: inputBg, color: textColor }
                    ]}
                    placeholder="Description"
                    placeholderTextColor={placeholderColor}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    returnKeyType="done"
                  />
                </View>

                <View style={styles.field}>
                  <ThemedText type="defaultSemiBold" style={styles.label}>
                    Estimate time
                    <ThemedText style={styles.optional}> (minutes, optional)</ThemedText>
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: inputBg, color: textColor }
                    ]}
                    placeholder="e.g. 30"
                    placeholderTextColor={placeholderColor}
                    value={estimateTime}
                    onChangeText={setEstimateTime}
                    keyboardType="numeric"
                    returnKeyType="done"
                  />
                </View>
              </ThemedView>

              <ThemedView style={styles.piecesCard}>
                <View style={styles.piecesHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.label}>
                    Pieces
                  </ThemedText>
                  {pieceQuantities.size > 0 && (
                    <View style={styles.badge}>
                      <ThemedText style={styles.badgeText}>
                        {pieceQuantities.size} selected
                      </ThemedText>
                    </View>
                  )}
                </View>

                {!pieces || pieces.length === 0 ? (
                  <ThemedText style={styles.emptyText}>
                    No pieces available. Add pieces first.
                  </ThemedText>
                ) : (
                  pieces.map((piece, index) => {
                    const selected = pieceQuantities.has(piece.id!);
                    const qty = pieceQuantities.get(piece.id!) ?? 1;
                    return (
                      <View
                        key={piece.id}
                        style={[
                          styles.pieceRow,
                          index < pieces.length - 1 && {
                            borderBottomWidth: 1,
                            borderBottomColor: borderColor
                          }
                        ]}
                      >
                        <TouchableOpacity
                          style={styles.pieceLeft}
                          onPress={() => togglePiece(piece.id!)}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.checkbox,
                              selected && styles.checkboxSelected
                            ]}
                          >
                            {selected && (
                              <IconSymbol name="checkmark" size={13} color="#fff" />
                            )}
                          </View>
                          <View style={styles.pieceInfo}>
                            <ThemedText type="defaultSemiBold">
                              {piece.name}
                            </ThemedText>
                            {piece.description ? (
                              <ThemedText style={styles.pieceDesc}>
                                {piece.description}
                              </ThemedText>
                            ) : null}
                          </View>
                        </TouchableOpacity>
                        {selected && (
                          <View style={styles.stepper}>
                            <TouchableOpacity
                              style={styles.stepperButton}
                              onPress={() => changeQty(piece.id!, -1)}
                              disabled={qty <= 1}
                            >
                              <IconSymbol
                                name="minus"
                                size={13}
                                color={qty <= 1 ? "#c7c7cc" : "#0a7ea4"}
                              />
                            </TouchableOpacity>
                            <ThemedText type="defaultSemiBold" style={styles.stepperValue}>
                              {qty}
                            </ThemedText>
                            <TouchableOpacity
                              style={styles.stepperButton}
                              onPress={() => changeQty(piece.id!, 1)}
                            >
                              <IconSymbol name="plus" size={13} color="#0a7ea4" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    );
                  })
                )}
              </ThemedView>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!name.trim() || isPending) && styles.submitDisabled
                ]}
                onPress={handleSubmit}
                disabled={!name.trim() || isPending}
              >
                <ThemedText style={styles.submitText}>
                  {isPending ? "Saving…" : "Save Changes"}
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
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
    justifyContent: "center"
  },
  keyboardView: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 32
  },
  form: {
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2
  },
  piecesCard: {
    borderRadius: 12,
    padding: 16,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2
  },
  piecesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8
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
  emptyText: {
    fontSize: 13,
    opacity: 0.45,
    marginVertical: 8
  },
  pieceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 8
  },
  pieceLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  pieceInfo: {
    flex: 1,
    gap: 2
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1.5,
    borderColor: "#0a7ea4",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 3
  },
  stepperButton: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  stepperValue: {
    fontSize: 13,
    minWidth: 16,
    textAlign: "center",
    color: "#0a7ea4"
  },
  pieceDesc: {
    fontSize: 12,
    opacity: 0.5
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
  field: {
    gap: 6
  },
  label: {
    fontSize: 14
  },
  optional: {
    fontSize: 13,
    opacity: 0.45,
    fontWeight: "400"
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16
  },
  multiline: {
    paddingTop: 10,
    minHeight: 80,
    textAlignVertical: "top"
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
