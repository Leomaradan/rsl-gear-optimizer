-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : ven. 09 avr. 2021 à 12:21
-- Version du serveur :  10.3.25-MariaDB-0ubuntu0.20.04.1
-- Version de PHP : 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de données : rsl
--

-- --------------------------------------------------------

--
-- Structure de la table artifact
--

DROP TABLE IF EXISTS artifact;
CREATE TABLE artifact (
  id int(10) UNSIGNED NOT NULL,
  user_id int(10) UNSIGNED NOT NULL,
  champion_id int(10) UNSIGNED DEFAULT NULL,
  slot enum('Weapon','Helmet','Shield','Gauntlets','Chestplate','Boots','Ring','Amulet','Banner') NOT NULL,
  sets enum('Life','Offense','Defense','Speed','CriticalRate','CriticalDamage','Accuracy','Resistance','Lifesteal','Fury','Daze','Cursed','Frost','Frenzy','Regeneration','Immunity','Shield','Relentless','Savage','Destroy','Stun','Toxic','Taunting','Retaliation','Avenging','Stalwart','Reflex','Curing','Cruel','Immortal','DivineOffense','DivineCriticalRate','DivineLife','DivineSpeed','SwiftParry','Deflection','Resilience','Perception') NOT NULL,
  clan enum('BannerLords','HighElves','SacredOrder','OgrynTribes','LizardMen','Skinwalkers','Orcs','Demonspawn','UndeadHordes','DarkElves','KnightsRevenant','Barbarians','Dwarves','Shadowkin') NOT NULL,
  rarity enum('Common','Uncommon','Rare','Epic','Legendary') NOT NULL DEFAULT 'Common',
  quality tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  level tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  main_stat enum('HP','HP%','ATK','ATK%','DEF','DEF%','SPD','C.RATE','C.DMG','RESI','ACC') NOT NULL,
  main_value smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  sub_stats longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  power smallint(5) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table champion
--

DROP TABLE IF EXISTS champion;
CREATE TABLE champion (
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
  power smallint(5) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'custom power calculation'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table configuration
--

DROP TABLE IF EXISTS configuration;
CREATE TABLE configuration (
  id int(10) UNSIGNED NOT NULL,
  user_id int(10) UNSIGNED NOT NULL,
  champion_id int(10) UNSIGNED NOT NULL,
  configuration longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  method enum('SpecificSets','ListSets','ListSetsNoBonus','AllSets') NOT NULL DEFAULT 'ListSets',
  activated tinyint(1) NOT NULL DEFAULT 1,
  locked tinyint(1) NOT NULL DEFAULT 0,
  accessories enum('','Ring','Amulet','Banner') NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table game
--

DROP TABLE IF EXISTS game;
CREATE TABLE game (
  user_id int(10) UNSIGNED NOT NULL,
  artifacts_display tinyint(1) NOT NULL DEFAULT 0 COMMENT 'display mode. 0 = table, 1 = grid',
  exclude_worn_artifact tinyint(1) NOT NULL DEFAULT 1 COMMENT '0 to allow permutation',
  generation_method enum('easy','real','theorical') NOT NULL DEFAULT 'real',
  arena_rank tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'index of arena rank list',
  great_hall longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table result
--

DROP TABLE IF EXISTS result;
CREATE TABLE result (
  user_id int(10) UNSIGNED NOT NULL,
  data longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table user
--

DROP TABLE IF EXISTS user;
CREATE TABLE `user` (
  id int(10) UNSIGNED NOT NULL,
  username varchar(50) NOT NULL COMMENT 'unique username',
  email varchar(100) NOT NULL COMMENT 'unique email',
  password varchar(64) NOT NULL COMMENT 'sha256 hashed password',
  token varchar(32) DEFAULT NULL COMMENT 'login token',
  verify_token varchar(32) DEFAULT NULL COMMENT 'verify token. Is set, the account must be validated',
  language enum('en','fr') NOT NULL DEFAULT 'en'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table artifact
--
ALTER TABLE artifact
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY champion_id (champion_id);

--
-- Index pour la table champion
--
ALTER TABLE champion
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY champion_ref (champion_ref);

--
-- Index pour la table configuration
--
ALTER TABLE configuration
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY champion_id (champion_id);

--
-- Index pour la table game
--
ALTER TABLE game
  ADD PRIMARY KEY (user_id);

--
-- Index pour la table result
--
ALTER TABLE result
  ADD PRIMARY KEY (user_id);

--
-- Index pour la table user
--
ALTER TABLE user
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY email (email),
  ADD UNIQUE KEY username (username);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table artifact
--
ALTER TABLE artifact
  MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table champion
--
ALTER TABLE champion
  MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table configuration
--
ALTER TABLE configuration
  MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table user
--
ALTER TABLE user
  MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table artifact
--
ALTER TABLE artifact
  ADD CONSTRAINT artifact_champion FOREIGN KEY (champion_id) REFERENCES champion (id),
  ADD CONSTRAINT artifact_user FOREIGN KEY (user_id) REFERENCES `user` (id);

--
-- Contraintes pour la table champion
--
ALTER TABLE champion
  ADD CONSTRAINT champion_user FOREIGN KEY (user_id) REFERENCES `user` (id);

--
-- Contraintes pour la table configuration
--
ALTER TABLE configuration
  ADD CONSTRAINT configuration_champion FOREIGN KEY (champion_id) REFERENCES champion (id),
  ADD CONSTRAINT configuration_user FOREIGN KEY (user_id) REFERENCES `user` (id);

--
-- Contraintes pour la table game
--
ALTER TABLE game
  ADD CONSTRAINT game_user FOREIGN KEY (user_id) REFERENCES `user` (id);

--
-- Contraintes pour la table result
--
ALTER TABLE result
  ADD CONSTRAINT result_user FOREIGN KEY (user_id) REFERENCES `user` (id);
COMMIT;
