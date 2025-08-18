import { Flex, Paper } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { EventTimeline } from "../components/event/event-timeline";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Flex>
      <Paper>
        <EventTimeline />
      </Paper>
    </Flex>
  );
}
