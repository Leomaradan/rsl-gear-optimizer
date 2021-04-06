import ChampionDisplay from "./ChampionDisplay";

import type {
  IAura,
  IChampion,
  IChampionAffinity,
  IChampionRole,
  IClans,
  IRarity,
  IStars,
} from "../../models";
import { SortedExistingClans } from "../../data/Clans";
import { ILanguageClan, dictionaryList } from "../../lang/language";

import type { Meta, Story } from "@storybook/react";

const listClans = SortedExistingClans.map((s) => ({
  text: dictionaryList.en.clan[s as keyof ILanguageClan],
  value: s,
}));

const Auras: Record<string, IAura> = {
  Attack: {
    type: "ATK",
  },
  "Critical Rate": {
    type: "C.RATE",
  },
  Defense: {
    type: "DEF",
  },
  HP: {
    type: "HP",
  },
  Resistance: {
    type: "RESI",
  },
  Speed: {
    type: "SPD",
  },
};

const championFactory = (options: {
  Name: string;
  Quality: IStars;
  Awaken: IStars;
  Level: number;
  Clan: string;
  Rarity: IRarity;
  Role: IChampionRole;
  Affinity: IChampionAffinity;
  Aura: string;
  InVault: boolean;
}): IChampion => {
  return {
    ...options,
    Clan: listClans.find((c) => c.text === options.Clan)?.value as IClans,
    Aura: Auras[options.Aura],
    Guid: options.Name,
    Slug: "storybook",
    Masteries: [],
    Power: 0,
    BaseAccuracy: 0,
    BaseAttack: 0,
    BaseCriticalDamage: 0,
    BaseCriticalRate: 0,
    BaseDefense: 0,
    BaseHP: 0,
    BaseResistance: 0,
    BaseSpeed: 0,
    CurrentAccuracy: 0,
    CurrentAttack: 0,
    CurrentCriticalDamage: 0,
    CurrentCriticalRate: 0,
    CurrentDefense: 0,
    CurrentHP: 0,
    CurrentResistance: 0,
    CurrentSpeed: 0,
  };
};

export default {
  title: "UI/ChampionDisplay",
  component: ChampionDisplay,
} as Meta;

export const Base: Story<{
  size?: number;
  Name: string;
  Quality: IStars;
  Awaken: IStars;
  Level: number;
  Clan: string;
  Rarity: IRarity;
  Role: IChampionRole;
  Affinity: IChampionAffinity;
  Aura: string;
  InVault: boolean;
}> = (args) => {
  const champion = championFactory(args);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ChampionDisplay champion={champion} {...args} />;
};

Base.argTypes = {
  size: {
    defaultValue: "166",
    control: {
      type: "number",
      min: 20,
      max: 500,
    },
  },
  Name: {
    defaultValue: "Apothecary",
    control: {
      type: "select",
      options: ["Lugan_the_Steadfast", "Apothecary"],
    },
  },
  Quality: {
    defaultValue: "0",
    control: {
      type: "range",
      min: 0,
      max: 6,
    },
  },
  Awaken: {
    defaultValue: "0",
    control: {
      type: "range",
      min: 0,
      max: 6,
    },
  },
  Level: {
    defaultValue: "0",
    control: {
      type: "range",
      min: 0,
      max: 60,
    },
  },
  Clan: {
    defaultValue: listClans.map((c) => c.text)[0],
    control: {
      type: "select",
      options: listClans.map((c) => c.text),
    },
  },
  Rarity: {
    defaultValue: "Common",
    control: {
      type: "select",
      options: ["Common", "Uncommon", "Rare", "Epic", "Legendary"],
    },
  },
  Role: {
    defaultValue: "Attack",
    control: {
      type: "select",
      options: ["Attack", "Defense", "HP", "Support"],
    },
  },
  Affinity: {
    defaultValue: "Force",
    control: {
      type: "select",
      options: ["Force", "Magic", "Spirit", "Void"],
    },
  },
  Aura: {
    defaultValue: "",
    control: {
      type: "select",
      options: ["", ...Object.keys(Auras)],
    },
  },
  InVault: {
    control: {
      type: "boolean",
    },
  },
};

export const Lugan = ({ opacity }: { opacity: number }): JSX.Element => {
  const champion = championFactory({
    Affinity: "Spirit",
    Aura: "HP",
    Awaken: 6,
    Clan: "BannerLords",
    InVault: true,
    Level: 60,
    Name: "Lugan_the_Steadfast",
    Quality: 6,
    Rarity: "Legendary",
    Role: "HP",
  });

  return (
    <div style={{ opacity }}>
      <ChampionDisplay height={172} champion={champion} />
    </div>
  );
};

Lugan.argTypes = {
  opacity: {
    defaultValue: "1",
    control: {
      type: "select",
      options: ["0", "0.5", "1"],
    },
  },
};

export const Seeker = (): JSX.Element => {
  const champion = championFactory({
    Affinity: "Magic",
    Aura: "DEF",
    Awaken: 2,
    Clan: "UndeadHordes",
    InVault: false,
    Level: 50,
    Name: "Seeker",
    Quality: 5,
    Rarity: "Epic",
    Role: "Defense",
  });

  return <ChampionDisplay champion={champion} />;
};

export const UltimateGalek = (): JSX.Element => {
  const champion = championFactory({
    Affinity: "Magic",
    Aura: "",
    Awaken: 2,
    Clan: "Orcs",
    InVault: false,
    Level: 29,
    Name: "Ultimate_Galek",
    Quality: 5,
    Rarity: "Epic",
    Role: "Attack",
  });

  return <ChampionDisplay champion={champion} />;
};

export const Diabolist = (): JSX.Element => {
  const champion = championFactory({
    Affinity: "Magic",
    Aura: "",
    Awaken: 0,
    Clan: "Demonspawn",
    InVault: true,
    Level: 1,
    Name: "Diabolist",
    Quality: 3,
    Rarity: "Rare",
    Role: "Support",
  });

  return <ChampionDisplay champion={champion} />;
};
