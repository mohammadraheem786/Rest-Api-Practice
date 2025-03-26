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

        // Token generation
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hour in milliseconds
            path: '/'
        });

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

export { createUser };