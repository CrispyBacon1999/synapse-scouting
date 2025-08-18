import { useAuth } from "@workos-inc/authkit-react";

export const useFeatureFlag = (flagName: string) => {
  const { featureFlags } = useAuth();

  console.log(featureFlags);

  return featureFlags.includes(flagName);
}