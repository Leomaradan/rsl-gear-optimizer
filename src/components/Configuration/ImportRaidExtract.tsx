import Stack from "components/UI/Stack";
import Modal from "components/UI/Modal";

import { useLanguage } from "lang/LanguageContext";
import {
  ArtifactDraft,
  Clans,
  ExistingSlotsAccessories,
  RarityFromString,
  Sets,
  Slots,
  Stars,
  Stat,
} from "models";
import { loadArtifacts } from "redux/artifactsSlice";
import styled from "styled-components";
import React, { ChangeEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";

const Textarea = styled.textarea.attrs(() => ({ className: "form-control" }))`
  flex: 1;
`;

type ArtifactJsonStat =
  | "Speed"
  | "Attack"
  | "Health"
  | "CriticalChance"
  | "CriticalDamage"
  | "Resistance"
  | "Accuracy"
  | "Defense";

type ArtifactJsonSet =
  | "LifeDrain"
  | "AttackPower"
  | "Hp"
  | "None"
  | "AttackSpeed"
  | "DotRate"
  | "ShieldAndHp"
  | "Accuracy"
  | "AoeDamageDecrease"
  | "Counterattack"
  | "SleepChance"
  | "CounterattackOnCrit"
  | "Defense"
  | "Resistance"
  | "CriticalChance"
  | "ProvokeChance"
  | "Heal"
  | "AttackPowerAndIgnoreDefense"
  | "DecreaseMaxHp"
  | "Shield"
  | "GetExtraTurn"
  | "HpAndHeal"
  | "BlockHealChance"
  | "StunChance"
  | "DamageIncreaseOnHpDecrease"
  | "IgnoreDefense"
  | "CriticalDamage"
  | "CriticalHealMultiplier"
  | "CooldownReductionChance"
  | "ShieldAndAttackPower"
  | "BlockDebuff"
  | "FreezeRateOnDamageReceived"
  | "UnkillableAndSpdAndCrDmg"
  | "HpAndDefense"
  | "AccuracyAndSpeed"
  | "Stamina"
  | "BlockReflectDebuffAndHpAndDef"
  | "ShieldAndSpeed"
  | "ShieldAndCriticalChance";

type WornList = { [key: number]: string };
type ArtifactJson = {
  id: number;
  level: number;
  kind:
    | "Boots"
    | "Weapon"
    | "Helmet"
    | "Chest"
    | "Gloves"
    | "Shield"
    | "Ring"
    | "Cloak"
    | "Banner";
  rank: "One" | "Two" | "Three" | "Four" | "Five" | "Six";
  rarity: string;
  setKind: ArtifactJsonSet;
  primaryBonus: {
    kind: ArtifactJsonStat;
    isAbsolute: boolean;
    value: number;
  };
  secondaryBonuses: {
    kind: ArtifactJsonStat;
    isAbsolute: boolean;
    value: number;
    enhancement: number;
    level: number;
  }[];
  requiredFraction?: string;
};

const generateWornList = (heroes: { name: string; artifacts?: number[] }[]) => {
  const wornList: WornList = {};

  heroes.forEach((hero) => {
    if (hero.artifacts) {
      const name = hero.name.replace(/[^a-z -]+/gi, "").replace(/[ -]+/gi, "_");
      hero.artifacts.forEach((artifact) => {
        wornList[artifact] = name;
      });
    }
  });

  return wornList;
};

const getStat = ({
  kind,
  isAbsolute,
  value,
  enhancement: enhancementBase,
}: {
  kind: ArtifactJsonStat;
  isAbsolute: boolean;
  value: number;
  enhancement?: number;
}): { Stats: Stat; Value: number; Rune: number } => {
  const enhancement = enhancementBase ?? 0;
  switch (kind) {
    case "Accuracy":
      return { Stats: Stat.Accuracy, Value: value, Rune: enhancement };
    case "Attack":
      if (isAbsolute) {
        return { Stats: Stat.Attack, Value: value, Rune: enhancement };
      }
      return {
        Stats: Stat.AttackPercent,
        Value: value * 100,
        Rune: enhancement * 100,
      };
    case "CriticalChance":
      return { Stats: Stat.CriticalRate, Value: value * 100, Rune: 0 };
    case "CriticalDamage":
      return { Stats: Stat.CriticalDamage, Value: value * 100, Rune: 0 };
    case "Defense":
      if (isAbsolute) {
        return { Stats: Stat.Defense, Value: value, Rune: enhancement };
      }
      return {
        Stats: Stat.DefensePercent,
        Value: value * 100,
        Rune: enhancement * 100,
      };
    case "Health":
      if (isAbsolute) {
        return { Stats: Stat.HP, Value: value, Rune: enhancement };
      }
      return {
        Stats: Stat.HpPercent,
        Value: value * 100,
        Rune: enhancement * 100,
      };
    case "Resistance":
      return { Stats: Stat.Resistance, Value: value, Rune: enhancement };
    case "Speed":
      return { Stats: Stat.Speed, Value: value, Rune: enhancement };
    default:
      return { Stats: Stat.None, Value: 0, Rune: 0 };
  }
};

const getQuality = (
  rank: "One" | "Two" | "Three" | "Four" | "Five" | "Six"
): Stars => {
  switch (rank) {
    case "Six":
      return 6;
    case "Five":
      return 5;
    case "Four":
      return 4;
    case "Three":
      return 3;
    case "Two":
      return 2;
    case "One":
    default:
      return 1;
  }
};

const getSlot = (
  kind:
    | "Boots"
    | "Weapon"
    | "Helmet"
    | "Chest"
    | "Gloves"
    | "Shield"
    | "Ring"
    | "Cloak"
    | "Banner"
): Slots => {
  switch (kind) {
    case "Banner":
      return Slots.Banner;
    case "Boots":
      return Slots.Boots;
    case "Chest":
      return Slots.Chestplate;
    case "Cloak":
      return Slots.Amulet;
    case "Gloves":
      return Slots.Gauntlets;
    case "Helmet":
      return Slots.Helmet;
    case "Ring":
      return Slots.Ring;
    case "Shield":
      return Slots.Shield;
    case "Weapon":
    default:
      return Slots.Weapon;
  }
};

const getSet = (kind: ArtifactJsonSet): Sets => {
  switch (kind) {
    case "Hp":
      return Sets.Life;
    case "AttackPower":
      return Sets.Offense;
    case "Defense":
      return Sets.Defense;
    case "AttackSpeed":
      return Sets.Speed;
    case "CriticalChance":
      return Sets.CriticalRate;
    case "CriticalDamage":
      return Sets.CriticalDamage;
    case "Accuracy":
      return Sets.Accuracy;
    case "Resistance":
      return Sets.Resistance;
    case "LifeDrain":
      return Sets.Lifesteal;
    case "DamageIncreaseOnHpDecrease":
      return Sets.Fury;
    case "SleepChance":
      return Sets.Daze;
    case "BlockHealChance":
      return Sets.Cursed;
    case "FreezeRateOnDamageReceived":
      return Sets.Frost;
    case "Stamina":
      return Sets.Frenzy;
    case "Heal":
      return Sets.Regeneration;
    case "BlockDebuff":
      return Sets.Immunity;
    case "Shield":
      return Sets.Shield;
    case "GetExtraTurn":
      return Sets.Relentless;
    case "IgnoreDefense":
      return Sets.Savage;
    case "DecreaseMaxHp":
      return Sets.Destroy;
    case "StunChance":
      return Sets.Stun;
    case "DotRate":
      return Sets.Toxic;
    case "ProvokeChance":
      return Sets.Taunting;
    case "Counterattack":
      return Sets.Retaliation;
    case "CounterattackOnCrit":
      return Sets.Avenging;
    case "AoeDamageDecrease":
      return Sets.Stalwart;
    case "CooldownReductionChance":
      return Sets.Reflex;
    case "CriticalHealMultiplier":
      return Sets.Curing;
    case "AttackPowerAndIgnoreDefense":
      return Sets.Cruel;
    case "HpAndHeal":
      return Sets.Immortal;
    case "ShieldAndAttackPower":
      return Sets.DivineOffense;
    case "ShieldAndCriticalChance":
      return Sets.DivineCriticalRate;
    case "ShieldAndHp":
      return Sets.DivineLife;
    case "ShieldAndSpeed":
      return Sets.DivineSpeed;
    case "UnkillableAndSpdAndCrDmg":
      return Sets.SwiftParry;
    case "BlockReflectDebuffAndHpAndDef":
      return Sets.Deflection;
    case "HpAndDefense":
      return Sets.Resilience;
    case "AccuracyAndSpeed":
      return Sets.Perception;
    case "None":
    default:
      return Sets.Null;
  }
};

const generateArtifact = (
  artifact: ArtifactJson,
  wornList: WornList
): ArtifactDraft => {
  const MainStats = getStat(artifact.primaryBonus);
  const Slot = getSlot(artifact.kind);

  const newArtifact: ArtifactDraft = {
    Clan: (artifact.requiredFraction as Clans) ?? Clans.Null,
    Level: artifact.level,
    MainStats: MainStats.Stats,
    Quality: getQuality(artifact.rank),
    Rarity: RarityFromString[artifact.rarity.toLowerCase()],
    Set: getSet(artifact.setKind),
    Slot,
    SubStats: [],
    MainStatsValue: MainStats.Value,
    isAccessory: ExistingSlotsAccessories.includes(Slot),
    Champion: wornList[artifact.id],
  };

  artifact.secondaryBonuses.forEach((bonus) => {
    const stats = getStat(bonus);
    newArtifact.SubStats.push({
      ...stats,
      Roll: bonus.level,
    });
  });

  return newArtifact;
};

export default (): JSX.Element => {
  const lang = useLanguage();

  const [showModalImport, setShow] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onImport = () => {
    try {
      const json = JSON.parse(textareaValue);

      const wornList = generateWornList(json.heroes);

      const newArtifacts: ArtifactDraft[] = [];
      json.artifacts.forEach((artifact: ArtifactJson) => {
        newArtifacts.push(generateArtifact(artifact as ArtifactJson, wornList));
      });

      dispatch(loadArtifacts({ artifacts: newArtifacts }));
      handleClose();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const fileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length === 1) {
      const reader = new FileReader();
      reader.onload = (json: ProgressEvent<FileReader>) => {
        setTextareaValue((json.target?.result as string) ?? "{}");
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        {lang.btnImportRaidExtract}
      </Button>
      <p>{lang.messageRaidExtractHelp}</p>
      <Button
        variant="info"
        href="https://github.com/Da-Teach/RaidExtractor/releases/latest"
        target="_blank"
      >
        {lang.messageRaidExtractLink}
      </Button>
      <Modal
        title={lang.titleImportJSON}
        content={
          <Stack>
            <span className="badge badge-danger">
              <strong>{lang.commonWarning}</strong>:{" "}
              {lang.messageImportOverrideData}
            </span>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="fileImport"
                accept=".json"
                onChange={fileUpload}
              />
              <label className="custom-file-label" htmlFor="fileImport">
                {lang.optionChooseJSONFile}
              </label>
            </div>
            <Textarea value={textareaValue} readOnly />
          </Stack>
        }
        show={showModalImport}
        onSave={onImport}
        onClose={handleClose}
      />
    </>
  );
};
