import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createForm = mutation({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const organization = await ctx.db.query("organizations").filter((q) => q.eq(q.field("workos_id"), user.org_id)).first();

    if (!organization) {
      throw new Error("Organization not found");
    }

    if (!organization.currentEvent) {
      throw new Error("No current event");
    }

    const existingForm = await ctx.db.query("forms").filter((q) => q.and(q.eq(q.field("organizationId"), organization._id), q.eq(q.field("eventId"), organization.currentEvent))).first();

    if (existingForm) {
      return existingForm;
    }

    const form = await ctx.db.insert("forms", {
      eventId: organization.currentEvent,
      organizationId: organization._id,
    });

    return form;
  },
});

export const updateForm = mutation({
  args: {
    formId: v.id("forms"),
    formData: v.string()
  },
  handler: async (ctx, args) => {
    const form = await ctx.db.get(args.formId);
    if (!form) {
      throw new Error("Form not found");
    }

    // Ensure the user has permissions to write to this form
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const organization = await ctx.db.query("organizations").filter((q) => q.eq(q.field("workos_id"), user.org_id)).first();

    if (!organization) {
      throw new Error("Organization not found");
    }

    if (form.organizationId !== organization._id) {
      throw new Error("You do not have permission to update this form");
    }

    if (!user.permissions.includes("forms:edit")) {
      throw new Error("You do not have permission to update this form");
    }

    await ctx.db.patch(args.formId, { formData: args.formData });
  }
})

export const activeForm = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const organization = await ctx.db.query("organizations").filter((q) => q.eq(q.field("workos_id"), user.org_id)).first();

    if (!organization) {
      throw new Error("Organization not found");
    }

    const form = await ctx.db.query("forms").filter((q) => q.and(q.eq(q.field("organizationId"), organization._id), q.eq(q.field("eventId"), organization.currentEvent))).first();

    if (!form) {
      return null;
    }

    return form;
  }
})