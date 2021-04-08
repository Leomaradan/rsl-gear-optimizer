import type { IClans } from "./Clans";
import type { IRarity, IStars } from "./Quality";
import type { ISets } from "./Sets";
import type { ISlots } from "./Slots";
import type { IStat, IStatsFull } from "./Stat";

interface IArtifactBase {
  Guid: string;
  Slot: ISlots;
  Set: ISets;
  Clan: IClans;
  Rarity: IRarity;
  Quality: IStars;
  Level: number;
  MainStats: IStat;
  MainStatsValue?: number;
  Champion?: string;
  isAccessory: boolean;
  SubStats: [IStatsFull?, IStatsFull?, IStatsFull?, IStatsFull?];
  Power: number;
}

export type IArtifactDraft = Omit<IArtifactBase, "Guid">;

interface IArtifactWeapon extends IArtifactBase {
  Slot: "Weapon";
  MainStats: "" | "ATK";
  Clan: "";
  isAccessory: false;
}

interface IArtifactHelmet extends IArtifactBase {
  Slot: "Helmet";
  MainStats: "" | "HP";
  Clan: "";
  isAccessory: false;
}

interface IArtifactShield extends IArtifactBase {
  Slot: "Shield";
  MainStats: "" | "DEF";
  Clan: "";
  isAccessory: false;
}

interface IArtifactGauntlets extends IArtifactBase {
  Slot: "Gauntlets";
  MainStats:
    | ""
    | "HP"
    | "HP%"
    | "ATK"
    | "ATK%"
    | "DEF"
    | "DEF%"
    | "C.RATE"
    | "C.DMG";
  Clan: "";
  isAccessory: false;
}

interface IArtifactChestplate extends IArtifactBase {
  Slot: "Chestplate";
  MainStats:
    | ""
    | "HP"
    | "HP%"
    | "ATK"
    | "ATK%"
    | "DEF"
    | "DEF%"
    | "ACC"
    | "RESI";
  Clan: "";
  isAccessory: false;
}

interface IArtifactBoots extends IArtifactBase {
  Slot: "Boots";
  MainStats: "" | "HP" | "HP%" | "ATK" | "ATK%" | "DEF" | "DEF%" | "SPD";
  Clan: "";
  isAccessory: false;
}

interface IArtifactRing extends IArtifactBase {
  Slot: "Ring";
  MainStats: "" | "HP" | "ATK" | "DEF";
  Set: "";
  isAccessory: true;
}

interface IArtifactAmulet extends IArtifactBase {
  Slot: "Amulet";
  MainStats: "" | "HP" | "ATK" | "DEF" | "C.DMG";
  Set: "";
  isAccessory: true;
}

interface IArtifactBanner extends IArtifactBase {
  Slot: "Banner";
  MainStats: "" | "HP" | "ATK" | "DEF" | "ACC" | "RESI";
  Set: "";
  isAccessory: true;
}

export type IArtifact =
  | IArtifactWeapon
  | IArtifactHelmet
  | IArtifactShield
  | IArtifactGauntlets
  | IArtifactChestplate
  | IArtifactBoots
  | IArtifactRing
  | IArtifactAmulet
  | IArtifactBanner;

export type IScoredArtifact = IArtifact & { score: number };
