import ChampionEdit from "./ChampionEdit";
import ChampionPortrait from "components/UI/ChampionPortrait";
import Wrapper from "components/UI/Wrapper";
import SetDisplay from "components/UI/SetDisplay";
import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import { Champion, ChampionStatsPriority } from "models/Champion";
import { reorderChampions } from "redux/championsSlice";
import methodDisplay from "process/methodDisplay";
import Button from "react-bootstrap/Button";
import React from "react";
import { ArrowDown, ArrowUp } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import styled from "styled-components";

interface ChampionsListRowProps {
  lengthIndex: number;
  index: number;
  champion: Champion;
}

const Row = styled.tr<{ activated: boolean }>`
  opacity: ${(p) => (p.activated ? 1 : 0.5)};
`;

const FlatCell = styled.td``;

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
    dispatch(reorderChampions({ id: name, newOrder }));
  };

  return (
    <Row key={champion.Guid} activated={champion.Activated}>
      <FlatCell>
        <ChampionPortrait champion={champion.Champion} size={100} />
      </FlatCell>
      <td>
        {champion.Sets.map((set) => (
          <SetDisplay key={set} set={set} size={20} />
        ))}
      </td>
      <td>
        {sortStatsPriority(champion.StatsPriority)
          .map(
            (s: string) =>
              `${lang[`stat${s}` as keyof Language]} (${
                champion.StatsPriority[s as keyof ChampionStatsPriority]
              })`
          )
          .join(", ")}
      </td>
      <td>{methodDisplay(lang, champion.Methods)}</td>
      <td>
        <Wrapper>
          <ChampionEdit champion={champion} />
          {index !== 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                updateOrder(champion.Guid, index - 1);
              }}
            >
              <ArrowUp />
            </Button>
          )}
          {index !== lengthIndex && (
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                // We need to "push" the index to two position
                updateOrder(champion.Guid, index + 2);
              }}
            >
              <ArrowDown />
            </Button>
          )}
        </Wrapper>
      </td>
    </Row>
  );
};
