import { Button, Flex, Text, Timeline } from "@mantine/core";
import { useMutation, useQuery } from "convex/react";
import {
  BotIcon,
  ClipboardEditIcon,
  ClipboardPlusIcon,
  ScanQrCodeIcon,
} from "lucide-react";
import { useMemo } from "react";
import { api } from "../../../convex/_generated/api";
import { Link } from "@tanstack/react-router";

export const EventTimeline = () => {
  const event = useQuery(api.organization.getActiveEvent);
  const form = useQuery(api.forms.activeForm);
  // const matchSchedule = useQuery(api.matches.getMatchSchedule);

  console.log(form);

  const createFormMutation = useMutation(api.forms.createForm);

  const eventProgress = useMemo(() => {
    if (!form) {
      return 0;
    }

    if (!form.formData) {
      return 1;
    }

    return 0;
  }, [event, form]);

  return (
    <Timeline active={eventProgress}>
      <Timeline.Item bullet={<ClipboardPlusIcon />} title="Create Form">
        <Flex gap="xs" direction="column" align="flex-start">
          <Text c="dimmed">Create a form to have your scouters fill out</Text>
          <Button
            disabled={eventProgress !== 0}
            onClick={() => {
              createFormMutation({});
            }}
          >
            Create Form for Event
          </Button>
        </Flex>
      </Timeline.Item>
      <Timeline.Item bullet={<ClipboardEditIcon />} title="Design Form">
        {eventProgress <= 1 && (
          <Flex gap="xs" direction="column" align="flex-start">
            <Text c="dimmed">
              Design your form layout, use a template, or use one of your forms
              from another event.
            </Text>
            <Button
              component={Link}
              to="/form/edit"
              disabled={eventProgress < 1}
            >
              Design Form
            </Button>
          </Flex>
        )}
      </Timeline.Item>
      <Timeline.Item bullet={<BotIcon />} title="Pull Match Schedule">
        <Flex gap="xs" direction="column" align="flex-start">
          <Text c="dimmed">Pull the event match schedule</Text>
          <Button disabled={eventProgress < 2}>Pull Match Schedule</Button>
        </Flex>
      </Timeline.Item>
      <Timeline.Item bullet={<ScanQrCodeIcon />} title="Scan Match Results">
        <Flex gap="xs" direction="column" align="flex-start">
          <Text c="dimmed">
            Scan the QR codes from scouters to get their scouting data
          </Text>
          <Button component={Link} to="/scan" disabled={eventProgress < 3}>
            Scan Match Results
          </Button>
        </Flex>
      </Timeline.Item>
    </Timeline>
  );
};
