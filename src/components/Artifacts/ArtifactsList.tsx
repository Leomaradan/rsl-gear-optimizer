import ArtifactsListGrid from "./ArtifactsListGrid";
import ArtifactsListTable from "./ArtifactsListTable";
import { State } from "redux/reducers";
import { Artifact, Slots, Rarity, ArtifactsDisplayMode } from "models";
import React from "react";

import { useSelector } from "react-redux";

interface ArtifactsListProps {
  artifacts: Artifact[];
}

const sortScore = (artifact: Artifact) => {
  let score = artifact.Level ?? 0;

  if (artifact.Champion) {
    score += 100000;
  }

  switch (artifact.Slot) {
    case Slots.Weapon:
      score += 60000;
      break;
    case Slots.Helmet:
      score += 50000;
      break;
    case Slots.Shield:
      score += 40000;
      break;
    case Slots.Gauntlets:
      score += 30000;
      break;
    case Slots.Chestplate:
      score += 20000;
      break;
    case Slots.Boots:
      score += 10000;
      break;
    default:
  }

  score += artifact.Quality * 1000;

  switch (artifact.Rarity) {
    case Rarity.Legendary:
      score += 500;
      break;
    case Rarity.Epic:
      score += 400;
      break;
    case Rarity.Rare:
      score += 300;
      break;
    case Rarity.Uncommon:
      score += 200;
      break;
    case Rarity.Common:
      score += 100;
      break;
    default:
  }

  return score;
};

export default (props: ArtifactsListProps): JSX.Element => {
  const { artifacts } = props;
  const display = useSelector(
    (state: State) => state.configuration.artifactsDisplay
  );

  const sorted = [...artifacts].sort((a, b) => {
    const scoreA = sortScore(a);
    const scoreB = sortScore(b);

    return scoreB - scoreA;
  });

  return display === ArtifactsDisplayMode.Grid ? (
    <ArtifactsListGrid artifacts={sorted} />
  ) : (
    <ArtifactsListTable artifacts={sorted} />
  );
};
