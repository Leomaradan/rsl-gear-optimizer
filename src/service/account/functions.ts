import {
  ArenaRank,
  IGenerationMethod,
  IResponseAccount,
  IResponseFormatedAccount,
} from "../../models";

export const getGenerationMethod = (name: string): IGenerationMethod => {
  if (name === "easy") {
    return "Easy";
  }

  if (name === "real") {
    return "RealValue";
  }

  return "TheoricalValue";
};

export const formatResponse = (
  data: IResponseAccount
): IResponseFormatedAccount => ({
  email: data.email,
  language: data.language,
  token: data.token,
  username: data.username,
  configuration: {
    arenaRank: ArenaRank[data.option.arena_rank],
    artifactsDisplay: data.option.artifacts_display ? "Table" : "Grid",
    excludeWornArtifact: data.option.exclude_worn_artifact,
    generationMethod: getGenerationMethod(data.option.generation_method),
    greatHallBonus: {
      Force: {
        "ATK%": data.option.great_hall.Force.ATK,
        "C.DMG": data.option.great_hall.Force.CDMG,
        "DEF%": data.option.great_hall.Force.DEF,
        "HP%": data.option.great_hall.Force.HP,
        ACC: data.option.great_hall.Force.ACC,
        RESI: data.option.great_hall.Force.RESI,
      },
      Magic: {
        "ATK%": data.option.great_hall.Magic.ATK,
        "C.DMG": data.option.great_hall.Magic.CDMG,
        "DEF%": data.option.great_hall.Magic.DEF,
        "HP%": data.option.great_hall.Magic.HP,
        ACC: data.option.great_hall.Magic.ACC,
        RESI: data.option.great_hall.Magic.RESI,
      },
      Spirit: {
        "ATK%": data.option.great_hall.Spirit.ATK,
        "C.DMG": data.option.great_hall.Spirit.CDMG,
        "DEF%": data.option.great_hall.Spirit.DEF,
        "HP%": data.option.great_hall.Spirit.HP,
        ACC: data.option.great_hall.Spirit.ACC,
        RESI: data.option.great_hall.Spirit.RESI,
      },
      Void: {
        "ATK%": data.option.great_hall.Void.ATK,
        "C.DMG": data.option.great_hall.Void.CDMG,
        "DEF%": data.option.great_hall.Void.DEF,
        "HP%": data.option.great_hall.Void.HP,
        ACC: data.option.great_hall.Void.ACC,
        RESI: data.option.great_hall.Void.RESI,
      },
    },
  },
});
