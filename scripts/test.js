const champions = require("raid-data/champions-base-info.json");

const valuesMax = {
  hp: 0,
  atk: 0,
  def: 0,
  spd: 0,
  crate: 0,
  cdmg: 0,
  resist: 0,
  acc: 0,
};

const valuesSum = {
  hp: 0,
  atk: 0,
  def: 0,
  spd: 0,
  crate: 0,
  cdmg: 0,
  resist: 0,
  acc: 0,
};

let divider = 0;

Object.values(champions).map((champion) => {
  const { stats } = require(`raid-data/champion-details/${champion.id}.json`);

  valuesMax.acc = stats.acc > valuesMax.acc ? stats.acc : valuesMax.acc;
  valuesMax.atk = stats.atk > valuesMax.atk ? stats.atk : valuesMax.atk;
  valuesMax.cdmg = stats.cdmg > valuesMax.cdmg ? stats.cdmg : valuesMax.cdmg;
  valuesMax.crate =
    stats.crate > valuesMax.crate ? stats.crate : valuesMax.crate;
  valuesMax.def = stats.def > valuesMax.def ? stats.def : valuesMax.def;
  valuesMax.hp = stats.hp > valuesMax.hp ? stats.hp : valuesMax.hp;
  valuesMax.resist =
    stats.resist > valuesMax.resist ? stats.resist : valuesMax.resist;
  valuesMax.spd = stats.spd > valuesMax.spd ? stats.spd : valuesMax.spd;

  valuesSum.acc += stats.acc;
  valuesSum.atk += stats.atk;
  valuesSum.cdmg += stats.cdmg;
  valuesSum.crate += stats.crate;
  valuesSum.def += stats.def;
  valuesSum.hp += stats.hp;
  valuesSum.resist += stats.resist;
  valuesSum.spd += stats.spd;

  divider++;
});

const valuesAvg = {
  hp: 0,
  atk: 0,
  def: 0,
  spd: 0,
  crate: 0,
  cdmg: 0,
  resist: 0,
  acc: 0,
};

Object.keys(valuesSum).forEach((key) => {
  valuesAvg[key] = valuesSum[key] / divider;
});

console.log({ valuesMax, valuesSum, valuesAvg });
