import express from "express";
import bodyParser from "body-parser";
import { query, validationResult, body, matchedData } from "express-validator";

const app = express();

app.use(bodyParser.json());

app.use(express.json());

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method},${req.url}`);
  next();
};

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

const findIndexUserByID = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN === parsedId) return res.sendStatus(400);

  const userDataIndex = allUsers.findIndex((user) => user.id === parsedId);
  if (userDataIndex === -1) return res.sendStatus(404);
  req.userDataIndex = userDataIndex;
  next();
};

app.get("/", loggingMiddleware, (req, res) => {
  res.status(201).send("Hello world");
});

app.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("Must have filter ")
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 15 })
    .withMessage("Must be between 3 & 15."),
  (req, res) => {
    const result = validationResult(req); //grab validation errors by query
    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    const validatedDate = matchedData(req);
    console.log(validatedDate);

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
  }
);

app.post(
  "/api/users",
  body("username")
    .notEmpty()
    .withMessage("Not be empty")
    .isString()
    .withMessage("Must be a String")
    .isLength({ min: 2, max: 32 })
    .withMessage("username must be between 2 and 32"),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);

    // console.log(req.body);

    const { body } = req;
    const newUser = { id: allUsers[allUsers.length - 1].id + 1, ...body };
    allUsers.push(newUser);
    return res.status(201).send(newUser);
  }
);

app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  console.log(parsedId);
  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Bad Request.Invalid Id" });
  }

  const findUser = allUsers.find((user) => {
    return user.id === parsedId;
  });

  //console.log(findUser);

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

app.put("/api/users/:id", findIndexUserByID, (req, res) => {
  const { body, userDataIndex } = req;

  allUsers[userDataIndex] = { id: allUsers[userDataIndex].id, ...body }; //leave id and change everything

  return res.sendStatus(200);
});

app.patch("/api/users/:id", findIndexUserByID, (req, res) => {
  const { body, userDataIndex } = req;

  allUsers[userDataIndex] = { ...allUsers[userDataIndex], ...body };

  return res.sendStatus(200);
});

app.delete("/api/users/:id", (req, res) => {
  const { userDataIndex } = req;
  allUsers.splice(userDataIndex, 1);
  return res.sendStatus(200);
});
