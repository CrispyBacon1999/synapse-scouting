import { Input } from "@mantine/core";
import { v } from "convex/values";

export const teamNumberInputDbSchema = v.object({
  type: v.literal("teamNumber"),
  row: v.number(),
  col: v.number(),
  rowSpan: v.optional(v.number()),
  colSpan: v.optional(v.number()),
});

export const TeamNumberInput = () => {
  return <Input />;
};
