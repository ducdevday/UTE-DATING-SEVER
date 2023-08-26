import express, { response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import conversationRouter from "./routes/conversationRouter.js";
import reportRouter from "./routes/reportRouter.js";
import { isAuth } from "./utils.js";

const app = express();
dotenv.config();

const connect = async () => {
    try {
        const db = process.env.DATABASE.replace(
            "<password>",
            process.env.DATABASE_PASSWORD
        );
        mongoose.connect(db); // mongodb://127.0.0.1:27017/UTEDATING
        console.log("Connected to mongoDB.");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
    console.log("mongoDB connected!");
});

// middlewares
app.use(bodyParser.json({ limit: "50000mb" }));
app.use(bodyParser.urlencoded({ limit: "50000mb", extended: true }));
app.use(
    express.urlencoded({
        extended: true,
    })
);
//app.use(cors({ credentials: true, origin: true }));
app.options("*", cors({ credentials: true, origin: true }));
// app.use(cookieParser());
app.use(express.json());

app.use(
    cors({
        // origin: "http://localhost:3000",
        origin: true,
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);

app.use("/api/auth", authRouter);
app.use("/api/user", isAuth, userRouter);
app.use("/api/conversation", isAuth, conversationRouter);
app.use("/api/report", isAuth, reportRouter);
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";

    return res.status(500).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.listen(8800, () => {
    connect();
    console.log("Connected to backend");
});
