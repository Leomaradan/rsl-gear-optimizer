import React from "react";
import type { IArtifact, IChampion, IProfile } from "../../models";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import calculateChampionStats from "../../process/calculateChampionStats";
import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageStat } from "../../lang/language";

const StatsMax = {
  ACC: 718,
  ATK: 9174,
  "C.DMG": 358,
  "C.RATE": 250,
  DEF: 8279,
  HP: 171570,
  RESI: 738,
  SPD: 388,
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "transparent"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (props: any) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,

    realValue,
    name,
  } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (name === "") {
    return <></>;
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {realValue}
    </text>
  );
};

interface IChampionDetailsStatsProps {
  artifacts: IArtifact[];
  champion: IChampion;
  profile: IProfile;
}

const ChampionDetailsStatsChart = ({
  champion,
  artifacts,
  profile,
}: IChampionDetailsStatsProps) => {
  const data: { subject: string; value: number; fullMark: number }[] = [];

  const lang = useLanguage();

  const stats = calculateChampionStats(
    champion,
    artifacts,
    profile.gameProgression
  );

  Object.keys(stats).map((statKey) => {
    const stat = stats[statKey];

    const statMax = StatsMax[statKey as keyof typeof StatsMax];
    const ratio = Math.round((stat.total / statMax) * 100);

    data.push({
      subject: lang.stat[statKey as keyof ILanguageStat],
      value: ratio,
      fullMark: statMax,
    });
  });

  console.log({ data });

  return (
    <RadarChart outerRadius={90} width={730} height={250} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis angle={30} domain={[0, 150]} />
      <Radar dataKey="value" stroke="#8884d8" fill="#8884d8" />
    </RadarChart>
  );
};

export default ChampionDetailsStatsChart;
