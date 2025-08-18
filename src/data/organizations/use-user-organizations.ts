import { useAction } from "convex/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";

export const useUserOrganizations = () => {
  const userOrganizationFetch = useAction(api.workos.getUserOrganizations);

  return useQuery({
    queryKey: ["user-organizations"],
    queryFn: async () => {
      const userOrganizations = await userOrganizationFetch();
      return userOrganizations;
    },
  });
};