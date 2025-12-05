const express = require("express");
const app = express();
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const path = require("path");

app.use(express.static("public"));

let matchRows = []; // store all rows from sheet

async function loadMatches() {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-WGhIDz5Y_o_cSq0biFiqJYBS5ED_7_y-IT_Ncm7snfKB0PtN4BbNDLZUiDfiQXPO-nvE5A4_snaw/pub?gid=0&single=true&output=csv";

    const response = await fetch(url);
    const csv = await response.text();

    const rows = csv.split("\n").map(r => r.split(","));

    matchRows = rows; // store globally
    console.log("Loaded matches:", matchRows.length-1);
}

async function loadPlayers() {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-WGhIDz5Y_o_cSq0biFiqJYBS5ED_7_y-IT_Ncm7snfKB0PtN4BbNDLZUiDfiQXPO-nvE5A4_snaw/pub?gid=1229481303&single=true&output=csv";
    const response = await fetch(url);
    const csv = await response.text();
    const rows = csv.split("\n").map(r => r.split(","));

    playerRows = rows; // store globally
    console.log("Loaded players:", playerRows.length-1);
}

async function loadGoals() {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-WGhIDz5Y_o_cSq0biFiqJYBS5ED_7_y-IT_Ncm7snfKB0PtN4BbNDLZUiDfiQXPO-nvE5A4_snaw/pub?gid=583198096&single=true&output=csv";
    const response = await fetch(url);
    const csv = await response.text();
    const rows = csv.split("\n").map(r => r.split(","));

    goalRows = rows; // store globally
    console.log("Loaded goals:", goalRows.length-1);
}

loadMatches();
loadPlayers();
// loadGoals();

app.get("/fixtures/:id", (req, res) => {
    const id = parseInt(req.params.id);

    // invalid number 404
    if (isNaN(id)) {
        return res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
    }

    // out of range 404
    if (id < 1 || id >= matchRows.length) {
        return res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
    }

    const row = matchRows[id];

    // check for complete match
    if (!row[2] || !row[3]) {
        return res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
    }

    // send placeholder
    res.send(`
        Match #${id}: ${JSON.stringify(row)}
        <a href="/fixtures">Back to fixtures</a>
    `);
});

app.get("/squad/:sqNo", (req, res) => {
    const squadNumber = parseInt(req.params.sqNo);

    // invalid number 404
    if (isNaN(squadNumber)) {
        return res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
    }

    // find player whose kit number matches row[1]
    const row = playerRows.find(r => parseInt(r[1]) === squadNumber);

    // not found 404
    if (!row) {
        return res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
    }

    res.send(`
        Player with #${squadNumber}: ${JSON.stringify(row)}
        <a href="/squad">Back to squad</a>
    `);
});


// 404 route (catch all)
app.use((req, res) => {
    res.status(404).sendFile(
        path.join(__dirname, "public", "404.html")
    );
});

// Required for Render: use PORT from environment
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on ${port}`));