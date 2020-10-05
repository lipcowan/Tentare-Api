BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Tentare Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Italian', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'si', 'yes', 2),
  (2, 1, 'no', 'no', 3),
  (3, 1, 'per favore', 'please', 4),
  (4, 1, 'grazie', 'thank you', 5),
  (5, 1, 'prego', 'you are welcome', 6),
  (6, 1, 'mi scusi', 'excuse me', 7),
  (7, 1, 'mi dispiace', 'i am sorry', 8),
  (8, 1, 'boun giorno', 'good morning', 9),
  (9, 1, 'bouna sera', 'good evening', 10),
  (10, 1, 'bouna notte', 'good night', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
