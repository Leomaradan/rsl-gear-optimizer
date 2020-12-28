import type { IChampion, IChampionMastery } from "models";
import DisplayMastery from "components/UI/MasteryDisplay";
import {
  DefenseMasteries,
  OffenseMasteries,
  SupportMasteries,
} from "data/Masteries";
import { updateChampion } from "redux/championsSlice";
import WrapperCenter from "components/UI/WrapperCenter";

import styled from "styled-components";
import { useDispatch } from "react-redux";
import React from "react";

const Table = styled.table.attrs(() => ({ className: "table" }))<{
  color1: string;
  color2: string;
}>`
  background-color: ${(p) => p.color1};
  text-align: center;
  color: white;

  tr:nth-of-type(2n + 1) {
    background-color: ${(p) => p.color2};
  }
`;

interface IChampionDetailsMasteriesProps {
  champion: IChampion;
  readOnly: boolean;
}

const ChampionDetailsMasteries = ({
  champion,
  readOnly,
}: IChampionDetailsMasteriesProps): JSX.Element => {
  const dispatch = useDispatch();

  const handleOnChange = (mastery: IChampionMastery) => {
    if (champion.Masteries.includes(mastery)) {
      const newMasteries = [...champion.Masteries].filter((m) => m !== mastery);
      dispatch(
        updateChampion({
          id: champion.Guid,
          champion: { Masteries: newMasteries },
        })
      );
    } else {
      const newMasteries = [...champion.Masteries, mastery];

      dispatch(
        updateChampion({
          id: champion.Guid,
          champion: { Masteries: newMasteries },
        })
      );
    }
  };

  const masteries = [
    {
      title: "Offense",
      data: OffenseMasteries,
      color1: "#321311",
      color2: "#211111",
    },
    {
      title: "Defense",
      data: DefenseMasteries,
      color1: "#103312",
      color2: "#142211",
    },
    {
      title: "Support",
      data: SupportMasteries,
      color1: "#121332",
      color2: "#101221",
    },
  ];

  return (
    <WrapperCenter>
      {masteries.map((table) => (
        <Table
          style={{ width: "300px" }}
          key={table.title}
          color1={table.color1}
          color2={table.color2}
        >
          <caption>{table.title}</caption>
          <tbody>
            {table.data.map((masteryRow, row) => (
              <tr key={`row-${masteryRow[0]}`}>
                {row === 0 && <td />}
                {masteryRow.map((mastery) => {
                  return (
                    <td key={mastery}>
                      <div>
                        <DisplayMastery
                          size={50}
                          mastery={mastery}
                          disabled={false}
                          onClick={() => {
                            if (!readOnly) {
                              handleOnChange(mastery);
                            }
                          }}
                          activated={champion.Masteries.includes(mastery)}
                        />
                      </div>
                    </td>
                  );
                })}
                {row === 0 && <td />}
              </tr>
            ))}
          </tbody>
        </Table>
      ))}
    </WrapperCenter>
  );
};

export default ChampionDetailsMasteries;
