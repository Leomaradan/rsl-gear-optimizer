import React, { useMemo, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import styled from "styled-components";

import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguage, ILanguageChampion } from "../../lang/language";
import type { IChampion, IProfile } from "../../models";
import ChampionDetails from "../ChampionDetails/ChampionDetails";
import ChampionDisplay from "../UI/ChampionDisplay";
import Modal from "../UI/Modal";
import Stack from "../UI/Stack";
import Toggle from "../UI/Toggle";

const getWeightAffinity = (champion: IChampion): number => {
  switch (champion.Affinity) {
    case "Force":
      return 200000;
    case "Magic":
      return 400000;
    case "Spirit":
      return 300000;
    default:
      return 100000;
  }
};

const getWeightRole = (champion: IChampion): number => {
  switch (champion.Role) {
    case "Attack":
      return 400000;
    case "Defense":
      return 300000;
    case "Support":
      return 200000;
    default:
      return 100000;
  }
};

const getWeightFaction = (champion: IChampion): number => {
  switch (champion.Clan) {
    case "BannerLords":
      return 1300000;
    case "Barbarians":
      return 1000000;
    case "DarkElves":
      return 300000;
    case "Demonspawn":
      return 500000;
    case "HighElves":
      return 1200000;
    case "KnightsRevenant":
      return 200000;
    case "LizardMen":
      return 800000;
    case "OgrynTribes":
      return 900000;
    case "Orcs":
      return 600000;
    case "SacredOrder":
      return 1100000;
    case "Skinwalkers":
      return 700000;
    case "UndeadHordes":
      return 400000;

    default:
      return 100000;
  }
};

const rankSort = (champion: IChampion, criteria?: ISortMethods) => {
  let score = champion.Level ?? 0;

  switch (criteria) {
    case "ACC":
      return champion.CurrentAccuracy;
    case "ATK":
      return champion.CurrentAttack;
    case "C.DMG":
      return champion.CurrentCriticalDamage;
    case "C.RATE":
      return champion.CurrentCriticalRate;
    case "DEF":
      return champion.CurrentDefense;
    case "HP":
      return champion.CurrentHP;
    case "RESI":
      return champion.CurrentResistance;
    case "SPD":
      return champion.CurrentSpeed;
    case "affinity":
      score += getWeightAffinity(champion);
      break;
    case "faction":
      score += getWeightFaction(champion);
      break;
    case "level":
      // in Level sorting, sort only by level and ignore other criteria
      return champion.Level ?? 0;
    case "power":
      return champion.Power;
    case "role":
      score += getWeightRole(champion);
      break;
    default:
      break;
  }

  switch (champion.Rarity) {
    case "Epic":
      score += 500;
      break;
    case "Legendary":
      score += 600;
      break;
    case "Rare":
      score += 400;
      break;
    case "Uncommon":
      score += 300;
      break;
    default:
      score += 200;
      break;
  }

  score += (champion.Awaken as number) * 1000;

  score += (champion.Quality as number) * 10000;

  return score;
};

const ChampionContainer = styled.div`
  gap: 10px;
  display: flex;
  flex-wrap: wrap;

  .active {
    box-shadow: 0px 0px 3px 3px rgba(181, 242, 142, 1);
  }
`;

const Stacked = styled(Stack)`
  padding: 10px;
  h2 {
    padding-left: 15px;
  }
`;

const Col = styled.div.attrs(() => ({ className: "col" }))`
  display: flex;
  gap: 10px;
  align-items: center;
  select {
    max-width: 400px;
  }
`;

type IBaseOptions = "affinity" | "faction" | "rank" | "role";
type IFilters = IBaseOptions | "sets" | "tags";
type ISortMethods =
  | IBaseOptions
  | "ACC"
  | "ATK"
  | "C.DMG"
  | "C.RATE"
  | "DEF"
  | "HP"
  | "RESI"
  | "SPD"
  | "level"
  | "power";

const grouping: ISortMethods[] = ["affinity", "faction", "role"];

const ChampionsList = (profile: IProfile): JSX.Element => {
  const { slug } = useParams<{ slug?: string }>();
  const history = useHistory();
  const { champions } = profile;

  const [sortMethod, updateSortMethod] = useState<ISortMethods>("rank");
  const [group, setGroup] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filter, setFilter] = useState<{
    type: IFilters;
    value: string;
  } | null>(null);

  const lang = useLanguage();

  const selectedChampion = champions.find((c) => c.Slug === slug);

  const selectedName =
    selectedChampion !== undefined
      ? lang.champion[selectedChampion.Name as keyof ILanguageChampion]
      : "";

  const sorted = useMemo(() => {
    const championsToSort = [...champions];

    return championsToSort.sort((a, b) => {
      const scoreA = rankSort(a, sortMethod);
      const scoreB = rankSort(b, sortMethod);

      return scoreB - scoreA;
    });
  }, [champions, sortMethod]);

  const sortedGrouped = useMemo(() => {
    let field: keyof IChampion | "" = "";
    let langKey: keyof ILanguage | "" = "";
    switch (sortMethod) {
      case "affinity":
        field = "Affinity";
        langKey = "affinity";
        break;
      case "faction":
        field = "Clan";
        langKey = "clan";
        break;
      case "role":
        field = "Role";
        langKey = "role";
        break;
      default:
        break;
    }

    if (!group || field === "") {
      return [{ champions: sorted, text: lang.ui.option.groupAllChampions }];
    }

    const grouped: Record<
      string,
      { text: string; champions: IChampion[] }
    > = {};

    sorted.forEach((champion) => {
      const category = champion[field as keyof IChampion] as string;
      let text = category;
      if (langKey !== "") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const langCategory: any = lang[langKey as keyof ILanguage];
        text = langCategory[category];
      }

      if (!grouped[category]) {
        grouped[category] = { champions: [], text };
      }

      grouped[category].champions.push(champion);
    });

    return Object.values(grouped);
  }, [group, lang, sortMethod, sorted]);

  const handleUpdateSortMethod = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    updateSortMethod((event?.target?.value as ISortMethods) ?? "rank");
  };

  return (
    <>
      <Col>
        <select
          className="custom-select custom-select-sm"
          onChange={handleUpdateSortMethod}
          value={sortMethod as string}
        >
          <option value="rank">{lang.ui.option.orderByRank}</option>
          <option value="power">{lang.ui.option.orderByPower}</option>
          <option value="level">{lang.ui.option.orderByLevel}</option>
          <option value="affinity">{lang.ui.option.orderByAffinity}</option>
          <option value="role">{lang.ui.option.orderByRole}</option>
          <option value="faction">{lang.ui.option.orderByFaction}</option>
          <option value="HP">{lang.ui.option.orderByHP}</option>
          <option value="ATK">{lang.ui.option.orderByAttack}</option>
          <option value="DEF">{lang.ui.option.orderByDefense}</option>
          <option value="SPD">{lang.ui.option.orderBySpeed}</option>
          <option value="C.RATE">{lang.ui.option.orderByCriticalRate}</option>
          <option value="C.DMG">{lang.ui.option.orderByCriticalDamage}</option>
          <option value="RESIST">{lang.ui.option.orderByResistance}</option>
          <option value="ACC">{lang.ui.option.orderByAccuracy}</option>
        </select>
        <Toggle
          currentState={group}
          disabled={!grouping.includes(sortMethod)}
          label={lang.ui.option.group}
          name="mustGroup"
          onToggle={setGroup}
        />
      </Col>

      <div className="row">
        {sortedGrouped.map((category) => (
          <Stacked key={category.text}>
            {sorted.length > 1 && <h2>{category.text}</h2>}
            <ChampionContainer className="col">
              {category.champions.map((champion) => {
                const selected = selectedChampion === champion;

                const to = selected
                  ? "/champions"
                  : `/champions/${champion.Slug}`;
                const active = selected ? "active" : "";

                return (
                  <Link className={active} key={champion.Guid} to={to}>
                    <div>
                      <ChampionDisplay champion={champion} />
                    </div>
                  </Link>
                );
              })}
            </ChampionContainer>
          </Stacked>
        ))}

        <Modal
          content={
            <>
              {selectedChampion && (
                <ChampionDetails
                  profile={profile}
                  champion={selectedChampion}
                />
              )}
            </>
          }
          onClose={() => {
            history.goBack();
          }}
          show={!!selectedChampion}
          title={selectedName}
        />
      </div>
    </>
  );
};

export default ChampionsList;
