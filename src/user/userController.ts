import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import createHttpError from "http-errors";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    // Validation
    if (!name || !email || !password) {
        const error = createHttpError(400, 'Missing required fields: name, email, password');
        return next(error); // Ensure to return to avoid further execution
    }
    // Creation
    try {
        const newUser = new User({
            name,
            password,
            email
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

export { createUser };