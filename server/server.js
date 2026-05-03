const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/projects", require("./routes/projectRoutes"));

app.use("/api/tasks", require("./routes/taskRoutes"));

app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
