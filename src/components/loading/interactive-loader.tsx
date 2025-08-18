import { Center, Flex, Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export const InteractiveLoader = ({
  loadingStrings,
  timeToLastString,
}: {
  loadingStrings: string[];
  timeToLastString: number;
}) => {
  const [currentStringIndex, setCurrentStringIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStringIndex((prev) => {
        if (prev === loadingStrings.length - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, timeToLastString);

    return () => clearInterval(interval);
  }, [loadingStrings, timeToLastString]);

  return (
    <Center>
      <Flex direction="column" gap="xs" align="center">
        <Loader type="dots" size="lg" />
        <Text size="lg">{loadingStrings[currentStringIndex]}</Text>
      </Flex>
    </Center>
  );
};
