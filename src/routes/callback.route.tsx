import { Center, Loader, Text } from "@mantine/core";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import { useEffect } from "react";

export const Route = createFileRoute("/callback")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const user = useAuth();

  useEffect(() => {
    if (!user.organizationId) {
      navigate({ to: "/organization/setup" });
    } else {
      navigate({ to: "/" });
    }
  }, [user.organizationId, navigate]);

  return (
    <Center>
      <Loader />
      <Text>Logging in...</Text>
    </Center>
  );
}
