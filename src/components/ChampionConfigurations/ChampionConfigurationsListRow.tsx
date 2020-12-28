import ChampionEdit from "./ChampionConfigurationEdit";

import ChampionPortrait from "components/UI/ChampionPortrait";
import Wrapper from "components/UI/Wrapper";
import SetDisplay from "components/UI/SetDisplay";
import { useLanguage } from "lang/LanguageContext";
import { reorderChampionConfigurations } from "redux/championConfigurationsSlice";
import methodDisplay from "process/methodDisplay";
import type {
  IChampion,
  IChampionConfiguration,
  IChampionStatsPriority,
} from "models";
import type { IState } from "redux/reducers";
import type { ILanguageStat } from "lang/language";

import { Button } from "react-bootstrap";
import React from "react";
import { ArrowDown, ArrowUp } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

interface IChampionsListRowProps {
  lengthIndex: number;
  index: number;
  champion: IChampionConfiguration;
}

const Row = styled.tr<{ activated: boolean }>`
  opacity: ${(p) => (p.activated ? 1 : 0.5)};
`;

const FlatCell = styled.td``;

const ChampionConfigurationListRow = ({
  champion,
  index,
  lengthIndex,
}: IChampionsListRowProps): JSX.Element => {
  const dispatch = useDispatch();

  const lang = useLanguage();

  const sourceChampion = useSelector((redux: IState) =>
    redux.champions.find((c) => c.Guid === champion.SourceChampion)
  ) as IChampion;

  const sortStatsPriority = (statsPriority: IChampionStatsPriority) => {
    const keys = Object.keys(statsPriority) as Array<
      keyof IChampionStatsPriority
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
    dispatch(reorderChampionConfigurations({ id: name, newOrder }));
  };

  return (
    <Row key={champion.Guid} activated={champion.Activated}>
      <FlatCell>
        <ChampionPortrait champion={sourceChampion} size={100} />
      </FlatCell>
      <td>
        {champion.Sets.length === 1 &&
          champion.Sets[0].map((set) => (
            <SetDisplay key={set} set={set} size={20} />
          ))}
        {champion.Sets.length > 1 &&
          champion.Sets.map((sets) => {
            if (sets.length === 0) {
              return null;
            }
            return (
              <>
                [
                {sets.map((set) => (
                  <SetDisplay key={set} set={set} size={20} />
                ))}
                ]
              </>
            );
          })}
      </td>
      <td>
        {sortStatsPriority(champion.StatsPriority)
          .map(
            (s: string) =>
              `${lang.stat[s as keyof ILanguageStat]} (${
                champion.StatsPriority[s as keyof IChampionStatsPriority]
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

export default ChampionConfigurationListRow;
