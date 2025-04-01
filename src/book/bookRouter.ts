import path from 'node:path';
import express from 'express';
import { createBook } from './bookController';
import multer from 'multer';
const bookRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, '../../public/uploads'),
    limits: {
        fileSize: 1e7, // 10MB
    },
})

bookRouter.post('/create',upload.fields([
    {name : 'coverImage', maxCount: 1},
    {name:'file', maxCount: 1}
]),createBook); //added upload.fields middleware to handle file uploads



export default  bookRouter;