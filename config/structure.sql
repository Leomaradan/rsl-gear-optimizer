SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS artifacts;
CREATE TABLE artifacts (
  id int(10) UNSIGNED NOT NULL,
  user_id int(10) UNSIGNED NOT NULL,
  champion_id int(10) UNSIGNED DEFAULT NULL,
  slot enum('Weapon','Helmet','Shield','Gauntlets','Chestplate','Boots','Ring','Amulet','Banner') NOT NULL,
  sets enum('Life','Offense','Defense','Speed','CriticalRate','CriticalDamage','Accuracy','Resistance','Lifesteal','Fury','Daze','Cursed','Frost','Frenzy','Regeneration','Immunity','Shield','Relentless','Savage','Destroy','Stun','Toxic','Taunting','Retaliation','Avenging','Stalwart','Reflex','Curing','Cruel','Immortal','DivineOffense','DivineCriticalRate','DivineLife','DivineSpeed','SwiftParry','Deflection','Resilience','Perception') DEFAULT NULL,
  clan enum('BannerLords','HighElves','SacredOrder','OgrynTribes','LizardMen','Skinwalkers','Orcs','Demonspawn','UndeadHordes','DarkElves','KnightsRevenant','Barbarians','Dwarves','Shadowkin') DEFAULT NULL,
  rarity enum('Common','Uncommon','Rare','Epic','Legendary') NOT NULL DEFAULT 'Common',
  quality tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  level tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  main_stat enum('HP','HP%','ATK','ATK%','DEF','DEF%','SPD','C.RATE','C.DMG','RESI','ACC') NOT NULL,
  main_value smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  sub_stats longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  power smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS champions;
CREATE TABLE champions (
  id int(10) UNSIGNED NOT NULL,
  user_id int(10) UNSIGNED NOT NULL,
  champion_ref smallint(5) UNSIGNED NOT NULL COMMENT 'champion id according to raid-data',
  quality tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  awaken tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  level tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  vault tinyint(1) NOT NULL DEFAULT 0,
  base_hp smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  base_acc tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  base_atk smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  base_def smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  base_crate tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  base_cdmg tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  base_res tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  base_spd tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  hp mediumint(8) UNSIGNED NOT NULL DEFAULT 0,
  acc smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  atk smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  def smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  crate smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  cdmg smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  res smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  spd smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  masteries longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'array of masteries id',
  power smallint(5) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'custom power calculation',
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS configurations;
CREATE TABLE configurations (
  id int(10) UNSIGNED NOT NULL,
  user_id int(10) UNSIGNED NOT NULL,
  champion_id int(10) UNSIGNED NOT NULL,
  configuration longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  method enum('SpecificSets','ListSets','ListSetsNoBonus','AllSets') NOT NULL DEFAULT 'ListSets',
  activated tinyint(1) NOT NULL DEFAULT 1,
  locked tinyint(1) NOT NULL DEFAULT 0,
  accessories enum('','Ring','Amulet','Banner') NOT NULL DEFAULT '',
  order int(10) UNSIGNED NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS options;
CREATE TABLE `options` (
  user_id int(10) UNSIGNED NOT NULL,
  artifacts_display tinyint(1) NOT NULL DEFAULT 0 COMMENT 'display mode. 0 = table, 1 = grid',
  exclude_worn_artifact tinyint(1) NOT NULL DEFAULT 1 COMMENT '0 to allow permutation',
  generation_method enum('easy','real','theorical') NOT NULL DEFAULT 'real',
  arena_rank tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'index of arena rank list',
  great_hall longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id int(10) UNSIGNED NOT NULL,
  username varchar(50) NOT NULL COMMENT 'unique username',
  email varchar(100) NOT NULL COMMENT 'unique email',
  password varchar(64) NOT NULL COMMENT 'sha256 hashed password',
  token varchar(32) DEFAULT NULL COMMENT 'login token',
  verify_token varchar(32) DEFAULT NULL COMMENT 'verify token. Is set, the account must be validated',
  language enum('en','fr') NOT NULL DEFAULT 'en',
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE artifacts
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY champion_id (champion_id);

ALTER TABLE champions
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY champion_ref (champion_ref);

ALTER TABLE configurations
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY champion_id (champion_id);

ALTER TABLE options
  ADD PRIMARY KEY (user_id);

ALTER TABLE users
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY email (email),
  ADD UNIQUE KEY username (username);


ALTER TABLE artifacts
  MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE champions
  MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE configurations
  MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE users
  MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT;


ALTER TABLE artifacts
  ADD CONSTRAINT artifact_champion FOREIGN KEY (champion_id) REFERENCES champions (id),
  ADD CONSTRAINT artifact_user FOREIGN KEY (user_id) REFERENCES `users` (id);

ALTER TABLE champions
  ADD CONSTRAINT champion_user FOREIGN KEY (user_id) REFERENCES `users` (id);

ALTER TABLE configurations
  ADD CONSTRAINT configuration_champion FOREIGN KEY (champion_id) REFERENCES champions (id),
  ADD CONSTRAINT configuration_user FOREIGN KEY (user_id) REFERENCES `users` (id);

ALTER TABLE options
  ADD CONSTRAINT game_user FOREIGN KEY (user_id) REFERENCES `users` (id);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
