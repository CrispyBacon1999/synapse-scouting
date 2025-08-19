import { Select } from "@mantine/core";
import { useFeatureFlag } from "~/util/feature-flags/useFeatureFlag";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { useAuth } from "@workos-inc/authkit-react";

export const EventPicker = () => {
  const isFeatureFlagEnabled = useFeatureFlag("event-picker");
  const auth = useAuth();
  const eventList = useQuery(api.events.listEvents);
  const activeEvent = useQuery(api.organization.getActiveEvent);
  const setActiveEvent = useMutation(api.organization.setActiveEvent);

  if (!isFeatureFlagEnabled) return null;
  if (!auth.organizationId) return null;

  return (
    <Select
      searchable
      placeholder="Pick an event"
      allowDeselect
      data={
        eventList?.map((event) => ({
          value: event._id,
          label: event.name,
        })) || []
      }
      value={activeEvent?._id}
      onChange={(value) => {
        setActiveEvent({ eventId: (value as Id<"events">) ?? undefined });
      }}
    />
  );
};
