import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import type { ToaTeam } from "../src/types/toa/team";

export const getTeam = internalAction({
  args: {
    teamNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const response = await fetch(`https://theorangealliance.org/api/team/${args.teamNumber}`, {
      headers: {
        "X-Application-Origin": "Synapse",
        "X-TOA-Key": process.env.TOA_API_KEY!,
      },
    });

    const data = await response.json() as ToaTeam[];

    if (data.length === 0) {
      throw new Error("Team not found");
    }

    return data[0];
  }
})