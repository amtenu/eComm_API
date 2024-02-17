import express from "express";

const app = express();

const PORT = process.env.PORT | 3000;

const allUsers = [
  {
    id: 1,
    name: "Amanuel",
  },
  { id: 2, name: "Solomon" },
];

app.get("/", (req, res) => {
  res.status(201).send("Hello world");
});

app.get("/api/users", (req, res) => {
  res.send(allUsers);
});

app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  console.log(parsedId);
  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Bad Request.InvalidId" });
  }
  
  const findUser = allUsers.find((user) => {
  return  user.id === parsedId;
  });

  console.log(findUser);

  if (!findUser) return res.sendStatus(404);

  return res.send(findUser);
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
