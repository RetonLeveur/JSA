import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { initDB } from "@/database/database";

const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: "(tabs)"
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDB().then(() => setDbReady(true));
  }, []);

  if (!dbReady) return <View style={{ flex: 1 }} />;

  return (
    <SafeAreaProvider>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="pieces/[id]" options={{ title: "Piece Details" }} />
        <Stack.Screen
          name="pieces/add"
          options={{ presentation: "modal", title: "Add Piece" }}
        />
        <Stack.Screen
          name="pieces/edit"
          options={{ presentation: "modal", title: "Edit Piece" }}
        />
        <Stack.Screen name="machines/[id]" options={{ title: "Machine Details" }} />
        <Stack.Screen
          name="machines/add"
          options={{ presentation: "modal", title: "Add Machine" }}
        />
        <Stack.Screen
          name="machines/edit"
          options={{ presentation: "modal", title: "Edit Machine" }}
        />
        <Stack.Screen
          name="hebdomadaire/new"
          options={{ presentation: "modal", title: "New Hebdomadaire" }}
        />
        <Stack.Screen
          name="hebdomadaire/add-machine"
          options={{ presentation: "modal", title: "Add Machine" }}
        />
        <Stack.Screen
          name="hebdomadaire/report"
          options={{ presentation: "modal", title: "Report" }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </QueryClientProvider>
    </SafeAreaProvider>
  );
}
