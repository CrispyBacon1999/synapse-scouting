import { Select } from "@mantine/core";
import { useUserOrganizations } from "../../data/organizations/use-user-organizations";
import { useAuth } from "@workos-inc/authkit-react";

export const OrganizationPicker = ({
  postChange,
}: {
  postChange?: (value: { id: string; name: string }) => void;
}) => {
  const auth = useAuth();
  const userOrganizations = useUserOrganizations();

  return (
    <Select
      data={
        userOrganizations.data?.map((org) => ({
          value: org.id,
          label: org.name,
        })) ?? []
      }
      placeholder="Select a team"
      searchable
      onChange={(value) => {
        if (value) {
          auth.switchToOrganization({ organizationId: value });
          if (postChange) {
            postChange(
              userOrganizations.data?.find((org) => org.id === value) ?? {
                id: "",
                name: "",
              }
            );
          }
        }
      }}
    />
  );
};
