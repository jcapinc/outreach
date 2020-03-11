CREATE TABLE IF NOT EXISTS prayer_sheep(
	'guid' TEXT PRIMARY KEY,
	'sheepGuid' TEXT,
	'prayerGuid' TEXT,
	'isPrimary' INTEGER
);