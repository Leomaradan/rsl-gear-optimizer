import React from "react";
import type { IChampion } from "../../models";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface IChampionProgressionProps {
  champion: IChampion;
}

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

const ChampionProgression = ({ champion }: IChampionProgressionProps) => {
  const data = [];

  data.push({ name: "Lvl", value: champion.Level, realValue: champion.Level });

  data.push({
    name: "Star",
    value: champion.Quality * 10,
    realValue: champion.Quality,
  });
  data.push({
    name: "Awaken",
    value: champion.Awaken * 10,
    realValue: champion.Awaken,
  });

  data.push({
    name: "Masteries",
    value: champion.Masteries.length * 4,
    realValue: champion.Masteries.length,
  });

  const sum = data.reduce((sum, current) => (sum += current.value), 0);

  if (sum < 240) {
    data.push({
      name: "",
      value: 240 - sum,
      realValue: 0,
    });
  }

  return (
    <PieChart width={300} height={200}>
      <Legend align="left" verticalAlign="middle" layout="vertical" />
      <Pie
        dataKey="value"
        isAnimationActive={false}
        data={data}
        fill="#82ca9d"
        labelLine={false}
        label={renderCustomizedLabel}
      >
        {data.map((_entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default ChampionProgression;
