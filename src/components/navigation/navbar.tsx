import { Button, Divider, Flex } from "@mantine/core";
import { Link, useLocation } from "@tanstack/react-router";
import {
  CalendarIcon,
  ClipboardIcon,
  DatabaseIcon,
  SettingsIcon,
} from "lucide-react";

export const Navbar = () => {
  // Current page for highlighting
  const currentPage = useLocation().pathname;

  return (
    <Flex
      style={{ width: "100%" }}
      direction="column"
      p="xs"
      align="flex-start"
    >
      <Button
        justify="flex-start"
        fullWidth
        component={Link}
        to="/"
        variant="transparent"
        leftSection={<CalendarIcon size={16} />}
        color={currentPage === "/" ? "blue" : "gray"}
        size="xs"
      >
        Event
      </Button>
      <Button
        justify="flex-start"
        fullWidth
        component={Link}
        to="/forms"
        variant="transparent"
        leftSection={<ClipboardIcon size={16} />}
        color={currentPage.startsWith("/forms") ? "blue" : "gray"}
        size="xs"
      >
        Forms
      </Button>
      <Button
        justify="flex-start"
        fullWidth
        component={Link}
        to="/data"
        variant="transparent"
        leftSection={<DatabaseIcon size={16} />}
        color={currentPage.startsWith("/data") ? "blue" : "gray"}
        size="xs"
      >
        Data
      </Button>
      <Divider my="xs" />
      <Button
        justify="flex-start"
        fullWidth
        component={Link}
        to="/settings"
        variant="transparent"
        leftSection={<SettingsIcon size={16} />}
        color={currentPage.startsWith("/settings") ? "blue" : "gray"}
        size="xs"
      >
        Settings
      </Button>
    </Flex>
  );
};
