import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        const error = createHttpError(400, 'Missing required fields: name, email, password');
        return next(error); // Ensure to return to avoid further execution
    }

    // Checking if user already exists
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = createHttpError(400, 'User already exists');
            return next(error); // Ensure to return to avoid further execution
        }

        // Creation
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            password: hashPassword,
            email,
        });

        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

const logError = (error: unknown) => console.error("Error:", error);

// Helper to get JWT secret
const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return secret;
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        // Validation
        if (!email || !password) {
            throw createHttpError(400, "Missing required fields: email or password");
        }

        // Find user
        const isUser = await User.findOne({ email });
        if (!isUser) {
            throw createHttpError(401, "Invalid credentials");
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, isUser.password);
        if (!isValidPassword) {
            throw createHttpError(401, "Invalid credentials");
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: isUser._id, email: isUser.email },
            getJwtSecret(),
            { expiresIn: "1h" }
        );

        // Set token in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure only in production
            sameSite: "strict",
            maxAge: 3600000, // 1 hour in milliseconds
            path: "/",
        });

        // Send success response
        res.status(201).json({ message: "Login successful" });
    } catch (error) {
        logError(error); // Log for debugging

        if (error instanceof Error) {
            return next(
                createHttpError.isHttpError(error)
                    ? error
                    : createHttpError(500, "Internal server error")
            );
        }
        next(createHttpError(500, "Unknown error occurred"));
    }
};

export { createUser,loginUser };