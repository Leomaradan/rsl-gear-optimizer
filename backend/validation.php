<?php
declare (strict_types = 1);

define('ARTIFACT_VALIDATION', [
    '*.Slot' => 'required|contains,Weapon;Helmet;Shield;Gauntlets;Chestplate;Boots;Ring;Amulet;Banner',
    '*.Set' => 'contains,Life;Offense;Defense;Speed;CriticalRate;CriticalDamage;Accuracy;Resistance;Lifesteal;Fury;Daze;Cursed;Frost;Frenzy;Regeneration;Immunity;Shield;Relentless;Savage;Destroy;Stun;Toxic;Taunting;Retaliation;Avenging;Stalwart;Reflex;Curing;Cruel;Immortal;DivineOffense;DivineCriticalRate;DivineLife;DivineSpeed;SwiftParry;Deflection;Resilience;Perception',
    '*.Clan' => 'contains,BannerLords;HighElves;SacredOrder;OgrynTribes;LizardMen;Skinwalkers;Orcs;Demonspawn;UndeadHordes;DarkElves;KnightsRevenant;Barbarians;Dwarves;Shadowkin',
    '*.Rarity' => 'required|contains,Common;Uncommon;Rare;Epic;Legendary',
    '*.Quality' => 'required|integer|min_numeric,1|max_numeric,6',
    '*.Level' => 'required|integer|min_numeric,0|max_numeric,16',
    '*.MainStats' => 'required|contains,HP;HP%;ATK;ATK%;DEF;DEF%;SPD;C.RATE;C.DMG;RESI;ACC',
    '*.MainValue' => 'integer|min_numeric,0',
    '*.Champion' => 'integer',
    '*.SubStats' => 'max_len,4',
    '*.SubStats.*.Stats' => 'required|contains,HP;HP%;ATK;ATK%;DEF;DEF%;SPD;C.RATE;C.DMG;RESI;ACC',
    '*.SubStats.*.Value' => 'required|integer|min_numeric,0',
    '*.SubStats.*.Rune' => 'required|integer|min_numeric,0',
    '*.SubStats.*.Roll' => 'required|integer|min_numeric,0',
    '*.Power' => 'required|integer|min_numeric,0',
]);

define('CHAMPION_VALIDATION', [
    'champion_ref' => 'required|integer|min_numeric,0',
    'quality' => 'required|integer|min_numeric,0|max_numeric,6',
    'awaken' => 'required|integer|min_numeric,0|max_numeric,6',
    'level' => 'required|integer|min_numeric,0|max_numeric,60',
    'vault' => 'required|boolean',
    'baseHp' => 'required|integer|min_numeric,0',
    'baseAcc' => 'required|integer|min_numeric,0',
    'baseAtk' => 'required|integer|min_numeric,0',
    'baseDef' => 'required|integer|min_numeric,0',
    'baseCrate' => 'required|integer|min_numeric,0',
    'baseCdmg' => 'required|integer|min_numeric,0',
    'baseRes' => 'required|integer|min_numeric,0',
    'baseSpd' => 'required|integer|min_numeric,0',
    'currentHp' => 'required|integer|min_numeric,0',
    'currentAcc' => 'required|integer|min_numeric,0',
    'currentAtk' => 'required|integer|min_numeric,0',
    'currentDef' => 'required|integer|min_numeric,0',
    'currentCrate' => 'required|integer|min_numeric,0',
    'currentCdmg' => 'required|integer|min_numeric,0',
    'currentRes' => 'required|integer|min_numeric,0',
    'currentSpd' => 'required|integer|min_numeric,0',
    'masteries' => 'required',
    'masteries.*' => 'alpha',
    'power' => 'required|min_numeric,0',
]);

define('CHAMPION_FILTER', [
    'champion_ref',
    'quality',
    'awaken',
    'level',
    'vault',
    'baseHp',
    'baseAcc',
    'baseAtk',
    'baseDef',
    'baseCrate',
    'baseCdmg',
    'baseRes',
    'baseSpd',
    'currentHp',
    'currentAcc',
    'currentAtk',
    'currentDef',
    'currentCrate',
    'currentCdmg',
    'currentRes',
    'currentSpd',
    'masteries',
    'power',
]);

define('CONFIGURATION_VALIDATION', [
    'champion' => 'required;integer',
    'sets.*.*' => 'contains,Life;Offense;Defense;Speed;CriticalRate;CriticalDamage;Accuracy;Resistance;Lifesteal;Fury;Daze;Cursed;Frost;Frenzy;Regeneration;Immunity;Shield;Relentless;Savage;Destroy;Stun;Toxic;Taunting;Retaliation;Avenging;Stalwart;Reflex;Curing;Cruel;Immortal;DivineOffense;DivineCriticalRate;DivineLife;DivineSpeed;SwiftParry;Deflection;Resilience;Perception',
    'statsPriority.ACC' => 'integer|min_numeric,0|max_numeric,3',
    'statsPriority.ACC_Max' => 'integer|min_numeric,0',
    'statsPriority.ATK' => 'integer|min_numeric,0|max_numeric,3',
    'statsPriority.ATK_Max' => 'integer|min_numeric,0',
    'statsPriority.CDMG' => 'integer|min_numeric,0|max_numeric,3',
    'statsPriority.CDMG_Max' => 'integer|min_numeric,0',
    'statsPriority.CRATE' => 'integer|min_numeric,0|max_numeric,3',
    'statsPriority.CRATE_Max' => 'integer|min_numeric,0',
    'statsPriority.DEF' => 'integer|min_numeric,0|max_numeric,3',
    'statsPriority.DEF_Max' => 'integer|min_numeric,0',
    'statsPriority.HP' => 'integer|min_numeric,0|max_numeric,3',
    'statsPriority.HP_Max' => 'integer|min_numeric,0',
    'statsPriority.RESI' => 'integer|min_numeric,0|max_numeric,3',
    'statsPriority.RESI_Max' => 'integer|min_numeric,0',
    'statsPriority.SPD' => 'integer|min_numeric,0|max_numeric,3',
    'statsPriority.SPD_Max' => 'integer|min_numeric,0',
    'gauntletStats.*' => 'contains,HP;HP%;ATK;ATK%;DEF;DEF%;C.RATE;C.DMG',
    'chestplateStats.*' => 'contains,HP;HP%;ATK;ATK%;DEF;DEF%;RESI;ACC',
    'bootsStats.*' => 'contains,HP;HP%;ATK;ATK%;DEF;DEF%;SPD',
    'ringsStats.*' => 'contains,HP;ATK;DEF',
    'auletsStats.*' => 'contains,HP;ATK;DEF;C.DMG',
    'bannersStats.*' => 'contains,HP;ATK;DEF;RESI;ACC',
    'method' => 'required;contains,SpecificSets;ListSets;ListSetsNoBonus;AllSets',
    'activated' => 'required;boolean',
    'locked' => 'required;boolean',
    'accessories' => 'contains,ring;amulet;banner',
]);

define('OPTIONS_VALIDATION', [
    'language' => 'required|contains,en;fr',
    'artifactsDisplay' => 'required|boolean',
    'excludeWornArtifact' => 'required|boolean',
    'generationMethod' => 'required|contains,easy;real;theorical',
    'arenaRank' => 'required|integer|min_numeric,0|max_numeric,12',
    'greatHall.Force.ACC' => 'required|integer|min_numeric,0',
    'greatHall.Force.ATK' => 'required|integer|min_numeric,0',
    'greatHall.Force.CDMG' => 'required|integer|min_numeric,0',
    'greatHall.Force.DEF' => 'required|integer|min_numeric,0',
    'greatHall.Force.HP' => 'required|integer|min_numeric,0',
    'greatHall.Force.RESI' => 'required|integer|min_numeric,0',
    'greatHall.Magic.ACC' => 'required|integer|min_numeric,0',
    'greatHall.Magic.ATK' => 'required|integer|min_numeric,0',
    'greatHall.Magic.CDMG' => 'required|integer|min_numeric,0',
    'greatHall.Magic.DEF' => 'required|integer|min_numeric,0',
    'greatHall.Magic.HP' => 'required|integer|min_numeric,0',
    'greatHall.Magic.RESI' => 'required|integer|min_numeric,0',
    'greatHall.Spirit.ACC' => 'required|integer|min_numeric,0',
    'greatHall.Spirit.ATK' => 'required|integer|min_numeric,0',
    'greatHall.Spirit.CDMG' => 'required|integer|min_numeric,0',
    'greatHall.Spirit.DEF' => 'required|integer|min_numeric,0',
    'greatHall.Spirit.HP' => 'required|integer|min_numeric,0',
    'greatHall.Spirit.RESI' => 'required|integer|min_numeric,0',
    'greatHall.Void.ACC' => 'required|integer|min_numeric,0',
    'greatHall.Void.ATK' => 'required|integer|min_numeric,0',
    'greatHall.Void.CDMG' => 'required|integer|min_numeric,0',
    'greatHall.Void.DEF' => 'required|integer|min_numeric,0',
    'greatHall.Void.HP' => 'required|integer|min_numeric,0',
    'greatHall.Void.RESI' => 'required|integer|min_numeric,0',
]);

define('RESULT_VALIDATION', [
    '*.name' => 'required',
    '*.artifacts.*' => 'required|min_len,1',
    '*.score' => 'required|integer',
    '*.maxScore' => 'required|integer',
    '*.bonus.*' => 'required|string',
    '*.bonusComplete' => 'boolean',
]);

define('TOKEN_VALIDATION', [
    'id' => 'required|exact_len,32',
]);

define('LOGIN_VALIDATION', [
    'email' => 'required|valid_email',
    'password' => 'required|between_len,4;100',
]);

define('LOGIN_FILTER', [
    'email' => 'sanitize_email',
    'password' => 'trim',
]);
