import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import { useEffect } from "react";

export const Route = createFileRoute("/sign-out")({
  component: RouteComponent,
});

function RouteComponent() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut();
  }, []);

  return null;
}
