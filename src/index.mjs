import express, { response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";

import router from "./routes/index.mjs";
import { mockUsers } from "./utils/constants.mjs";
const app = express();

app.use(bodyParser.json());

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "Amanuel",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(router);

const PORT = process.env.PORT | 3000;

app.get("/", (req, res) => {
  req.session.visited = true;
  res.cookie("hello", "world", { maxAge: 60000 * 60 });
  res.status(201).send({ msg: "Hello" });
});

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;

  const findUser = mockUsers.find((user) => user.username == username);
  if (!findUser || findUser.password !== password) {
    return res.status(401).send({ msg: "Bad Credential" });
  }

  req.session.user = findUser;

  return res.status(200).send(findUser);
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
