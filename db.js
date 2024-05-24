const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

let db;

(async () => {
  try {
    db = await sqlite.open({
      filename: "./database.db",
      driver: sqlite3.Database,
    });

    await db.run(
      "CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY, username TEXT)"
    );
    await db.run(
      "CREATE TABLE IF NOT EXISTS Exercises (id INTEGER PRIMARY KEY, userId INTEGER, description TEXT, duration INTEGER, date TEXT)"
    );

    console.log("Connected to the SQLite database");
  } catch (err) {
    console.error("Failed to connect to the SQLite database", err);
  }
})();

module.exports = {
  get: () => db,
};
