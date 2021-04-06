import DisplayMastery from "../UI/MasteryDisplay";
import WrapperCenter from "../UI/WrapperCenter";
import {
  DefenseMasteries,
  OffenseMasteries,
  SupportMasteries,
} from "../../data/Masteries";
import type { IChampion, IChampionMastery } from "../../models";
import { updateChampion } from "../../redux/championsSlice";

import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

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
          champion: { Masteries: newMasteries },
          id: champion.Guid,
        })
      );
    } else {
      const newMasteries = [...champion.Masteries, mastery];

      dispatch(
        updateChampion({
          champion: { Masteries: newMasteries },
          id: champion.Guid,
        })
      );
    }
  };

  const masteries = [
    {
      color1: "#321311",
      color2: "#211111",
      data: OffenseMasteries,
      title: "Offense",
    },
    {
      color1: "#103312",
      color2: "#142211",
      data: DefenseMasteries,
      title: "Defense",
    },
    {
      color1: "#121332",
      color2: "#101221",
      data: SupportMasteries,
      title: "Support",
    },
  ];

  return (
    <WrapperCenter>
      {masteries.map((table) => (
        <Table
          color1={table.color1}
          color2={table.color2}
          key={table.title}
          style={{ width: "300px" }}
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
                          activated={champion.Masteries.includes(mastery)}
                          disabled={false}
                          mastery={mastery}
                          onClick={() => {
                            if (!readOnly) {
                              handleOnChange(mastery);
                            }
                          }}
                          size={50}
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
