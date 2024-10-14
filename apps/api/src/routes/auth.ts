import type { Router as RouterType } from "express";
import { Router } from "express";

const authRouter: RouterType = Router();
authRouter.get("/auth/signup", (req, res) => {
  res.send("hello");
});
authRouter.post("/auth/signin", (req, res) => {});
authRouter.post("/auth/refresh", (req, res) => {});

export default authRouter;
