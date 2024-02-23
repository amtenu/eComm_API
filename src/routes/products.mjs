import { Router } from "express";
const router = Router();
import { products } from "../utils/constants.mjs";

router.get("/api/products",(req,res)=>{
    res.send(products)
})
export default router;
