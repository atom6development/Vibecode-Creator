// src/hooks/queries/useUsers.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, getUser, getUsers } from "@/lib/api/users";

export const userKeys = {
  all: ["users"],
  detail: (id) => ["users", id],
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: getUsers,
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}
