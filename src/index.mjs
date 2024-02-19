import express from "express";

const app = express();

app.use(express.json())

const PORT = process.env.PORT | 3000;

const allUsers = [
  {
    id: 1,
    name: "Amanuel",
    age: 28,
  },
  { id: 2, name: "Solomon", age: 25 },
  { id: 3, name: "Abel", age: 13 },
];

app.get("/", (req, res) => {
  res.status(201).send("Hello world");
});

app.get("/api/users", (req, res) => {
  console.log(req.query);

  const {
    query: { filter, value },
  } = req;

  if (!filter && !value) {
    return res.send(allUsers);
  }
  if (filter && value) {
    const filteredUsers = allUsers.filter((user) => {
      return user[filter].toLowerCase().includes(value.toLowerCase());
    });
    return res.send(filteredUsers);
  }
  res.send(allUsers);
});

app.post("/api/users",(req,res)=>{
  // console.log(req.body);

  const {body } = req;
  const newUser={id:allUsers[allUsers.length-1].id+1,...body};
  allUsers.push(newUser);
  return res.status(201).send(newUser);
})

app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  console.log(parsedId);
  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Bad Request.Invalid Id" });
  }

  const findUser = allUsers.find((user) => {
    return user.id === parsedId;
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
