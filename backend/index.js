
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const githubRouter = require('./routes/github'); 


dotenv.config();
connectDB();

// console.log("GitHub Token:", process.env.GITHUB_TOKEN ? "Token loaded" : "Token not found");



const app = express();


const allowedOrigins = [
  "http://localhost:5173",          
  "https://reposcout.vercel.app"   
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);




app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/match", require("./routes/match")); 
app.use('/api/github', githubRouter);

app.get("/", (req, res) => res.json({ message: "Server is working fine!" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));