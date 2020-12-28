import type { ILanguageStat } from "lang/language";
import { useLanguage } from "lang/LanguageContext";
import type { IStat } from "models";

import React from "react";

interface IStatsSelectorProps {
  availableStats: IStat[];
  currentStats?: IStat;
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
}: IStatsSelectorProps): JSX.Element => {
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
          {lang.stat[stat as keyof ILanguageStat]}
        </option>
      ))}
    </select>
  );
};

export default StatsSelector;
