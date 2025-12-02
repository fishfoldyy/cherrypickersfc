const express = require("express");
const app = express();
// const data = require("./data.json");

app.use(express.static("public"));

/* app.get("/squad/:name", (req, res) => {
    const player = data[req.params.name];
    if (!player) return res.status(404).send("Error: 404 Not found");

    res.send(`
    <h1>${req.params.name}</h1>
    <p>Appearances: ${player.apps}</p>
    <p>Goals: ${player.goals}</p>
    <p>Assists: ${player.assists}</p>`
    );

}); */

// Required for Render: use PORT from environment
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on ${port}`));