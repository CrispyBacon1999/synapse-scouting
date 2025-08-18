import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organizations: defineTable({
    currentEvent: v.optional(v.id("events")),
    name: v.string(),
    organizationType: v.union(v.literal("frc"), v.literal("ftc")),
    workos_id: v.string(),
    events: v.array(v.id("events")),
  }).index("by_workos_id", ["workos_id"]),
  events: defineTable({
    eventKey: v.string(),
    eventType: v.union(v.literal("frc"), v.literal("ftc")),
    name: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  }),
  matches: defineTable({
    blue1: v.number(),
    blue2: v.number(),
    blue3: v.optional(v.number()),
    red1: v.number(),
    red2: v.number(),
    red3: v.optional(v.number()),
    eventKey: v.string(),
    matchLevel: v.union(v.literal("q"), v.literal("p")),
    matchNumber: v.number(),
  }).index("by_event", ["eventKey"]),
  forms: defineTable({
    organizationId: v.id("organizations"),
    eventId: v.id("events"),
    formData: v.optional(v.string())
  })
})