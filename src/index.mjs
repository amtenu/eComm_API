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

app.get("/api/auth/status", (req, res) => {
  return req.session.id
    ? res.status(200).send(req.session.user) //json value containing all user info.
    : res.status(401).send({ msg: "Not autenticated" });
});

app.post("/api/cart", (req, res) => {
  
  if (!req.session.user) return res.sendStatus(401);
  const { body: item } = req;

  const { cart } = req.session;

  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }

  return res.status(201).send(item);
});

app.get("/api/cart", (req, res) => {
  
  if (!req.session.user) return res.sendStatus(401);
  
  return res.send(req.session.cart ?? []);

});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
