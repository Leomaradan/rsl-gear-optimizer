import ChampionEdit from "./ChampionEdit";
import ChampionPortrait from "components/UI/ChampionPortrait";
import Wrapper from "components/UI/Wrapper";
import SetDisplay from "components/UI/SetDisplay";
import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import { Champion, ChampionStatsPriority } from "models/Champion";

import { reorderChampions } from "redux/championsSlice";
import methodDisplay from "process/methodDisplay";
import React from "react";
import { ArrowDown, ArrowUp } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import styled from "styled-components";

export interface ChampionsListRowProps {
  lengthIndex: number;
  index: number;
  champion: Champion;
}

const Row = styled.tr<{ activated: boolean }>`
  opacity: ${(p) => (p.activated ? 1 : 0.5)};
`;

const FlatCell = styled.td`
  padding: 0 !important;
  display: flex;
  justify-content: space-between;
  border: none !important;
`;

const ChampionContainer = styled.div`
  padding: 0.75rem;
`;

export default ({
  champion,
  index,
  lengthIndex,
}: ChampionsListRowProps): JSX.Element => {
  const dispatch = useDispatch();

  const lang = useLanguage();

  const sortStatsPriority = (statsPriority: ChampionStatsPriority) => {
    const keys = Object.keys(statsPriority) as Array<
      keyof ChampionStatsPriority
    >;
    return keys
      .filter((k) => statsPriority[k] !== 0)
      .sort(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (a: keyof Stats, b: keyof Stats) => statsPriority[b] - statsPriority[a]
      );
  };

  const updateOrder = (name: string, newOrder: number) => {
    dispatch(reorderChampions({ name, newOrder }));
  };

  return (
    <Row key={champion.name} activated={champion.activated}>
      <FlatCell>
        <ChampionContainer>
          {lang[`champion${champion.champion}` as keyof Language]}
        </ChampionContainer>

        <ChampionPortrait champion={champion.champion} size={100} />
      </FlatCell>
      <td>
        {champion.sets.map((set) => (
          <SetDisplay key={set} set={set} size={20} />
        ))}
      </td>
      <td>
        {sortStatsPriority(champion.statsPriority)
          .map(
            (s: string) =>
              `${lang[`stat${s}` as keyof Language]} (${
                champion.statsPriority[s as keyof ChampionStatsPriority]
              })`
          )
          .join(", ")}
      </td>
      <td>
        {champion.gauntletStats
          .map((s) => lang[`stat${s}` as keyof Language])
          .join(", ")}
      </td>
      <td>
        {champion.chestplateStats
          .map((s) => lang[`stat${s}` as keyof Language])
          .join(", ")}
      </td>
      <td>
        {champion.bootsStats
          .map((s) => lang[`stat${s}` as keyof Language])
          .join(", ")}
      </td>
      <td>{methodDisplay(lang, champion.methods)}</td>
      <td>
        <Wrapper>
          <ChampionEdit champion={champion} />
          {index !== 0 && (
            <button
              type="button"
              className="btn btn-info btn-sm"
              onClick={() => {
                updateOrder(champion.name, index - 1);
              }}
            >
              <ArrowUp />
            </button>
          )}
          {index !== lengthIndex && (
            <button
              type="button"
              className="btn btn-info btn-sm"
              onClick={() => {
                // We need to "push" the index to two position
                updateOrder(champion.name, index + 2);
              }}
            >
              <ArrowDown />
            </button>
          )}
        </Wrapper>
      </td>
    </Row>
  );
};
