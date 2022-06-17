import express, { Request, Response} from 'express';

const app = express();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});


app.get('/', (req: Request, res: Response)=>{
    res.send('Done');
});

