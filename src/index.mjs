import express from "express";

const app = express();

const PORT = process.env.PORT | 3000;

app.get("/", (req, res) => {
  res.status(201).send("Hello world");
});

app.get("/api/users", (req, res) => {
  res.send([
    {
      id: 1,
      name: "Amanuel",
    },
    { id: 1, name: "Solomon" },
  ]);
});

app.get("/api/products", (req, res) => {
  res.send([
    {
      id: 1,
      name: "Sugar",
    },
    { id: 2, name: "Tea" },
  ]);
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
