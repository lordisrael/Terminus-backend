const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const notFound = require("./middleware/not-found");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const port = process.env.PORT || 3000;


const allowedOrigins = [
  "http://localhost:3000", // for Next.js dev
  "https://terminus-4avn.vercel.app/", // when you deploy frontend
];


const app = express();
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);


app.use(notFound);

const start =  async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port} `)
        })

    } catch (error) {
        console.log(error)
    }
}
start()