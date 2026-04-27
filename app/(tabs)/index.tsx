import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Hebdomadaire, HebdomadaireList } from "@/types/hebdomadaire";

const temp: Hebdomadaire = {
  date: "2026-04-26",
  machines: [
    {
      machines: {
        id: 1,
        name: "Machine 1",
        description: "Description of Machine 1",
        pieces: []
      },
      amount: 3
    },
    {
      machines: {
        id: 2,
        name: "Machine 2",
        description: "Description of Machine 2",
        pieces: []
      },
      amount: 1
    },
    {
      machines: {
        id: 3,
        name: "Machine 3",
        description: "Description of Machine 3",
        pieces: []
      },
      amount: 5
    },
    {
      machines: {
        id: 4,
        name: "Machine 4",
        description: "Description of Machine 4",
        pieces: []
      },
      amount: 2
    },
    {
      machines: {
        id: 5,
        name: "Machine 5",
        description: "Description of Machine 5",
        pieces: []
      },
      amount: 4
    }
  ]
};

function AmountStepper({ amount }: { amount: number }) {
  return (
    <View style={styles.stepper}>
      <TouchableOpacity style={styles.stepperButton} onPress={() => {}}>
        <IconSymbol name="minus" size={16} color="#0a7ea4" />
      </TouchableOpacity>
      <ThemedText type="defaultSemiBold" style={styles.stepperValue}>
        {amount}
      </ThemedText>
      <TouchableOpacity style={styles.stepperButton} onPress={() => {}}>
        <IconSymbol name="plus" size={16} color="#0a7ea4" />
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.header}>
          <View>
            <ThemedText type="title">Hebdomadaire</ThemedText>
            <ThemedText style={styles.meta}>
              {temp.date} · {temp.machines.length} items
            </ThemedText>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => {}} style={styles.refreshButton}>
              <IconSymbol name="arrow.clockwise" size={18} color="#0a7ea4" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} style={styles.reportButton}>
              <IconSymbol name="doc.text" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </ThemedView>
        <FlatList
          data={temp.machines}
          keyExtractor={(item: HebdomadaireList) =>
            item.machines.id!.toString()
          }
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }: { item: HebdomadaireList }) => (
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
              <AmountStepper amount={item.amount} />
            </ThemedView>
          )}
          ListFooterComponent={() => (
            <TouchableOpacity onPress={() => {}} style={styles.addButton}>
              <IconSymbol name="plus" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        />
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
