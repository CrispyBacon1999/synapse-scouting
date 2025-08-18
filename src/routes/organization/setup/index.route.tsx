import {
  Alert,
  Button,
  Container,
  Flex,
  Paper,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TeamTypeButton } from "../../../components/button/team-type-button";
import { api } from "../../../../convex/_generated/api";
import { useAction } from "convex/react";
import { InteractiveLoader } from "../../../components/loading/interactive-loader";
import { useUserOrganizations } from "../../../data/organizations/use-user-organizations";
import { OrganizationPicker } from "../../../components/navigation/organization-picker";

export const Route = createFileRoute("/organization/setup/")({
  component: RouteComponent,
});

const loadingStrings = [
  "Grabbing your team information...",
  "Setting up your workspace...",
  "Making sure everything is in order...",
  "Almost there...",
];

function RouteComponent() {
  const colorScheme = useColorScheme();

  const [selectedTeamType, setSelectedTeamType] = useState<
    "FRC" | "FTC" | undefined
  >(undefined);
  const [teamNumber, setTeamNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const createTeamAction = useAction(api.organization.create);
  const navigate = useNavigate();

  const existingOrganizations = useUserOrganizations();

  const createTeam = async () => {
    const teamNumberInt = parseInt(teamNumber);
    if (isNaN(teamNumberInt)) {
      return;
    }

    setIsLoading(true);

    try {
      const createTeamResult = await createTeamAction({
        teamNumber: teamNumberInt,
        type: selectedTeamType === "FRC" ? "frc" : "ftc",
      });

      navigate({
        to: "/organization/setup/success",
        search: { orgId: createTeamResult },
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
    }
  };

  return (
    <Container size="sm">
      <Paper withBorder p="md" shadow="sm">
        <Flex direction="column" gap="md">
          <Flex direction="column">
            <Text size="lg" fw={500}>
              Welcome to Synapse!
            </Text>
            <Text size="lg" fw={500}>
              Let's get you set up with a team.
            </Text>
          </Flex>
          {existingOrganizations.data &&
            existingOrganizations.data.length > 0 && (
              <Alert
                variant="light"
                title="Heads up!"
                color="orange"
                mt="lg"
                mb="lg"
                p="lg"
              >
                <>
                  <Text size="lg">
                    Looks like you already have a team set up, switch to it?
                  </Text>

                  <OrganizationPicker
                    postChange={(org) => {
                      navigate({
                        to: "/organization/setup/success",
                        search: { orgId: org.id },
                      });
                    }}
                  />
                </>
              </Alert>
            )}
          <Text size="md" fw={500}>
            First off, what type of team are you?
          </Text>
          <SimpleGrid cols={2} spacing="md">
            <TeamTypeButton
              onClick={() => setSelectedTeamType("FRC")}
              type="FRC"
              selected={selectedTeamType === "FRC"}
            >
              <img
                src={
                  colorScheme === "dark"
                    ? "/assets/logos/FRC_dark.png"
                    : "/assets/logos/FRC_light.png"
                }
                alt="FIRST Robotics Competition"
                style={{ width: "80%" }}
              />
            </TeamTypeButton>
            <TeamTypeButton
              onClick={() => setSelectedTeamType("FTC")}
              type="FTC"
              selected={selectedTeamType === "FTC"}
            >
              <img
                src={
                  colorScheme === "dark"
                    ? "/assets/logos/FTC_dark.png"
                    : "/assets/logos/FTC_light.png"
                }
                alt="FIRST Tech Challenge"
                style={{ width: "80%" }}
              />
            </TeamTypeButton>
          </SimpleGrid>
          <TextInput
            label="Team Number"
            placeholder="1234"
            value={teamNumber}
            onChange={(e) => setTeamNumber(e.target.value)}
          />
          <Button
            disabled={!teamNumber || !selectedTeamType}
            onClick={createTeam}
            loading={isLoading}
          >
            Continue
          </Button>

          {isLoading && (
            <InteractiveLoader
              loadingStrings={loadingStrings}
              timeToLastString={1000}
            />
          )}
        </Flex>
      </Paper>
    </Container>
  );
}
