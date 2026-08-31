import express from "express";
import { ENV } from "./config/env";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
const app = express();
app.use(cors({ origin: ENV.FRONTEND_URL }));
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  const { title } = req.body();
  res.json({
    message:
      "Welcom to Product API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
    endpoint: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
    success: true,
  });
});

app.listen(ENV.PORT, () =>
  console.log("Server is up and running on PORT:", ENV.PORT),
);
