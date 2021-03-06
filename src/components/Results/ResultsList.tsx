import ArtifactDisplay from "components/UI/ArtifactDisplay";
import ProgressBar from "components/UI/ProgressBar";
import SetDisplay from "components/UI/SetDisplay";
import { useLanguage } from "lang/LanguageContext";
import { Results, ResultsRow } from "models/Results";
import React, { memo } from "react";
import { VariableSizeGrid as Grid, areEqual } from "react-window";

import AutoSizer from "react-virtualized-auto-sizer";
import styled from "styled-components";

interface ResultsListProps {
  result: Results;
  selectedItems: string[];
}

const Cell = styled.div`
  padding: 5px;
  border-bottom: 1px solid;
  border-right: 1px solid;
`;

const StripedCell = styled(Cell)<{ row: number; column: number }>`
  background-color: ${(p) =>
    p.row % 2 === 0 ? "transparent" : "var(--white)"};
  ${(p) => (p.row === 0 ? "border-top: 1px solid ;" : "")}
  ${(p) => (p.column === 0 ? "border-left: 1px solid ;" : "")}
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SelectedCell = styled(Cell).attrs(() => ({ className: "bg-info" }))<{
  row: number;
  column: number;
}>`
  ${(p) => (p.row === 0 ? "border-top: 1px solid ;" : "")}
  ${(p) => (p.column === 0 ? "border-left: 1px solid ;" : "")}
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  display: flex;
`;

const CellTitle = styled(Cell)<{ double?: boolean; first?: boolean }>`
  width: ${(p) => (p.double ? "180" : "90")}px;
  height: 70px;
  font-weight: bold;
  border-top: 1px solid #dee2e6;
  ${(p) => (p.first ? "border-left: 1px solid #dee2e6;" : "")}
`;

const Container = styled.div`
  height: calc(100% - 70px);
`;

export default ({ result, selectedItems }: ResultsListProps): JSX.Element => {
  const baseResults: ResultsRow[] = result.result.map((row) => JSON.parse(row));

  const rowIndex = 0;

  const results = baseResults.slice(rowIndex);

  const lang = useLanguage();

  const cells = [
    (i: ResultsRow, faded: boolean) => (
      <ArtifactDisplay
        size={60}
        artifact={i.artifacts[0]}
        faded={faded && selectedItems.includes(i.artifacts[0].Guid)}
      />
    ),
    (i: ResultsRow, faded: boolean) => (
      <ArtifactDisplay
        size={60}
        artifact={i.artifacts[1]}
        faded={faded && selectedItems.includes(i.artifacts[1].Guid)}
      />
    ),
    (i: ResultsRow, faded: boolean) => (
      <ArtifactDisplay
        size={60}
        artifact={i.artifacts[2]}
        faded={faded && selectedItems.includes(i.artifacts[2].Guid)}
      />
    ),
    (i: ResultsRow, faded: boolean) => (
      <ArtifactDisplay
        size={60}
        artifact={i.artifacts[3]}
        faded={faded && selectedItems.includes(i.artifacts[3].Guid)}
      />
    ),
    (i: ResultsRow, faded: boolean) => (
      <ArtifactDisplay
        size={60}
        artifact={i.artifacts[4]}
        faded={faded && selectedItems.includes(i.artifacts[4].Guid)}
      />
    ),
    (i: ResultsRow, faded: boolean) => (
      <ArtifactDisplay
        size={60}
        artifact={i.artifacts[5]}
        faded={faded && selectedItems.includes(i.artifacts[5].Guid)}
      />
    ),
    (i: ResultsRow, faded: boolean) => (
      <ArtifactDisplay
        size={60}
        artifact={i.artifacts[6]}
        faded={faded && selectedItems.includes(i.artifacts[6].Guid)}
      />
    ),
    (i: ResultsRow, faded: boolean) => (
      <ArtifactDisplay
        size={60}
        artifact={i.artifacts[7]}
        faded={faded && selectedItems.includes(i.artifacts[7].Guid)}
      />
    ),
    (i: ResultsRow, faded: boolean) => (
      <ArtifactDisplay
        size={60}
        artifact={i.artifacts[8]}
        faded={faded && selectedItems.includes(i.artifacts[8].Guid)}
      />
    ),
    (i: ResultsRow) => (
      <>
        {i.bonus.map((set, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <SetDisplay key={`${i.id}-${index}-${set}`} set={set} size={20} />
        ))}{" "}
        {!i.bonusComplete && (
          <span className="badge badge-warning">{lang.commonWarning}</span>
        )}
      </>
    ),
    (i: ResultsRow) => (
      <ProgressBar
        current={i.score}
        max={i.maxScore}
        label={`${lang.titleScore}: ${i.score}`}
      />
    ),
  ];

  interface CellProps {
    style: React.CSSProperties;
    columnIndex: number;
    rowIndex: number;
  }

  const RenderCell = memo(
    ({ columnIndex, rowIndex: row, style }: CellProps) => {
      const line = results[row];

      if (result.selected) {
        return (
          <SelectedCell row={row} column={columnIndex} style={style}>
            {cells[columnIndex](line, false)}
          </SelectedCell>
        );
      }

      return (
        <StripedCell row={row} column={columnIndex} style={style}>
          {cells[columnIndex](line, true)}
        </StripedCell>
      );
    },
    areEqual
  );

  return (
    <>
      <Title>
        <CellTitle first>{lang.slotWeapon}</CellTitle>
        <CellTitle>{lang.slotHelmet}</CellTitle>
        <CellTitle>{lang.slotShield}</CellTitle>
        <CellTitle>{lang.slotGauntlets}</CellTitle>
        <CellTitle>{lang.slotChestplate}</CellTitle>
        <CellTitle>{lang.slotBoots}</CellTitle>
        <CellTitle>{lang.slotRing}</CellTitle>
        <CellTitle>{lang.slotAmulet}</CellTitle>
        <CellTitle>{lang.slotBanner}</CellTitle>
        <CellTitle>{lang.titleBonus}</CellTitle>
        <CellTitle>{lang.titleScore}</CellTitle>
      </Title>
      <Container>
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              columnCount={11}
              columnWidth={() => 90}
              height={height}
              rowCount={results.length}
              rowHeight={() => 70}
              width={width}
            >
              {RenderCell}
            </Grid>
          )}
        </AutoSizer>
      </Container>
    </>
  );
};
