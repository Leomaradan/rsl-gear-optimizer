import { Language } from "lang/language";
import { ChampionSetMethod } from "models";

export default (lang: Language, method: ChampionSetMethod): string => {
  if (method === ChampionSetMethod.RequireSets) {
    return lang.optionMethodRequiredSet;
  }

  if (method === ChampionSetMethod.OptionalSets) {
    return lang.optionMethodOptionalSets;
  }

  return lang.optionMethodNoSets;
};
