CREATE TABLE `family_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`household` text NOT NULL,
	`date` text NOT NULL,
	`week` integer NOT NULL,
	`setting` text NOT NULL,
	`action` text NOT NULL,
	`applies` integer NOT NULL,
	`completed` integer,
	`barrier` text NOT NULL,
	`minutes` integer,
	`is_example` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `actions_owner` ON `family_actions` (`owner_id`);--> statement-breakpoint
CREATE INDEX `actions_owner_household` ON `family_actions` (`owner_id`,`household`);--> statement-breakpoint
CREATE TABLE `family_bills` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`household` text NOT NULL,
	`cycle_start` text NOT NULL,
	`cycle_end` text NOT NULL,
	`days` integer NOT NULL,
	`kwh` real NOT NULL,
	`occupants` integer,
	`event` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `bills_owner` ON `family_bills` (`owner_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `bills_owner_household_cycle` ON `family_bills` (`owner_id`,`household`,`cycle_start`,`cycle_end`);--> statement-breakpoint
CREATE TABLE `family_surveys` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`household` text NOT NULL,
	`date` text NOT NULL,
	`moment` text NOT NULL,
	`knowledge_json` text NOT NULL,
	`habits_json` text NOT NULL,
	`attitudes_json` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `surveys_owner` ON `family_surveys` (`owner_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `surveys_owner_household_moment` ON `family_surveys` (`owner_id`,`household`,`moment`);