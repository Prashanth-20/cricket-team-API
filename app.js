const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//GET Method

app.get("/players/", async (request, response) => {
  const playersQuery = `

       SELECT * FROM cricket_team`;

  const playersArray = await db.all(playersQuery);

  response.send(playersArray);
});

//POST Method

app.post("/players/", async (request, response) => {
  const playersDetails = request.body;

  const { playerId, playerName, jerseyNumber, role } = playersDetails;
  const playersQuery = `
    INSERT INTO
      cricket_team (player_id, player_name, jersey_number, role)
    VALUES
      ( 
         ${playerId},
        '${playerName}',
         ${jerseyNumber},
        '${role}'
      )`;

  const dbResponse = await db.run(playersQuery);
  response.send("Player Added to Team");
});

//GET

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT
      *
    FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;

  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//PUT Method

app.put("/players/:playerIdentity/", async (request, response) => {
  const { playerIdentity } = request.params;
  const playerDetails = request.body;
  const { playerId, playerName, jerseyNumber, role } = playerDetails;

  const updatePlayerDetails = `
        UPDATE
            cricket_team
        SET
            player_id = ${playerId},
            player_name = '${playerName}',
            jersey_number = ${jerseyNumber},
            role = '${role}'
        WHERE 
            player_id = ${playerId};`;

  await db.run(updatePlayerDetails);
  response.send("Player Details Updated");
});

//DELETE Method

app.delete("/players/:plyerId/", async (request, response) => {
  const { plyerId } = request.params;
  const deletePlayerDetails = `
            DELETE 
            FROM
                cricket_team
            WHERE 
             player_id = ${plyerId};`;
  await db.run(deletePlayerDetails);
  response.send("Player Removed");
});
