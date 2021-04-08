import React from "react";
import { Button } from "react-bootstrap";
import { ArrowDown, ArrowUp } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageStat } from "../../lang/language";
import type {
  IChampion,
  IChampionConfiguration,
  IChampionStatsPriority,
} from "../../models";
import methodDisplay from "../../process/methodDisplay";
import { reorderChampionConfigurations } from "../../redux/championConfigurationsSlice";
import type { IState } from "../../redux/reducers";
import ChampionPortrait from "../UI/ChampionPortrait";
import SetDisplay from "../UI/SetDisplay";
import Wrapper from "../UI/Wrapper";

import ChampionEdit from "./ChampionConfigurationEdit";

interface IChampionsListRowProps {
  champion: IChampionConfiguration;
  index: number;
  lengthIndex: number;
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
    <Row activated={champion.Activated} key={champion.Guid}>
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
              onClick={() => {
                updateOrder(champion.Guid, index - 1);
              }}
              size="sm"
              variant="link"
            >
              <ArrowUp />
            </Button>
          )}
          {index !== lengthIndex && (
            <Button
              onClick={() => {
                // We need to "push" the index to two position
                updateOrder(champion.Guid, index + 2);
              }}
              size="sm"
              variant="link"
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
