import { Router } from "express";

const router = Router();

// test route
router.get("/", (req, res) => {
  res.json({ message: "Auth route working" });
});

// ✅ ADD THIS LOGIN ROUTE
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // temporary dummy login
  if (email === "test@gmail.com" && password === "123456") {
    return res.json({
      user: { email },
      accessToken: "dummy-token",
    });
  }

  return res.status(401).json({
    message: "Invalid email or password",
  });
});

export default router;