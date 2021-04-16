import type { Meta, Story } from "@storybook/react";

import type { IChampionAffinity } from "../../models";

import AffinityDisplay from "./AffinityDisplay";

export default {
  title: "UI/AffinityDisplay",
  component: AffinityDisplay,
} as Meta;

export const Base: Story<{
  affinity: IChampionAffinity;
  width?: number;
}> = (args) => {
  return <AffinityDisplay {...args} />;
};

Base.argTypes = {
  width: {
    defaultValue: "50",
    control: {
      type: "select",
      options: ["", "50", "200"],
    },
  },
  affinity: {
    defaultValue: "Force",
    control: {
      type: "select",
      options: ["Force", "Magic", "Spirit", "Void"],
    },
  },
};

export const Force = (): JSX.Element => (
  <AffinityDisplay affinity="Force" width={50} />
);
export const Magic = (): JSX.Element => (
  <AffinityDisplay affinity="Magic" width={50} />
);
export const Spirit = (): JSX.Element => (
  <AffinityDisplay affinity="Spirit" width={50} />
);
export const Void = (): JSX.Element => (
  <AffinityDisplay affinity="Void" width={50} />
);
