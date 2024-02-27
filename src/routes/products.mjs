import { Router } from "express";
const router = Router();
import { products } from "../utils/constants.mjs";

router.get("/api/products", (req, res) => {
  console.log(req.headers.cookie);
  console.log(req.cookies);
  req.cookies.cookie_name && req.cookies.cookie_name === "cookie_value"
    ? res.send(products)
    : res.send({ msg: "Need a correct cookie" });
});
export default router;
