import book from '../models/bookModel';
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
            const userbook = req.body;
            if(!userbook.title || !userbook.author || !userbook.genre) {
                return next(createHttpError(400, 'Missing required fields: name, author, price'));
            }
            const isBookExist = await book.findOne({title: userbook.title});
            if(isBookExist) {
                return next(createHttpError(400, 'Book already exists'));
            }

            try {
                const newBook = new book(userbook);
                await newBook.save();
                res.status(201).json(newBook);
            } catch (error) {
                next(error);
            }

}

export { createBook };