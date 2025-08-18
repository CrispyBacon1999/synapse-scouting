import { query } from "./_generated/server";

export const listEvents = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    console.log(auth);
    if (!auth) return [];

    const organization = await ctx.db.query("organizations").filter((q) => q.eq(q.field("workos_id"), auth.org_id)).first();
    if (!organization) return [];
    if (!organization.events || organization.events.length === 0) {
      return [];
    }

    const events = await Promise.all(
      organization.events.map((eventId) => ctx.db.get(eventId))
    );

    return events.filter((event): event is NonNullable<typeof event> => event !== null);
  }
})