import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePiece, useUpdatePiece } from "@/hooks/use-pieces";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function EditPiece() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pieceId = Number(id);

  const { data: piece, isLoading } = usePiece(pieceId);
  const { mutate: updatePiece, isPending } = useUpdatePiece();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (piece) {
      setName(piece.name);
      setDescription(piece.description ?? "");
    }
  }, [piece]);

  const inputBg = useThemeColor({ light: "#f2f2f7", dark: "#2c2c2e" }, "background");
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const placeholderColor = useThemeColor({ light: "#aaa", dark: "#666" }, "text");

  const handleSubmit = () => {
    if (!name.trim()) return;
    updatePiece(
      { id: pieceId, name: name.trim(), description: description.trim() || undefined },
      { onSuccess: () => router.back() }
    );
  };

  return (
    <SafeAreaProvider>
      <Stack.Screen options={{ title: "Edit Piece" }} />
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
                  placeholder="Piece name"
                  placeholderTextColor={placeholderColor}
                  value={name}
                  onChangeText={setName}
                  autoFocus
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
            </ThemedView>

            <View style={styles.footer}>
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
            </View>
          </KeyboardAvoidingView>
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
    justifyContent: "center"
  },
  keyboardView: {
    flex: 1,
    justifyContent: "space-between"
  },
  form: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    gap: 16,
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
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16
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
