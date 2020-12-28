import { FormRow, FormInput, Textarea, FormLabel } from "./Layout";

import Stack from "components/UI/Stack";
import Modal from "components/UI/Modal";
import type { IState } from "redux/reducers";
import { loadArtifacts } from "redux/artifactsSlice";
import { useLanguage } from "lang/LanguageContext";
import { loadChampions } from "redux/championsSlice";
import logger from "process/logger";
import Backup1Schema from "process/backup-schema.json";
import { RarityFromString, ExistingSlotsAccessories } from "data";
import type {
  IChampionDraft,
  IStars,
  IStat,
  ISlots,
  ISets,
  IClans,
  IBackup,
  IBackupPrepare,
  IBackupV1,
  IArtifact,
  IChampionMastery,
  IChampion,
  IChampionAffinity,
} from "models";
import { loadChampionConfigurations } from "redux/championConfigurationsSlice";
import calculateScoreRealStats from "process/calculateScoreRealStats";
import {
  DefenseMasteries,
  OffenseMasteries,
  SupportMasteries,
} from "data/Masteries";

import { useDispatch, useSelector } from "react-redux";
import React, { ChangeEvent, useState } from "react";
import { Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { Validator } from "jsonschema";
import calculateChampionStats from "process/calculateChampionStats";

const validator = new Validator();

const exportJSON = (json: string, filename: string) => {
  const encodedUri = encodeURI(`data:text/json;charset=utf-8,${json}`);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);

  link.click();
};

type IArtifactJsonStat =
  | "Speed"
  | "Attack"
  | "Health"
  | "CriticalChance"
  | "CriticalDamage"
  | "Resistance"
  | "Accuracy"
  | "Defense";

type IArtifactJsonSet =
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
  | "HpAndDefence"
  | "AccuracyAndSpeed"
  | "Stamina"
  | "BlockReflectDebuffAndHpAndDef"
  | "ShieldAndSpeed"
  | "ShieldAndCriticalChance";

type IWornList = { [key: number]: string };
type IArtifactJson = {
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
  setKind: IArtifactJsonSet;
  primaryBonus: {
    kind: IArtifactJsonStat;
    isAbsolute: boolean;
    value: number;
  };
  secondaryBonuses: {
    kind: IArtifactJsonStat;
    isAbsolute: boolean;
    value: number;
    enhancement: number;
    level: number;
  }[];
  requiredFraction?: string;
};

type IChampionJson = {
  grade: "Stars1" | "Stars2" | "Stars3" | "Stars4" | "Stars5" | "Stars6";
  level: number;
  locked: boolean;
  inStorage: boolean;
  artifacts?: number[];
  fraction: string;
  rarity: string;
  role: string;
  element: string;
  awakenLevel: number;
  name: string;
  health: number;
  accuracy: number;
  attack: number;
  defense: number;
  criticalChance: number;
  criticalDamage: number;
  criticalHeal: number;
  resistance: number;
  speed: number;
  masteries: number[];
};

type IRaidExtractJson = {
  artifacts: IArtifactJson[];
  heroes: IChampionJson[];
};

const importChampion = (
  heroes: IChampionJson[]
): { champions: IChampionDraft[]; wornList: IWornList } => {
  const champions: IChampionDraft[] = [];
  const wornList: IWornList = {};

  heroes.forEach((hero) => {
    let Quality: IStars;

    switch (hero.grade) {
      case "Stars6":
        Quality = 6;
        break;
      case "Stars5":
        Quality = 5;
        break;
      case "Stars4":
        Quality = 4;
        break;
      case "Stars3":
        Quality = 3;
        break;
      case "Stars2":
        Quality = 2;
        break;
      default:
        Quality = 1;
        break;
    }

    const Guid = uuidv4();

    if (hero.artifacts) {
      hero.artifacts.forEach((artifact) => {
        wornList[artifact] = Guid;
      });
    }

    const Masteries: IChampionMastery[] = [];

    hero.masteries.forEach((idMastery) => {
      let cleanId = idMastery - 500000;
      let table = OffenseMasteries;
      if (cleanId > 300) {
        table = SupportMasteries;
        cleanId -= 300;
      } else if (cleanId > 200) {
        table = DefenseMasteries;
        cleanId -= 200;
      } else {
        cleanId -= 100;
      }

      const [rowStr, cellStr] = String(cleanId).split("");

      const row = parseInt(rowStr, 10) - 1;
      const cell = parseInt(cellStr, 10) - (row === 0 ? 2 : 1);

      Masteries.push(table[row][cell]);
    });

    champions.push({
      Guid,
      BaseAccuracy: hero.accuracy,
      BaseAttack: hero.attack,
      Awaken: hero.awakenLevel as IStars,
      Name: hero.name.replace(/[^a-z -]+/gi, "").replace(/[ -]+/gi, "_"),
      BaseCriticalRate: hero.criticalChance,
      BaseCriticalDamage: hero.criticalDamage,
      BaseDefense: hero.defense,
      BaseHP: hero.health,
      Level: hero.level,
      Affinity: hero.element as IChampionAffinity,
      Quality,
      BaseResistance: hero.resistance,
      BaseSpeed: hero.speed,
      Masteries,
      Power: 0,
      CurrentAccuracy: hero.accuracy,
      CurrentAttack: hero.attack,
      CurrentCriticalRate: hero.criticalChance,
      CurrentCriticalDamage: hero.criticalDamage,
      CurrentDefense: hero.defense,
      CurrentHP: hero.health,
      CurrentResistance: hero.resistance,
      CurrentSpeed: hero.speed,
    });
  });

  return { champions, wornList };
};

interface IGetStatProps {
  kind: IArtifactJsonStat;
  isAbsolute: boolean;
  value: number;
  enhancement?: number;
}

const getStat = ({
  kind,
  isAbsolute,
  value,
  enhancement: enhancementBase,
}: IGetStatProps): { Stats: IStat; Value: number; Rune: number } => {
  const enhancement = enhancementBase ?? 0;
  switch (kind) {
    case "Accuracy":
      return { Stats: "ACC", Value: value, Rune: enhancement };
    case "Attack":
      if (isAbsolute) {
        return { Stats: "ATK", Value: value, Rune: enhancement };
      }
      return {
        Stats: "ATK%",
        Value: Math.round(value * 100),
        Rune: Math.round(enhancement * 100),
      };
    case "CriticalChance":
      return { Stats: "C.RATE", Value: Math.round(value * 100), Rune: 0 };
    case "CriticalDamage":
      return { Stats: "C.DMG", Value: Math.round(value * 100), Rune: 0 };
    case "Defense":
      if (isAbsolute) {
        return { Stats: "DEF", Value: value, Rune: enhancement };
      }
      return {
        Stats: "DEF%",
        Value: Math.round(value * 100),
        Rune: Math.round(enhancement * 100),
      };
    case "Health":
      if (isAbsolute) {
        return { Stats: "HP", Value: value, Rune: enhancement };
      }
      return {
        Stats: "HP%",
        Value: Math.round(value * 100),
        Rune: Math.round(enhancement * 100),
      };
    case "Resistance":
      return { Stats: "RESI", Value: value, Rune: enhancement };
    case "Speed":
      return { Stats: "SPD", Value: value, Rune: enhancement };
    default:
      return { Stats: "", Value: 0, Rune: 0 };
  }
};

const getQuality = (
  rank: "One" | "Two" | "Three" | "Four" | "Five" | "Six"
): IStars => {
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
): ISlots => {
  switch (kind) {
    case "Banner":
      return "Banner";
    case "Boots":
      return "Boots";
    case "Chest":
      return "Chestplate";
    case "Cloak":
      return "Amulet";
    case "Gloves":
      return "Gauntlets";
    case "Helmet":
      return "Helmet";
    case "Ring":
      return "Ring";
    case "Shield":
      return "Shield";
    case "Weapon":
    default:
      return "Weapon";
  }
};

const getSet = (kind: IArtifactJsonSet): ISets => {
  switch (kind) {
    case "Hp":
      return "Life";
    case "AttackPower":
      return "Offense";
    case "Defense":
      return "Defense";
    case "AttackSpeed":
      return "Speed";
    case "CriticalChance":
      return "CriticalRate";
    case "CriticalDamage":
      return "CriticalDamage";
    case "Accuracy":
      return "Accuracy";
    case "Resistance":
      return "Resistance";
    case "LifeDrain":
      return "Lifesteal";
    case "DamageIncreaseOnHpDecrease":
      return "Fury";
    case "SleepChance":
      return "Daze";
    case "BlockHealChance":
      return "Cursed";
    case "FreezeRateOnDamageReceived":
      return "Frost";
    case "Stamina":
      return "Frenzy";
    case "Heal":
      return "Regeneration";
    case "BlockDebuff":
      return "Immunity";
    case "Shield":
      return "Shield";
    case "GetExtraTurn":
      return "Relentless";
    case "IgnoreDefense":
      return "Savage";
    case "DecreaseMaxHp":
      return "Destroy";
    case "StunChance":
      return "Stun";
    case "DotRate":
      return "Toxic";
    case "ProvokeChance":
      return "Taunting";
    case "Counterattack":
      return "Retaliation";
    case "CounterattackOnCrit":
      return "Avenging";
    case "AoeDamageDecrease":
      return "Stalwart";
    case "CooldownReductionChance":
      return "Reflex";
    case "CriticalHealMultiplier":
      return "Curing";
    case "AttackPowerAndIgnoreDefense":
      return "Cruel";
    case "HpAndHeal":
      return "Immortal";
    case "ShieldAndAttackPower":
      return "DivineOffense";
    case "ShieldAndCriticalChance":
      return "DivineCriticalRate";
    case "ShieldAndHp":
      return "DivineLife";
    case "ShieldAndSpeed":
      return "DivineSpeed";
    case "UnkillableAndSpdAndCrDmg":
      return "SwiftParry";
    case "BlockReflectDebuffAndHpAndDef":
      return "Deflection";
    case "HpAndDefence":
      return "Resilience";
    case "AccuracyAndSpeed":
      return "Perception";
    case "None":
    default:
      return "";
  }
};

const generateArtifact = (
  artifact: IArtifactJson,
  wornList: IWornList
): IArtifact => {
  const MainStats = getStat(artifact.primaryBonus);
  const Slot = getSlot(artifact.kind);

  const newArtifact: IArtifact = {
    Clan: (artifact.requiredFraction as IClans) ?? "",
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
    Guid: uuidv4(),
    Power: 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  artifact.secondaryBonuses.forEach((bonus) => {
    const stats = getStat(bonus);
    newArtifact.SubStats.push({
      ...stats,
      Roll: bonus.level,
    });
  });

  newArtifact.Power = calculateScoreRealStats(newArtifact);

  return newArtifact;
};

const importBackup1 = (backup: IBackupV1): IBackupPrepare => {
  const { artifacts, championConfig, champions } = backup;
  // Nothing to do for the backup's current version
  return { artifacts, championConfig, champions };
};

const ImportExport = (): JSX.Element => {
  const championConfigurations = useSelector(
    (state: IState) => state.championConfigurations
  );
  const artifacts = useSelector((state: IState) => state.artifacts);
  const champions = useSelector((state: IState) => state.champions);
  const { arenaRank, greatHallBonus } = useSelector(
    (state: IState) => state.configuration
  );

  const lang = useLanguage();

  const [showModalBackup, setShowBackup] = useState(false);
  const [showModalRaidExtract, setShowRaidExtract] = useState(false);

  const [textareaBackup, setTextareaBackup] = useState("");
  const [textareaRaidExtract, setTextareaRaidExtract] = useState("");
  const dispatch = useDispatch();

  const handleCloseBackup = () => setShowBackup(false);
  const handleShowBackup = () => setShowBackup(true);

  const handleCloseRaidExtract = () => setShowRaidExtract(false);
  const handleShowRaidExtract = () => setShowRaidExtract(true);

  const onImportBackup = () => {
    const json = textareaBackup.trim();

    const backup: IBackup = JSON.parse(json);

    const validate = validator.validate(backup, Backup1Schema);

    if (validate.errors.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: IBackupPrepare = undefined as any;

      if (backup.version === "1") {
        result = importBackup1(backup);
      }

      if (result !== undefined) {
        dispatch(loadArtifacts({ artifacts: result.artifacts }));
        dispatch(loadChampions({ champions: result.champions }));
        dispatch(
          loadChampionConfigurations({
            championConfigurations: result.championConfig,
          })
        );
      }
    }

    handleCloseBackup();
  };

  const onImportRaidExtract = () => {
    try {
      const json: IRaidExtractJson = JSON.parse(textareaRaidExtract);

      const { champions: importedChampions, wornList } = importChampion(
        json.heroes
      );

      const newArtifacts: IArtifact[] = [];
      json.artifacts.forEach((artifact: IArtifactJson) => {
        const newArtifact = generateArtifact(
          artifact as IArtifactJson,
          wornList
        );
        newArtifacts.push(newArtifact);

        if (newArtifact.Champion) {
          const index = importedChampions.findIndex(
            (c) => c.Guid === newArtifact.Champion
          );

          if (index !== -1) {
            importedChampions[index].Power += newArtifact.Power;
          }
        }
      });

      importedChampions.forEach((champion, index) => {
        const art = newArtifacts.filter((a) => a.Champion === champion.Guid);

        const stats = calculateChampionStats(champion as IChampion, art, {
          arenaRank,
          greatHallBonus,
        });

        importedChampions[index].CurrentAccuracy = stats.ACC.total;
        importedChampions[index].CurrentAttack = stats.ATK.total;
        importedChampions[index].CurrentCriticalDamage = stats["C.DMG"].total;
        importedChampions[index].CurrentCriticalRate = stats["C.RATE"].total;
        importedChampions[index].CurrentDefense = stats.DEF.total;
        importedChampions[index].CurrentHP = stats.HP.total;
        importedChampions[index].CurrentResistance = stats.RESI.total;
        importedChampions[index].CurrentSpeed = stats.SPD.total;
      });

      dispatch(loadChampions({ champions: importedChampions }));
      dispatch(loadArtifacts({ artifacts: newArtifacts }));
      dispatch(
        loadChampionConfigurations({
          championConfigurations: [],
        })
      );
      handleCloseRaidExtract();
    } catch (e) {
      logger.error(e);
    }
  };

  const exportBackup = () => {
    const backup: IBackup = {
      version: "1",
      artifacts,
      championConfig: championConfigurations,
      champions,
    };

    exportJSON(
      JSON.stringify(backup),
      `raid-gear-optimizer-${new Date().toISOString()}.rgo`
    );
  };

  const fileUploadBackup = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length === 1) {
      const reader = new FileReader();
      reader.onload = (json: ProgressEvent<FileReader>) => {
        setTextareaBackup((json.target?.result as string) ?? "{}");
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  const fileUploadRaidExtract = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length === 1) {
      const reader = new FileReader();
      reader.onload = (json: ProgressEvent<FileReader>) => {
        setTextareaRaidExtract((json.target?.result as string) ?? "{}");
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <>
      <h1>{lang.ui.title.importExport}</h1>
      <form>
        <FormRow>
          <FormLabel>{lang.ui.title.importExport}</FormLabel>
          <FormInput>
            <Stack style={{ width: "300px" }}>
              <Button variant="danger" onClick={handleShowBackup}>
                {lang.ui.button.importBackup}
              </Button>
              <Button variant="success" onClick={exportBackup}>
                {lang.ui.button.exportBackup}
              </Button>
              <Modal
                title={lang.ui.title.importBackup}
                content={
                  <Stack>
                    <span className="badge badge-danger">
                      <strong>{lang.ui.common.warning}</strong>:{" "}
                      {lang.ui.message.importOverrideData}
                    </span>
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="fileImportBackup"
                        accept=".rgo"
                        onChange={fileUploadBackup}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="fileImportBackup"
                        data-browse={lang.ui.common.browse}
                      >
                        {lang.ui.option.chooseBackupFile}
                      </label>
                    </div>
                    <Textarea value={textareaBackup} readOnly />
                  </Stack>
                }
                show={showModalBackup}
                onSave={onImportBackup}
                onClose={handleCloseBackup}
              />
            </Stack>
          </FormInput>
        </FormRow>
        <FormRow>
          <FormLabel>RaidExtract</FormLabel>
          <FormInput>
            <Stack style={{ width: "300px" }}>
              <Button variant="danger" onClick={handleShowRaidExtract}>
                {lang.ui.button.importRaidExtract}
              </Button>
              <p>{lang.ui.message.raidExtractHelp}</p>
              <Button
                variant="info"
                href="https://github.com/Da-Teach/RaidExtractor/releases/latest"
                target="_blank"
              >
                RaidExtract
              </Button>
              <Modal
                title={lang.ui.title.importJSON}
                content={
                  <Stack>
                    <span className="badge badge-danger">
                      <strong>{lang.ui.common.warning}</strong>:{" "}
                      {lang.ui.message.importOverrideData}
                    </span>
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="fileImportRaidExtract"
                        accept=".json"
                        onChange={fileUploadRaidExtract}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="fileImportRaidExtract"
                        data-browse={lang.ui.common.browse}
                      >
                        {lang.ui.option.chooseJSONFile}
                      </label>
                    </div>
                    <Textarea value={textareaRaidExtract} readOnly />
                  </Stack>
                }
                show={showModalRaidExtract}
                onSave={onImportRaidExtract}
                onClose={handleCloseRaidExtract}
              />
            </Stack>
          </FormInput>
        </FormRow>
      </form>
    </>
  );
};

export default ImportExport;
