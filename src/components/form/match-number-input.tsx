import { Input } from "@mantine/core";
import { v } from "convex/values";

export const matchNumberInputDbSchema = v.object({
  type: v.literal("matchNumber"),
  row: v.number(),
  col: v.number(),
  rowSpan: v.optional(v.number()),
  colSpan: v.optional(v.number()),
});

export const MatchNumberInput = () => {
  return <Input />;
};
