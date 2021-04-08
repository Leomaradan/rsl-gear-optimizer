import type React from "react";

import { useLanguage } from "../../lang/LanguageContext";
import type { ILanguageStat } from "../../lang/language";
import type { IStat } from "../../models";

interface IStatsSelectorProps {
  availableStats: IStat[];
  currentStats?: IStat;
  disabled?: boolean;
  id?: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const StatsSelector = ({
  availableStats,
  currentStats,
  disabled,
  id,
  onChange,
}: IStatsSelectorProps): JSX.Element => {
  const lang = useLanguage();
  return (
    <select
      className="custom-select custom-select-sm"
      disabled={disabled || availableStats.length === 1}
      id={id}
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

StatsSelector.defaultProps = {
  currentStats: "",
  disabled: false,
  id: undefined,
};

export default StatsSelector;
