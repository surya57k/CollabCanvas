const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});


// Function to add a new room
const addRoom = (owner, collaborators, callback) => {
  const collaboratorsJson = JSON.stringify(collaborators);
  db.run(
    `INSERT INTO rooms (owner, collaborators) VALUES (?, ?)`,
    [owner, collaboratorsJson],
    function (err) {
      callback(err, this?.lastID);
    }
  );
};

// Function to get a room by ID
const getRoomById = (roomId, callback) => {
  db.get(`SELECT * FROM rooms WHERE room_id = ?`, [roomId], (err, row) => {
    if (!err && row) {
      row.collaborators = JSON.parse(row.collaborators);
    }
    callback(err, row);
  });
};

// Function to update collaborators in a room
const updateCollaborators = (roomId, collaborators, callback) => {
  const collaboratorsJson = JSON.stringify(collaborators);
  db.run(
    `UPDATE rooms SET collaborators = ? WHERE room_id = ?`,
    [collaboratorsJson, roomId],
    function (err) {
      callback(err, this.changes);
    }
  );
};

// Export database connection and functions
module.exports = { db, addRoom, getRoomById, updateCollaborators };
