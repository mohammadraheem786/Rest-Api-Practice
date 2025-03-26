
import app from './src/app'
import dotenv from 'dotenv' 
import connectDb from './src/config/db';

dotenv.config();



const startServer = async ()=>{
    //connect database
    await connectDb();
    //server part
    const port = process.env.PORT || 3000;
          app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
    });
}

 startServer();