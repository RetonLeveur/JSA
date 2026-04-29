import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  add_hebdomadaire,
  get_hebdomadaire,
  new_hebdomadaire,
  remove_hebdomadaire_machine,
  update_hebdomadaire_amount
} from "@/database/queries/hebdomadaire";
import { HebdomadaireList } from "@/types/hebdomadaire";
import { Machine } from "@/types/machine";

export const useHebdomadaire = () =>
  useQuery({ queryKey: ["hebdomadaire"], queryFn: get_hebdomadaire });

export const useNewHebdomadaire = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ date, list }: { date: string; list: HebdomadaireList[] }) =>
      new_hebdomadaire(date, list),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hebdomadaire"] })
  });
};

export const useUpdateHebdomadaireAmount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ machineId, amount }: { machineId: number; amount: number }) =>
      update_hebdomadaire_amount(machineId, amount),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hebdomadaire"] })
  });
};

export const useAddHebdomadaireMachine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ machine, amount }: { machine: Machine; amount?: number }) =>
      add_hebdomadaire(machine, amount ?? 0),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hebdomadaire"] })
  });
};

export const useRemoveHebdomadaireMachine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (machineId: number) => remove_hebdomadaire_machine(machineId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hebdomadaire"] })
  });
};
