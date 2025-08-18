import { useMantineTheme } from "@mantine/core";
import type { ReactNode } from "react";
import { cva } from "class-variance-authority";
import classes from "./team-type-button.module.css";

const variants = cva([classes.base], {
  variants: {
    program: {
      FRC: [classes.FRC],
      FTC: [classes.FTC],
    },
    selected: {
      true: [classes.selected],
    },
  },
  compoundVariants: [
    {
      program: "FRC",
      selected: true,
      class: classes.FRCSelected,
    },
    {
      program: "FTC",
      selected: true,
      class: classes.FTCSelected,
    },
  ],
});

export const TeamTypeButton = ({
  children,
  onClick,
  type,
  selected,
}: {
  children: ReactNode;
  onClick: () => void;
  type: "FRC" | "FTC";
  selected: boolean;
}) => {
  const theme = useMantineTheme();

  return (
    <button onClick={onClick} className={variants({ program: type, selected })}>
      {children}
    </button>
  );
};
