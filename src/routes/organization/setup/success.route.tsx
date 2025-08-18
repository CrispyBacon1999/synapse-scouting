import { Container, Paper, Text } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import { useEffect } from "react";
import { LinkButton } from "~/components/button/link-button";

export const Route = createFileRoute("/organization/setup/success")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      orgId: search.orgId as string,
    };
  },
});

function RouteComponent() {
  const { orgId } = Route.useSearch();

  const auth = useAuth();

  useEffect(() => {
    auth.switchToOrganization({ organizationId: orgId });
  });

  return (
    <Container>
      <Paper withBorder p="md" shadow="sm">
        <Text size="lg">All set!</Text>
        <Text>You're all ready to get scouting!</Text>
        <LinkButton to="/">Get Started</LinkButton>
      </Paper>
    </Container>
  );
}
