import { Validator } from "jsonschema";
import React, { ChangeEvent, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import {
  ExistingSlotsAccessories,
  RarityFromString,
  ChampionsDetailsList,
} from "../../data";
import {
  DefenseMasteries,
  OffenseMasteries,
  SupportMasteries,
} from "../../data/Masteries";
import { useLanguage } from "../../lang/LanguageContext";
import type {
  IArtifact,
  IBackup,
  IBackupPrepare,
  IBackupV1,
  IChampion,
  IChampionAffinity,
  IChampionDraft,
  IChampionMastery,
  IClans,
  ISets,
  ISlots,
  IStars,
  IStat,
} from "../../models";
import Backup1Schema from "../../process/backup-schema.json";
import calculateChampionStats from "../../process/calculateChampionStats";
import calculateScoreRealStats from "../../process/calculateScoreRealStats";
import logger from "../../process/logger";
import RaidExtractSchema from "../../process/raidextract-schema.json";
import { loadArtifacts } from "../../redux/artifactsSlice";
import { loadChampionConfigurations } from "../../redux/championConfigurationsSlice";
import { loadChampions } from "../../redux/championsSlice";
import type { IState } from "../../redux/reducers";
import Modal from "../UI/Modal";
import Stack from "../UI/Stack";

import { FormInput, FormLabel, FormRow, Textarea } from "./Layout";

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
  | "Accuracy"
  | "Attack"
  | "CriticalChance"
  | "CriticalDamage"
  | "Defense"
  | "Health"
  | "Resistance"
  | "Speed";

type IArtifactJsonSet =
  | "Accuracy"
  | "AccuracyAndSpeed"
  | "AoeDamageDecrease"
  | "AttackPower"
  | "AttackPowerAndIgnoreDefense"
  | "AttackSpeed"
  | "BlockDebuff"
  | "BlockHealChance"
  | "BlockReflectDebuffAndHpAndDef"
  | "CooldownReductionChance"
  | "Counterattack"
  | "CounterattackOnCrit"
  | "CriticalChance"
  | "CriticalDamage"
  | "CriticalHealMultiplier"
  | "DamageIncreaseOnHpDecrease"
  | "DecreaseMaxHp"
  | "Defense"
  | "DotRate"
  | "FreezeRateOnDamageReceived"
  | "GetExtraTurn"
  | "Heal"
  | "Hp"
  | "HpAndDefence"
  | "HpAndHeal"
  | "IgnoreDefense"
  | "LifeDrain"
  | "None"
  | "ProvokeChance"
  | "Resistance"
  | "Shield"
  | "ShieldAndAttackPower"
  | "ShieldAndCriticalChance"
  | "ShieldAndHp"
  | "ShieldAndSpeed"
  | "SleepChance"
  | "Stamina"
  | "StunChance"
  | "UnkillableAndSpdAndCrDmg";

interface IWornList {
  [key: number]: string;
}
interface IArtifactJson {
  id: number;
  kind:
    | "Banner"
    | "Boots"
    | "Chest"
    | "Cloak"
    | "Gloves"
    | "Helmet"
    | "Ring"
    | "Shield"
    | "Weapon";
  level: number;
  primaryBonus: {
    isAbsolute: boolean;
    kind: IArtifactJsonStat;
    value: number;
  };
  rank: "Five" | "Four" | "One" | "Six" | "Three" | "Two";
  rarity: string;
  requiredFraction?: string;
  secondaryBonuses: {
    kind: IArtifactJsonStat;
    isAbsolute: boolean;
    value: number;
    enhancement: number;
    level: number;
  }[];
  setKind: IArtifactJsonSet;
}

interface IChampionJson {
  accuracy: number;
  artifacts?: number[];
  attack: number;
  awakenLevel: number;
  criticalChance: number;
  criticalDamage: number;
  criticalHeal: number;
  defense: number;
  element: string;
  fraction: string;
  grade: "Stars1" | "Stars2" | "Stars3" | "Stars4" | "Stars5" | "Stars6";
  health: number;
  inStorage: boolean;
  level: number;
  locked: boolean;
  masteries: number[];
  name: string;
  rarity: string;
  resistance: number;
  role: string;
  speed: number;
}

interface IRaidExtractJson {
  artifacts: IArtifactJson[];
  heroes: IChampionJson[];
}

const importChampion = (
  heroes: IChampionJson[]
): { champions: IChampionDraft[]; wornList: IWornList } => {
  const champions: IChampionDraft[] = [];
  const wornList: IWornList = {};

  heroes.forEach((hero) => {
    let Quality: IStars;

    switch (hero.grade) {
      case "Stars2":
        Quality = 2;
        break;
      case "Stars3":
        Quality = 3;
        break;
      case "Stars4":
        Quality = 4;
        break;
      case "Stars5":
        Quality = 5;
        break;
      case "Stars6":
        Quality = 6;
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

    const Name = hero.name.replace(/[^a-z -]+/gi, "").replace(/[ -]+/gi, "_");

    const { Aura } = ChampionsDetailsList[Name] ?? { Aura: undefined };

    champions.push({
      Affinity: hero.element as IChampionAffinity,
      Awaken: hero.awakenLevel as IStars,
      BaseAccuracy: hero.accuracy,
      BaseAttack: hero.attack,
      BaseCriticalDamage: hero.criticalDamage,
      BaseCriticalRate: hero.criticalChance,
      BaseDefense: hero.defense,
      BaseHP: hero.health,
      BaseResistance: hero.resistance,
      BaseSpeed: hero.speed,
      CurrentAccuracy: hero.accuracy,
      CurrentAttack: hero.attack,
      CurrentCriticalDamage: hero.criticalDamage,
      CurrentCriticalRate: hero.criticalChance,
      CurrentDefense: hero.defense,
      CurrentHP: hero.health,
      CurrentResistance: hero.resistance,
      CurrentSpeed: hero.speed,
      Aura,
      InVault: hero.inStorage,
      Guid,
      Level: hero.level,
      Masteries,
      Name,
      Power: 0,
      Quality,
    });
  });

  return { champions, wornList };
};

interface IGetStatProps {
  enhancement?: number;
  isAbsolute: boolean;
  kind: IArtifactJsonStat;
  value: number;
}

const getStat = ({
  enhancement: enhancementBase,
  isAbsolute,
  kind,
  value,
}: IGetStatProps): { Stats: IStat; Value: number; Rune: number } => {
  const enhancement = enhancementBase ?? 0;
  switch (kind) {
    case "Accuracy":
      return { Rune: enhancement, Stats: "ACC", Value: value };
    case "Attack":
      if (isAbsolute) {
        return { Rune: enhancement, Stats: "ATK", Value: value };
      }
      return {
        Rune: Math.round(100 * enhancement),
        Stats: "ATK%",
        Value: Math.round(100 * value),
      };
    case "CriticalChance":
      return { Rune: 0, Stats: "C.RATE", Value: Math.round(100 * value) };
    case "CriticalDamage":
      return { Rune: 0, Stats: "C.DMG", Value: Math.round(100 * value) };
    case "Defense":
      if (isAbsolute) {
        return { Rune: enhancement, Stats: "DEF", Value: value };
      }
      return {
        Rune: Math.round(100 * enhancement),
        Stats: "DEF%",
        Value: Math.round(100 * value),
      };
    case "Health":
      if (isAbsolute) {
        return { Rune: enhancement, Stats: "HP", Value: value };
      }
      return {
        Rune: Math.round(100 * enhancement),
        Stats: "HP%",
        Value: Math.round(100 * value),
      };
    case "Resistance":
      return { Rune: enhancement, Stats: "RESI", Value: value };
    case "Speed":
      return { Rune: enhancement, Stats: "SPD", Value: value };
    default:
      return { Rune: 0, Stats: "", Value: 0 };
  }
};

const getQuality = (
  rank: "Five" | "Four" | "One" | "Six" | "Three" | "Two"
): IStars => {
  switch (rank) {
    case "Five":
      return 5;
    case "Four":
      return 4;
    case "Six":
      return 6;
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
    | "Banner"
    | "Boots"
    | "Chest"
    | "Cloak"
    | "Gloves"
    | "Helmet"
    | "Ring"
    | "Shield"
    | "Weapon"
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
    case "Accuracy":
      return "Accuracy";
    case "AccuracyAndSpeed":
      return "Perception";
    case "AoeDamageDecrease":
      return "Stalwart";
    case "AttackPower":
      return "Offense";
    case "AttackPowerAndIgnoreDefense":
      return "Cruel";
    case "AttackSpeed":
      return "Speed";
    case "BlockDebuff":
      return "Immunity";
    case "BlockHealChance":
      return "Cursed";
    case "BlockReflectDebuffAndHpAndDef":
      return "Deflection";
    case "CooldownReductionChance":
      return "Reflex";
    case "Counterattack":
      return "Retaliation";
    case "CounterattackOnCrit":
      return "Avenging";
    case "CriticalChance":
      return "CriticalRate";
    case "CriticalDamage":
      return "CriticalDamage";
    case "CriticalHealMultiplier":
      return "Curing";
    case "DamageIncreaseOnHpDecrease":
      return "Fury";
    case "DecreaseMaxHp":
      return "Destroy";
    case "Defense":
      return "Defense";
    case "DotRate":
      return "Toxic";
    case "FreezeRateOnDamageReceived":
      return "Frost";
    case "GetExtraTurn":
      return "Relentless";
    case "Heal":
      return "Regeneration";
    case "Hp":
      return "Life";
    case "HpAndDefence":
      return "Resilience";
    case "HpAndHeal":
      return "Immortal";
    case "IgnoreDefense":
      return "Savage";
    case "LifeDrain":
      return "Lifesteal";
    case "ProvokeChance":
      return "Taunting";
    case "Resistance":
      return "Resistance";
    case "Shield":
      return "Shield";
    case "ShieldAndAttackPower":
      return "DivineOffense";
    case "ShieldAndCriticalChance":
      return "DivineCriticalRate";
    case "ShieldAndHp":
      return "DivineLife";
    case "ShieldAndSpeed":
      return "DivineSpeed";
    case "SleepChance":
      return "Daze";
    case "Stamina":
      return "Frenzy";
    case "StunChance":
      return "Stun";
    case "UnkillableAndSpdAndCrDmg":
      return "SwiftParry";
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

      const validate = validator.validate(json, RaidExtractSchema);

      const errorArtifacts = validate.errors
        .filter((error) => error.path[0] === "artifacts")
        .map((error) => error.path[1] as number);
      const errorChampions = validate.errors
        .filter((error) => error.path[0] === "heroes")
        .map((error) => error.path[1] as number);

      const validArtifacts = json.artifacts.filter(
        (_, index) => !errorArtifacts.includes(index)
      );
      const validChampions = json.heroes.filter(
        (_, index) => !errorChampions.includes(index)
      );

      const { champions: importedChampions, wornList } = importChampion(
        validChampions
      );

      const newArtifacts: IArtifact[] = [];
      validArtifacts.forEach((artifact: IArtifactJson) => {
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
      artifacts,
      championConfig: championConfigurations,
      champions,
      version: "1",
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
              <Button onClick={handleShowBackup} variant="danger">
                {lang.ui.button.importBackup}
              </Button>
              <Button onClick={exportBackup} variant="success">
                {lang.ui.button.exportBackup}
              </Button>
              <Modal
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
                onClose={handleCloseBackup}
                onSave={onImportBackup}
                show={showModalBackup}
                title={lang.ui.title.importBackup}
              />
            </Stack>
          </FormInput>
        </FormRow>
        <FormRow>
          <FormLabel>RaidExtract</FormLabel>
          <FormInput>
            <Stack style={{ width: "300px" }}>
              <Button onClick={handleShowRaidExtract} variant="danger">
                {lang.ui.button.importRaidExtract}
              </Button>
              <p>{lang.ui.message.raidExtractHelp}</p>
              <Button
                href="https://github.com/LukeCroteau/RaidExtractor/releases/latest"
                target="_blank"
                variant="info"
              >
                RaidExtract
              </Button>
              <Modal
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
                onClose={handleCloseRaidExtract}
                onSave={onImportRaidExtract}
                show={showModalRaidExtract}
                title={lang.ui.title.importJSON}
              />
            </Stack>
          </FormInput>
        </FormRow>
      </form>
    </>
  );
};

export default ImportExport;
