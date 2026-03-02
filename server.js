require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: [
      "https://volunteer-hub-frontend-rose.vercel.app",
      
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    credentials: true,
  })
);
app.use(express.json());

// Only import working routes
const authRoutes = require("./routes/authRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const hoursRoutes = require("./routes/hoursRoutes");
app.use("/api/volunteer", require("./routes/dashboardRoutes"));
app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/hours", hoursRoutes);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});