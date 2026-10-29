-- AlterTable
ALTER TABLE `users` ADD COLUMN `session_version` INTEGER NOT NULL DEFAULT 0;

-- Sessions issued before this column existed carry no version and count as 0.
-- Users who already changed their password start at 1, so those older sessions
-- are rejected.
UPDATE `users` SET `session_version` = 1 WHERE `password_changed_at` IS NOT NULL;
