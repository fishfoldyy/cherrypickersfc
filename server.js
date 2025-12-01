const express = require("express");
const app = express();
const data = require("./data.json");

app.use(express.static("public"));

app.get("/:name", (req, res) => {
  const person = data[req.params.name];
  if (!person) return res.status(404).send("Not found");

  res.send(`
    <h1>${req.params.name}</h1>
    <p>Age: ${person.age}</p>
    <p>Gender: ${person.gender}</p>
  `);
});

// Required for Render: use PORT from environment
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on {port}`));