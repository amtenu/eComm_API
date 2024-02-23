import express from "express";
import bodyParser from "body-parser";


import usersRouter from "./routes/users.mjs";


const app = express();

app.use(bodyParser.json());

app.use(express.json());
app.use(usersRouter);

const PORT = process.env.PORT | 3000;

app.get("/", (req, res) => {
  res.status(201).send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
