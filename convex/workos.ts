"use node";
import { WorkOS } from "@workos-inc/node";
import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";

export const createOrganizationInWorkos = internalAction({
  args: {
    name: v.string(),
    organizationType: v.union(v.literal("frc"), v.literal("ftc")),
  },
  handler: async (_, args) => {
    const workos = new WorkOS(process.env.WORKOS_SECRET_KEY!);

    const organization = await workos.organizations.createOrganization({
      name: args.name,
      metadata: {
        type: args.organizationType,
      }
    });

    return organization;
  }
});

export const assignUserToOrganization = internalAction({
  args: {
    organizationId: v.string(),
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (_, args) => {
    const workos = new WorkOS(process.env.WORKOS_SECRET_KEY!);

    await workos.userManagement.createOrganizationMembership({
      organizationId: args.organizationId,
      userId: args.userId,
      roleSlug: args.role,
    });
  }
})

export const inviteUserToOrganization = action({
  args: {
    organizationId: v.id("organizations"),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const callingUser = await ctx.auth.getUserIdentity();
    if (!callingUser) {
      throw new Error("User not authenticated");
    }

    if (!callingUser.org_id) {
      throw new Error("User is not in an organization");
    }

    if (!callingUser.permissions.includes("organization:invite")) {
      throw new Error("User does not have permission to invite users");
    }

    const workos = new WorkOS(process.env.WORKOS_SECRET_KEY!);

    await workos.userManagement.sendInvitation({
      organizationId: args.organizationId,
      email: args.email,
      expiresInDays: args.role === "admin" ? 1 : 7,
      roleSlug: args.role,
    });
  }
})

export const assignUserToRole = action({
  args: {
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    // Check if the calling user has permission to assign roles
    const callingUser = await ctx.auth.getUserIdentity();
    if (!callingUser) {
      throw new Error("User not authenticated");
    }

    if (callingUser.userId === args.userId) {
      throw new Error("You cannot assign roles to yourself");
    }

    if (!callingUser.org_id) {
      throw new Error("User is not in an organization");
    }

    if (!callingUser.permissions.includes("organization:manage")) {
      throw new Error("User does not have permission to assign roles");
    }

    const workos = new WorkOS(process.env.WORKOS_SECRET_KEY!);

    const organizationMembership = await workos.userManagement.listOrganizationMemberships({
      organizationId: callingUser.org_id,
      userId: args.userId,
    });

    if (!organizationMembership.data.length) {
      throw new Error("User is not a member of the organization");
    }

    await workos.userManagement.updateOrganizationMembership(organizationMembership.data[0].id, {
      roleSlug: args.role,
    });
  }
})

export const getUserOrganizations = action({
  handler: async (ctx) => {
    const callingUser = await ctx.auth.getUserIdentity();

    if (!callingUser) {
      throw new Error("User not authenticated");
    }

    const workos = new WorkOS(process.env.WORKOS_SECRET_KEY!);

    const organizations = await workos.userManagement.listOrganizationMemberships({
      userId: callingUser.subject,
    });

    return organizations.data.map((organization) => ({
      id: organization.organizationId,
      name: organization.organizationName
    }));
  }
})