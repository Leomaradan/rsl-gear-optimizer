import type { ILanguage } from "lang/language";
import type { IChampionSetMethod } from "models";

const methodDisplay = (lang: ILanguage, method: IChampionSetMethod): string => {
  if (method === "ListSets") {
    return lang.ui.option.methodRequiredSet;
  }

  if (method === "ListSetsNoBonus") {
    return lang.ui.option.methodOptionalSets;
  }

  return lang.ui.option.methodNoSets;
};

export default methodDisplay;
