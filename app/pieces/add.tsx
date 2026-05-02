import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useCreatePiece } from "@/hooks/use-pieces";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function AddPiece() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [estimateTime, setEstimateTime] = useState("");

  const { mutate: createPiece, isPending } = useCreatePiece();

  const inputBg = useThemeColor({ light: "#f2f2f7", dark: "#2c2c2e" }, "background");
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const placeholderColor = useThemeColor({ light: "#aaa", dark: "#666" }, "text");

  const handleSubmit = () => {
    if (!name.trim()) return;
    const parsedTime = parseInt(estimateTime, 10);
    createPiece(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        estimate_time: Number.isFinite(parsedTime) ? parsedTime : undefined
      },
      { onSuccess: () => router.back() }
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "Add Piece" }} />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
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
                placeholder="e.g. 5"
                placeholderTextColor={placeholderColor}
                value={estimateTime}
                onChangeText={setEstimateTime}
                keyboardType="numeric"
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
                {isPending ? "Saving…" : "Add Piece"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
