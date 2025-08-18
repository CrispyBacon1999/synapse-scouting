import {
  AppShell,
  Burger,
  Button,
  Container,
  Flex,
  Paper,
} from "@mantine/core";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAuth } from "@workos-inc/authkit-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { EventPicker } from "../components/navigation/event-picker";
import { useDisclosure } from "@mantine/hooks";
import { Navbar } from "../components/navigation/navbar";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <>
      <Authenticated>
        <AppShell
          padding="md"
          header={{ height: 60 }}
          navbar={{
            width: 150,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
        >
          <AppShell.Header
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Flex align="center" gap="md" px="sm">
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <EventPicker />
            </Flex>
          </AppShell.Header>
          <AppShell.Navbar>
            <Navbar />
          </AppShell.Navbar>
          <AppShell.Main>
            <Outlet />
          </AppShell.Main>
        </AppShell>
        <TanStackRouterDevtools />
      </Authenticated>
      <Unauthenticated>
        <RequiresLoginScreen />
      </Unauthenticated>
    </>
  );
}

function RequiresLoginScreen() {
  const { signIn } = useAuth();

  return (
    <Container>
      <Paper>
        <Flex direction="column" align="start">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Please log in
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            You must be logged in to access this page.
          </p>
          <Button onClick={() => signIn()}>Log in</Button>
        </Flex>
      </Paper>
    </Container>
  );
}
