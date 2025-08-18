import { v } from "convex/values";
import { internalAction, query } from "./_generated/server";
import type { TbaTeamSimple } from "../src/types/tba/team";

export const getTeamSimple = internalAction({
  args: {
    teamNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const response = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${args.teamNumber}/simple`, {
      headers: {
        "X-TBA-Auth-Key": process.env.TBA_API_KEY!,
      },
    });

    const data = await response.json() as TbaTeamSimple;
    return data;
  }
})