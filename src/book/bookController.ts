import book from '../models/bookModel';
import path from 'node:path';
import fs from 'node:fs';
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import cloudinaryConfig from '../config/cloudinaryConfig';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinaryConfig();

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Log files for debugging
        console.log("req.files:", req.files);

        // Check if files were uploaded
        if (!req.files) {
            throw createHttpError(400, 'Please upload a file');
        }

        // Type assertion for Multer files
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Validate coverImage field
        if (!files.coverImage || !Array.isArray(files.coverImage) || files.coverImage.length === 0) {
            throw createHttpError(400, 'Cover image is required');
        }
        const coverImage = files.coverImage[0];
        const coverImageMimeType = coverImage.mimetype.split('/').at(-1);
        const coverImageFilename = coverImage.filename;
        const coverImageFilepath = path.resolve(__dirname, '../../public/uploads', coverImageFilename);

        // Upload cover image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(coverImageFilepath, {
            filename_override: coverImageFilename,
            folder: "bookstore",
            format: coverImageMimeType,
        });

        // // Validate book PDF field (using 'book' instead of 'file' for consistency)
        // if (!files.file || !Array.isArray(files.book) || files.book.length === 0) {
        //     throw createHttpError(400, 'Book PDF file is required');
        // }
        const bookFile = files.file[0];
        const bookFileName = bookFile.filename;
        const bookFilePath = path.resolve(__dirname, '../../public/uploads', bookFileName);
        const bookFileType = bookFile.mimetype.split('/').at(-1)
        // Upload book PDF to Cloudinary
        const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: "raw",
            filename_override: bookFileName,
            folder: "book-pdfs",
            format: bookFileType,
        });

        // Log results
        console.log("Book PDF upload result:", bookFileUploadResult);
        console.log("Cover image upload result:", uploadResult);

        // Book data from request body
        const { title, author, genre } = req.body;
        if (!title || !author || !genre) {
            throw createHttpError(400, 'Missing required fields: title, author, genre');
        }

        // Check for duplicate book
        const isBookExist = await book.findOne({ title });
        if (isBookExist) {
            throw createHttpError(400, 'Book already exists');
        }

        // Create new book with schema-aligned fields
        const newBook = new book({
            title,
            author,
            genre,
            coverImage: uploadResult.secure_url, // Match schema field name
            file: bookFileUploadResult.secure_url, // Match schema field name
        });
        await newBook.save();


        //delete files from local storage
        try {
            await fs.promises.unlink(coverImageFilepath);
        await fs.promises.unlink(bookFilePath);

        } catch (error) {
            console.error("Error deleting files:", error);
            // Handle error if needed, but don't throw to avoid crashing the server                                                                                                 
        }
        

        // Send response
        res.status(201).json({
            message: "Book created successfully",
            book: newBook,
        });
    } catch (error) {
        console.error("Error in createBook:", error);
        next(
            createHttpError.isHttpError(error)
                ? error
                : createHttpError(500, 'Failed to create book')
        );
    }
};

export { createBook };