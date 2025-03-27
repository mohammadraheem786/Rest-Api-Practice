import mongoose from 'mongoose';
import { books } from '../book/bookTypes';

const bookScheme = new mongoose .Schema<books>({
    title: {
        type: String,
        reuired : true
    },
    author : {
        type: String,
        required: true
    },
    genre : {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },


},
{timestamps: true});

export default mongoose.model<books>('book',bookScheme);