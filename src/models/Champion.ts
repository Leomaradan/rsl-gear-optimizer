import type { IArtifact } from "./Artifact";
import type { IClans } from "./Clans";
import type { IGameProgression } from "./Configuration";
import type { IRarity, IStars } from "./Quality";
import type { IAura } from "./Stat";

export type IChampionRole = "Attack" | "Defense" | "HP" | "Support";

export type IChampionAffinity = "Force" | "Magic" | "Spirit" | "Void";

export type IChampionMastery =
  | "BladeDisciple"
  | "DeadlyPrecision"
  | "ToughSkin"
  | "Defiant"
  | "Steadfast"
  | "PinpointAccuracy"
  | "HeartOfGlory"
  | "KeenStrike"
  | "ShieldBreaker"
  | "GrimResolve"
  | "Blastproof"
  | "Rejuvenation"
  | "MightyEndurance"
  | "ImprovedParry"
  | "LayOnHands"
  | "Shieldbearer"
  | "ExaltInDeath"
  | "ChargedFocus"
  | "SingleOut"
  | "LifeDrinker"
  | "WhirlwindOfDeath"
  | "RuthlessAmbush"
  | "ShadowHeal"
  | "Resurgent"
  | "Bloodthirst"
  | "WisdomOfBattle"
  | "HealingSavior"
  | "RapidResponse"
  | "SwarmSmiter"
  | "ArcaneCelerity"
  | "BringItDown"
  | "WrathOfTheSlain"
  | "CycleOfViolence"
  | "Opportunist"
  | "Solidarity"
  | "DelayDeath"
  | "HarvestDespair"
  | "Stubbornness"
  | "MercifulAid"
  | "CycleOfMagic"
  | "LoreOfSteel"
  | "EvilEye"
  | "Methodical"
  | "KillStreak"
  | "BloodShield"
  | "StokedToFury"
  | "SelflessDefender"
  | "CycleOfRevenge"
  | "Retribution"
  | "Deterrence"
  | "LastingGifts"
  | "SpiritHaste"
  | "Sniper"
  | "MasterHexer"
  | "Warmaster"
  | "Helmsmasher"
  | "GiantSlayer"
  | "FlawlessExecution"
  | "IronSkin"
  | "Bulwark"
  | "FearsomePresence"
  | "Unshakeable"
  | "ElixirOfLife"
  | "TimelyIntervention"
  | "Oppressor"
  | "EagleEye";

export interface IChampion {
  Id: number;
  Slug: string;
  Name: string;
  Quality: IStars;
  Awaken: IStars;
  Level: number;
  Clan: IClans;
  Rarity: IRarity;
  Role: IChampionRole;
  Affinity: IChampionAffinity;
  Aura?: IAura;
  InVault: boolean;
  BaseHP: number;
  BaseAccuracy: number;
  BaseAttack: number;
  BaseDefense: number;
  BaseCriticalRate: number;
  BaseCriticalDamage: number;
  BaseResistance: number;
  BaseSpeed: number;
  CurrentHP: number;
  CurrentAccuracy: number;
  CurrentAttack: number;
  CurrentDefense: number;
  CurrentCriticalRate: number;
  CurrentCriticalDamage: number;
  CurrentResistance: number;
  CurrentSpeed: number;
  Masteries: IChampionMastery[];
  Power: number;
}

export interface IProfile {
  champions: IChampion[];
  artifacts: IArtifact[];
  gameProgression: IGameProgression;
  readOnly?: boolean;
}

export type IChampionDraft = Omit<
  IChampion,
  "Slug" | "Clan" | "Rarity" | "Role"
>;
