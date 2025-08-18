import "convex/server";

declare module "convex/server" {
  export interface UserIdentity {
    tokenIdentifier: string,
    issuer: string,
    subject: string,
    feature_flags: string[],
    email: string,
    name: string,
    picture: string,
    sid: string;
    permissions: string[];
    org_id?: string;
  }
}