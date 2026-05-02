import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  create_piece,
  delete_piece,
  get_piece,
  get_pieces,
  update_piece
} from "@/database/queries/piece";
import { Piece } from "@/types/piece";

export const usePieces = () =>
  useQuery({ queryKey: ["pieces"], queryFn: get_pieces });

export const usePiece = (id: number) =>
  useQuery({ queryKey: ["pieces", id], queryFn: () => get_piece(id) });

export const useCreatePiece = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (piece: Omit<Piece, "id">) => create_piece(piece),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pieces"] });
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      queryClient.invalidateQueries({ queryKey: ["hebdomadaire"] });
    }
  });
};

export const useUpdatePiece = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (piece: Piece) => update_piece(piece),
    onSuccess: (_, piece) => {
      queryClient.invalidateQueries({ queryKey: ["pieces"] });
      queryClient.invalidateQueries({ queryKey: ["pieces", piece.id] });
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      queryClient.invalidateQueries({ queryKey: ["hebdomadaire"] });
    }
  });
};

export const useDeletePiece = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => delete_piece(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pieces"] });
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      queryClient.invalidateQueries({ queryKey: ["hebdomadaire"] });
    }
  });
};
