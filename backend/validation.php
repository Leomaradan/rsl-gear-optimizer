<?php

declare(strict_types=1);

define('ARTIFACT_VALIDATION', [
    'slot' => 'required|contains,Weapon;Helmet;Shield;Gauntlets;Chestplate;Boots;Ring;Amulet;Banner',
    'sets' => 'contains,Life;Offense;Defense;Speed;CriticalRate;CriticalDamage;Accuracy;Resistance;Lifesteal;Fury;Daze;Cursed;Frost;Frenzy;Regeneration;Immunity;Shield;Relentless;Savage;Destroy;Stun;Toxic;Taunting;Retaliation;Avenging;Stalwart;Reflex;Curing;Cruel;Immortal;DivineOffense;DivineCriticalRate;DivineLife;DivineSpeed;SwiftParry;Deflection;Resilience;Perception',
    'clan' => 'contains,BannerLords;HighElves;SacredOrder;OgrynTribes;LizardMen;Skinwalkers;Orcs;Demonspawn;UndeadHordes;DarkElves;KnightsRevenant;Barbarians;Dwarves;Shadowkin',
    'rarity' => 'required|contains,Common;Uncommon;Rare;Epic;Legendary',
    'quality' => 'required|integer|min_numeric,1|max_numeric,6',
    'level' => 'required|integer|min_numeric,0|max_numeric,16',
    'main_stats' => 'required|contains,HP;HP%;ATK;ATK%;DEF;DEF%;SPD;C.RATE;C.DMG;RESI;ACC',
    'main_value' => 'integer|min_numeric,0',
    'champion_id' => 'integer',
    //'sub_stats' => 'max_len,4',
    'power' => 'required|integer|min_numeric,0',
]);

define('ARTIFACT_FILTER', [
    'slot',
    'sets',
    'clan',
    'rarity',
    'quality',
    'level',
    'main_stats',
    'main_value',
    'champion_id',
    'sub_stats',
    'power',
]);

define('ARTIFACT_VALIDATION_SUBSTAT', [
    'Stats' => 'required|contains,HP;HP%;ATK;ATK%;DEF;DEF%;SPD;C.RATE;C.DMG;RESI;ACC',
    'Value' => 'required|integer|min_numeric,0',
    'Rune' => 'required|integer|min_numeric,0',
    'Roll' => 'required|integer|min_numeric,0',
]);

define('ARTIFACT_FILTER_SUBSTAT', [
    'Stats',
    'Value',
    'Rune',
    'Roll',
]);

define('CHAMPION_VALIDATION', [
    'champion_ref' => 'required|integer|min_numeric,0',
    'quality' => 'required|integer|min_numeric,0|max_numeric,6',
    'awaken' => 'required|integer|min_numeric,0|max_numeric,6',
    'level' => 'required|integer|min_numeric,0|max_numeric,60',
    'vault' => 'required|boolean',
    'base_hp' => 'required|numeric|min_numeric,0',
    'base_acc' => 'required|numeric|min_numeric,0',
    'base_atk' => 'required|numeric|min_numeric,0',
    'base_def' => 'required|numeric|min_numeric,0',
    'base_crate' => 'required|numeric|min_numeric,0',
    'base_cdmg' => 'required|numeric|min_numeric,0',
    'base_res' => 'required|numeric|min_numeric,0',
    'base_spd' => 'required|numeric|min_numeric,0',
    'hp' => 'required|numeric|min_numeric,0',
    'acc' => 'required|numeric|min_numeric,0',
    'atk' => 'required|numeric|min_numeric,0',
    'def' => 'required|numeric|min_numeric,0',
    'crate' => 'required|numeric|min_numeric,0',
    'cdmg' => 'required|numeric|min_numeric,0',
    'res' => 'required|numeric|min_numeric,0',
    'spd' => 'required|numeric|min_numeric,0',
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
    'base_hp',
    'base_acc',
    'base_atk',
    'base_def',
    'base_crate',
    'base_cdmg',
    'base_res',
    'base_spd',
    'hp',
    'acc',
    'atk',
    'def',
    'crate',
    'cdmg',
    'res',
    'spd',
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
    'artifacts_display' => 'required|boolean',
    'exclude_worn_artifact' => 'required|boolean',
    'generation_method' => 'required|contains,easy;real;theorical',
    'arena_rank' => 'required|integer|min_numeric,0|max_numeric,12',
    'great_hall.Force.ACC' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Force.ATK' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Force.CDMG' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Force.DEF' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Force.HP' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Force.RESI' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Magic.ACC' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Magic.ATK' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Magic.CDMG' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Magic.DEF' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Magic.HP' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Magic.RESI' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Spirit.ACC' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Spirit.ATK' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Spirit.CDMG' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Spirit.DEF' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Spirit.HP' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Spirit.RESI' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Void.ACC' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Void.ATK' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Void.CDMG' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Void.DEF' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Void.HP' => 'required|integer|min_numeric,0|max_numeric,10',
    'great_hall.Void.RESI' => 'required|integer|min_numeric,0|max_numeric,10',
]);

define('OPTIONS_FILTER', [
    'artifacts_display',
    'exclude_worn_artifact',
    'generation_method',
    'arena_rank',
    'great_hall',
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
