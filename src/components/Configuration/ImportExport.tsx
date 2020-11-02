import classNames from "classnames";
import Stack from "components/UI/FlexStack";
import Modal from "components/UI/Modal";
import { ChampionDraft, ChampionSetMethod } from "models/Champion";
import { RarityFromString, RarityString, Stars } from "models/Quality";
import Sets, { ExistingSets } from "models/Sets";
import Stats, { ExistingStats, StatsFull } from "models/Stats";
import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "redux/reducers";
import styled from "styled-components";
import ChampionsList from "models/ChampionsList";
import Artifact, { ArtifactDraft } from "models/Artifact";
import Slots from "models/Slots";
import { validateArtifact } from "components/Artifacts/ArtifactForm";
import { loadArtifacts } from "redux/artifactsSlice";
import { loadChampions } from "redux/championsSlice";
import { useLanguage } from "lang/LanguageContext";

interface ButtonProps {
  variant: string;
}
const Button = styled.button.attrs((p: ButtonProps) => ({
  type: "button",
  className: classNames("btn", `btn-${p.variant}`),
}))<ButtonProps>`
  width: 200px;
`;

const Textarea = styled.textarea.attrs(() => ({ className: "form-control" }))`
  flex: 1;
`;

const exportCSV = (rows: string[][], filename: string) => {
  const csvContent = rows.map((e) => e.join(";")).join("\n");
  const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);

  link.click();
};

const importChampions = (value: string[]): ChampionDraft[] | false => {
  try {
    const rows = value.slice(1);
    const champions: ChampionDraft[] = [];
    rows.forEach((row) => {
      const fields = row.split(";");
      if (fields.length !== 18) {
        throw Error(String(fields.length));
      }

      const champion = fields[0];
      const order = parseInt(fields[1], 10);
      const methods = parseInt(fields[2], 10);

      const sets = fields[3]
        .split(",")
        .filter((s) => s)
        .sort() as Sets[];

      const [
        statsPriorityAcc,
        statsPriorityAtkp,
        statsPriorityAtk,
        statsPriorityCdmg,
        statsPriorityCrate,
        statsPriorityDefp,
        statsPriorityDef,
        statsPriorityHpp,
        statsPriorityHp,
        statsPriorityResi,
        statsPrioritySpd,
      ] = fields.slice(4, 15).map((s) => parseInt(s, 10));

      const [gauntletStats, chestplateStats, bootsStats] = fields
        .slice(15)
        .map((s) => s.split(",").sort() as Stats[]);

      if (!ChampionsList.includes(champion)) {
        throw Error(champion);
      }

      if (typeof order !== "number") {
        throw Error(order);
      }

      if (order < 0 || Number.isNaN(order)) {
        throw Error(String(order));
      }

      const existingOrder = champions.find((c) => c.order === order);
      if (existingOrder) {
        throw Error(String(order));
      }

      if (typeof methods !== "number") {
        throw Error(methods);
      }

      if (methods < 0 || methods > 2) {
        throw Error(String(methods));
      }

      if (methods === ChampionSetMethod.NoSets && sets.length !== 0) {
        throw Error(String(sets.length));
      }

      const invalidSets = sets.filter((s) => !ExistingSets.includes(s));
      if (invalidSets.length !== 0) {
        throw Error(String(invalidSets.join(",")));
      }

      if (statsPriorityAtkp < 0 || statsPriorityAtkp > 3) {
        throw Error(String(statsPriorityAtkp));
      }
      if (statsPriorityCdmg < 0 || statsPriorityCdmg > 3) {
        throw Error(String(statsPriorityCdmg));
      }
      if (statsPriorityCrate < 0 || statsPriorityCrate > 3) {
        throw Error(String(statsPriorityCrate));
      }
      if (statsPriorityDefp < 0 || statsPriorityDefp > 3) {
        throw Error(String(statsPriorityDefp));
      }
      if (statsPriorityHpp < 0 || statsPriorityHpp > 3) {
        throw Error(String(statsPriorityHpp));
      }
      if (statsPriorityAcc < 0 || statsPriorityAcc > 3) {
        throw Error(String(statsPriorityAcc));
      }
      if (statsPriorityAtk < 0 || statsPriorityAtk > 3) {
        throw Error(String(statsPriorityAtk));
      }
      if (statsPriorityDef < 0 || statsPriorityDef > 3) {
        throw Error(String(statsPriorityDef));
      }
      if (statsPriorityHp < 0 || statsPriorityHp > 3) {
        throw Error(String(statsPriorityHp));
      }
      if (statsPriorityResi < 0 || statsPriorityResi > 3) {
        throw Error(String(statsPriorityResi));
      }
      if (statsPrioritySpd < 0 || statsPrioritySpd > 3) {
        throw Error(String(statsPrioritySpd));
      }

      if (gauntletStats.length === 0) {
        throw Error(String(gauntletStats.length));
      }
      if (chestplateStats.length === 0) {
        throw Error(String(chestplateStats.length));
      }
      if (bootsStats.length === 0) {
        throw Error(String(bootsStats.length));
      }

      const invalidGauntletsStats = gauntletStats.filter(
        (s) => !ExistingStats.includes(s)
      );
      const invalidChestplateStats = chestplateStats.filter(
        (s) => !ExistingStats.includes(s)
      );
      const invalidBootsStats = bootsStats.filter(
        (s) => !ExistingStats.includes(s)
      );

      if (invalidGauntletsStats.length !== 0) {
        throw Error(String(invalidGauntletsStats.join(",")));
      }
      if (invalidChestplateStats.length !== 0) {
        throw Error(String(invalidChestplateStats.join(",")));
      }
      if (invalidBootsStats.length !== 0) {
        throw Error(String(invalidBootsStats.join(",")));
      }

      const newChampion: ChampionDraft = {
        champion,
        order,
        methods,
        sets,
        statsPriority: {
          "ATK%": statsPriorityAtkp,
          "C.DMG": statsPriorityCdmg,
          "C.RATE": statsPriorityCrate,
          "DEF%": statsPriorityDefp,
          "HP%": statsPriorityHpp,
          ACC: statsPriorityAcc,
          ATK: statsPriorityAtk,
          DEF: statsPriorityDef,
          HP: statsPriorityHp,
          RESI: statsPriorityResi,
          SPD: statsPrioritySpd,
        },
        bootsStats,
        chestplateStats,
        gauntletStats,
        activated: true,
      };

      champions.push(newChampion);
    });
    return champions;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return false;
  }
};

const importArtifact = (value: string[]): ArtifactDraft[] | false => {
  try {
    const rows = value.slice(1);
    const artifacts: ArtifactDraft[] = [];

    rows.forEach((row) => {
      const fields = row.split(";");
      if (fields.length !== 24) {
        throw Error(String(fields.length));
      }

      const Slot = fields[0] as Slots;
      const Set = fields[1] as Sets;
      const Quality = parseInt(fields[2], 10) as Stars;
      const RarityStr = fields[3];
      const Level = parseInt(fields[4], 10);
      const Champion = fields[5];

      const MainStats = fields[6] as Stats;
      const MainStatsValue = parseInt(fields[7], 10);

      const SubStats: [StatsFull?, StatsFull?, StatsFull?, StatsFull?] = [
        undefined,
        undefined,
        undefined,
        undefined,
      ];

      const subStat1 = fields[8] as Stats;
      const subValue1 = parseInt(fields[9], 10);
      const subRolls1 = parseInt(fields[10], 10);
      const subRune1 = parseInt(fields[11], 10);
      if (subStat1) {
        SubStats[0] = {
          Stats: subStat1,
          Value: subValue1,
          Roll: subRolls1,
          Rune: subRune1,
        };
      }

      const subStat2 = fields[12] as Stats;
      const subValue2 = parseInt(fields[13], 10);
      const subRolls2 = parseInt(fields[14], 10);
      const subRune2 = parseInt(fields[15], 10);
      if (subStat2) {
        SubStats[1] = {
          Stats: subStat2,
          Value: subValue2,
          Roll: subRolls2,
          Rune: subRune2,
        };
      }

      const subStat3 = fields[16] as Stats;
      const subValue3 = parseInt(fields[17], 10);
      const subRolls3 = parseInt(fields[18], 10);
      const subRune3 = parseInt(fields[19], 10);
      if (subStat3) {
        SubStats[2] = {
          Stats: subStat3,
          Value: subValue3,
          Roll: subRolls3,
          Rune: subRune3,
        };
      }

      const subStat4 = fields[20] as Stats;
      const subValue4 = parseInt(fields[21], 10);
      const subRolls4 = parseInt(fields[22], 10);
      const subRune4 = parseInt(fields[23], 10);
      if (subStat4) {
        SubStats[3] = {
          Stats: subStat4,
          Value: subValue4,
          Roll: subRolls4,
          Rune: subRune4,
        };
      }

      if (
        ![
          Slots.Weapon,
          Slots.Helmet,
          Slots.Shield,
          Slots.Gauntlets,
          Slots.Chestplate,
          Slots.Boots,
        ].includes(Slot)
      ) {
        throw Error(Slot);
      }

      if (Set === "" || !ExistingSets.includes(Set)) {
        throw Error(Set);
      }

      if (Quality < 1 || Quality > 6) {
        throw Error(String(Quality));
      }

      if (!Object.values(RarityString).includes(RarityStr)) {
        throw Error(RarityStr);
      }

      if (Level < 0 || Level > 16) {
        throw Error(String(Level));
      }

      if (Champion !== "" && !ChampionsList.includes(Champion)) {
        throw Error(Champion);
      }

      if (!ExistingStats.includes(MainStats)) {
        throw Error(MainStats);
      }

      if (MainStatsValue <= 0) {
        throw Error(String(MainStatsValue));
      }

      SubStats.forEach((sub) => {
        if (sub) {
          if (!ExistingStats.includes(sub.Stats)) {
            throw Error(JSON.stringify(sub));
          }
        }
      });

      const newArtifact: ArtifactDraft = {
        Slot,
        Set,
        Quality,
        Rarity: RarityFromString[RarityStr],
        Level,
        Champion,
        MainStats,
        MainStatsValue,
        SubStats,
      };

      validateArtifact(newArtifact as Artifact, (errors) => {
        if (errors.length > 0) {
          throw Error(JSON.stringify({ row, errors }));
        }
      });

      artifacts.push(newArtifact);
    });
    return artifacts;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return false;
  }
};

export default (): JSX.Element => {
  const champions = useSelector((state: State) => state.champions);
  const artifacts = useSelector((state: State) => state.artifacts);
  const lang = useLanguage();

  const [showModalImport, setShow] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onImport = () => {
    const rows = textareaValue.trim().replace("\r", "").split("\n");

    if (rows[0].startsWith("slot")) {
      const listArtifacts = importArtifact(rows);
      if (listArtifacts) {
        dispatch(loadArtifacts({ artifacts: listArtifacts }));
        handleClose();
      }
    }

    if (rows[0].startsWith("champion")) {
      const listChampions = importChampions(rows);
      if (listChampions) {
        dispatch(loadChampions({ champions: listChampions }));
        handleClose();
      }
    }
  };

  const exportChampions = () => {
    const rows = champions.map((champion) => {
      return [
        champion.champion,
        champion.order,
        champion.methods,
        champion.sets.join(","),
        champion.statsPriority.ACC ?? "0",
        champion.statsPriority["ATK%"] ?? "0",
        champion.statsPriority.ATK ?? "0",
        champion.statsPriority["C.DMG"] ?? "0",
        champion.statsPriority["C.RATE"] ?? "0",
        champion.statsPriority["DEF%"] ?? "0",
        champion.statsPriority.DEF ?? "0",
        champion.statsPriority["HP%"] ?? "0",
        champion.statsPriority.HP ?? "0",
        champion.statsPriority.RESI ?? "0",
        champion.statsPriority.SPD ?? "0",
        champion.gauntletStats.join(","),
        champion.chestplateStats.join(","),
        champion.bootsStats.join(","),
      ].map((v) => (v !== undefined ? String(v) : ""));
    });

    const header = [
      "champion",
      "order",
      "methods",
      "sets",
      "stats_priority_acc",
      "stats_priority_atkp",
      "stats_priority_atk",
      "stats_priority_cdmg",
      "stats_priority_crate",
      "stats_priority_defp",
      "stats_priority_def",
      "stats_priority_hpp",
      "stats_priority_hp",
      "stats_priority_resi",
      "stats_priority_spd",
      "gauntlet_stats",
      "chestplate_stats",
      "boots_stats",
    ];

    exportCSV([header, ...rows], "champions.csv");
  };

  const exportArtifacts = () => {
    const rows = artifacts.map((artifact) => {
      return [
        artifact.Slot,
        artifact.Set,
        artifact.Quality,
        RarityString[artifact.Rarity],
        artifact.Level,
        artifact.Champion,
        artifact.MainStats,
        artifact.MainStatsValue,
        artifact.SubStats[0]?.Stats,
        artifact.SubStats[0]?.Value,
        artifact.SubStats[0]?.Roll,
        artifact.SubStats[0]?.Rune,
        artifact.SubStats[1]?.Stats,
        artifact.SubStats[1]?.Value,
        artifact.SubStats[1]?.Roll,
        artifact.SubStats[1]?.Rune,
        artifact.SubStats[2]?.Stats,
        artifact.SubStats[2]?.Value,
        artifact.SubStats[2]?.Roll,
        artifact.SubStats[2]?.Rune,
        artifact.SubStats[3]?.Stats,
        artifact.SubStats[3]?.Value,
        artifact.SubStats[3]?.Roll,
        artifact.SubStats[3]?.Rune,
      ].map((v) => (v !== undefined ? String(v) : ""));
    });

    const header = [
      "slot",
      "set",
      "quality",
      "rarity",
      "lvl",
      "champion",
      "main_stat",
      "main_value",
      "sub_stat_1",
      "sub_value_1",
      "sub_rolls_1",
      "sub_rune_1",
      "sub_stat_2",
      "sub_value_2",
      "sub_rolls_2",
      "sub_rune_2",
      "sub_stat_3",
      "sub_value_3",
      "sub_rolls_3",
      "sub_rune_3",
      "sub_stat_4",
      "sub_value_4",
      "sub_rolls_4",
      "sub_rune_4",
    ];

    exportCSV([header, ...rows], "artifacts.csv");
  };

  const fileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length === 1) {
      const reader = new FileReader();
      reader.onload = (csv: ProgressEvent<FileReader>) => {
        setTextareaValue((csv.target?.result as string) ?? "");
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <Stack>
      <Button variant="danger" onClick={handleShow}>
        {lang.btnImportArtifactsOrChampions}
      </Button>
      <Button variant="success" onClick={exportChampions}>
        {lang.btnExportChampions}
      </Button>
      <Button variant="success" onClick={exportArtifacts}>
        {lang.btnExportArtifacts}
      </Button>
      <Modal
        title={lang.titleImportCSV}
        content={
          <Stack>
            <span className="badge badge-warning">
              <strong>{lang.commonWarning}</strong>:{" "}
              {lang.messageImportOverrideData}
            </span>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="fileImport"
                accept=".csv"
                onChange={fileUpload}
              />
              <label className="custom-file-label" htmlFor="fileImport">
                {lang.optionChooseCSVFile}
              </label>
            </div>
            <Textarea
              value={textareaValue}
              onChange={(e) => {
                setTextareaValue(e.target.value);
              }}
            />
          </Stack>
        }
        show={showModalImport}
        onSave={onImport}
        onClose={handleClose}
      />
    </Stack>
  );
};
