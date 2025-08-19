import { v } from "convex/values";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import type { TbaTeamSimple } from "../src/types/tba/team";
import type { ToaTeam } from "../src/types/toa/team";
import type { Organization } from "@workos-inc/node";

export const getByWorkosId = query({
  args: {
    workosId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("organizations").filter((q) => q.eq(q.field("workos_id"), args.workosId)).first();
  },
})

export const getActiveEvent = query({

  handler: async (ctx) => {
    const callingUser = await ctx.auth.getUserIdentity();
    if (!callingUser) {
      throw new Error("User not authenticated");
    }

    const organization = await ctx.db.query("organizations").filter((q) => q.eq(q.field("workos_id"), callingUser.org_id)).first();

    if (!organization) {
      return null;
    }

    if (!organization.currentEvent) {
      return null;
    }

    const event = await ctx.db.get(organization.currentEvent);
    return event;
  },
})

export const setActiveEvent = mutation({
  args: {
    eventId: v.optional(v.id("events")),
  },
  handler: async (ctx, args) => {

    const callingUser = await ctx.auth.getUserIdentity();
    if (!callingUser) {
      throw new Error("User not authenticated");
    }

    const organization = await ctx.db.query("organizations").filter((q) => q.eq(q.field("workos_id"), callingUser.org_id)).first();

    if (!organization) {
      throw new Error("Organization not found");
    }

    return await ctx.db.patch(organization._id, { currentEvent: args.eventId ?? undefined });
  },
})

export const create = action({
  args: {
    teamNumber: v.number(),
    type: v.union(v.literal("frc"), v.literal("ftc")),
  },
  handler: async (ctx, args) => {

    const callingUser = await ctx.auth.getUserIdentity();
    if (!callingUser) {
      throw new Error("User not authenticated");
    }

    let teamName: string | undefined = undefined;
    if (args.type === "frc") {
      const tbaTeam: TbaTeamSimple = await ctx.runAction(internal.tba.getTeamSimple, {
        teamNumber: args.teamNumber,
      });
      teamName = tbaTeam.nickname;
    } else {
      const toaTeam: ToaTeam = await ctx.runAction(internal.toa.getTeam, {
        teamNumber: args.teamNumber,
      });
      teamName = toaTeam.team_name_short;
    }

    console.log("teamName", teamName);

    const newWorkosOrg: Organization = await ctx.runAction(internal.workos.createOrganizationInWorkos, {
      name: teamName,
      organizationType: args.type,
    });

    console.log("newWorkosOrg", newWorkosOrg);

    const convexOrg = await ctx.runMutation(internal.organization.createOrganization, {
      workosId: newWorkosOrg.id,
      name: teamName,
      organizationType: args.type,
    });

    console.log("convexOrg", convexOrg);

    await ctx.runAction(internal.workos.assignUserToOrganization, {
      organizationId: newWorkosOrg.id,
      userId: callingUser.subject,
      role: "admin",
    });

    return newWorkosOrg.id;
  }
})

export const createOrganization = internalMutation({
  args: {
    workosId: v.string(),
    name: v.string(),
    organizationType: v.union(v.literal("frc"), v.literal("ftc")),
  },
  handler: async (ctx, args) => {
    const organization = await ctx.runQuery(api.organization.getByWorkosId, {
      workosId: args.workosId,
    });

    if (organization) {
      throw new Error("Organization already exists");
    }

    return await ctx.db.insert("organizations", {
      workos_id: args.workosId,
      name: args.name,
      organizationType: args.organizationType,
      events: [],
    });
  },
});
