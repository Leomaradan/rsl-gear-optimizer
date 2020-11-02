import React from "react";
import Stats from "models/Stats";
import { Language } from "lang/language";
import { useLanguage } from "lang/LanguageContext";

export interface StatsSelectorProps {
  availableStats: Stats[];
  currentStats?: Stats;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  id?: string;
}

const StatsSelector = ({
  availableStats,
  currentStats,
  disabled,
  onChange,
  id,
}: StatsSelectorProps): JSX.Element => {
  const lang = useLanguage();
  return (
    <select
      id={id}
      className="custom-select custom-select-sm"
      disabled={disabled || availableStats.length === 1}
      onChange={onChange}
      value={currentStats}
    >
      <option value="">---</option>
      {availableStats.map((stat) => (
        <option key={stat} value={stat}>
          {lang[`stat${stat}` as keyof Language]}
        </option>
      ))}
    </select>
  );
};

export default StatsSelector;
