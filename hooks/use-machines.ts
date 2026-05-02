import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  create_machine,
  delete_machine,
  get_machine,
  get_machines,
  update_machine
} from "@/database/queries/machine";
import { Machine } from "@/types/machine";

export const useMachines = () =>
  useQuery({ queryKey: ["machines"], queryFn: get_machines });

export const useMachine = (id: number) =>
  useQuery({ queryKey: ["machines", id], queryFn: () => get_machine(id) });

export const useCreateMachine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (machine: Omit<Machine, "id">) => create_machine(machine),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      queryClient.invalidateQueries({ queryKey: ["hebdomadaire"] });
    }
  });
};

export const useUpdateMachine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (machine: Machine & { id: number }) => update_machine(machine),
    onSuccess: (_, machine) => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      queryClient.invalidateQueries({ queryKey: ["machines", machine.id] });
      queryClient.invalidateQueries({ queryKey: ["hebdomadaire"] });
    }
  });
};

export const useDeleteMachine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => delete_machine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      queryClient.invalidateQueries({ queryKey: ["hebdomadaire"] });
    }
  });
};
