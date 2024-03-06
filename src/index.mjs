import express, { response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import "./strategies/localStrategies.mjs";

import router from "./routes/index.mjs";
import { mockUsers } from "./utils/constants.mjs";
const app = express();

mongoose.connect("mongodb://localhost/ecomDb")

.then(()=>console.log("Connected to Database"))
.catch((err)=>console.log(`Error:${err}`))

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

//Crtical that Passport be defined after session initialization and before router

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

app.post("/api/auth2", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
}); //app.post("/api/auth2",passport.authenticate('google'))

app.get("/api/auth2/status", (req, res) => {
  console.log(req.user);

  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post("/api/auth2/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logOut((err) => {
    if (err) return res.sendStatus(400);
    res.sendStatus(200);
  });
});

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
