import express, { Request, Response} from 'express';
import mongoose from 'mongoose';

const mongoosastic = require('mongoosastic');

mongoose.connect('mongodb://root:securepassword@localhost:27017/test?authSource=admin');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'database mongodb connection error:'));
db.once('open', function callback () {
  console.log("database mongodb connection established");
});

exports.test = function(req:any,res:any) {
  console.log(res)
};

var Schema = mongoose.Schema;

var bookSchema = new Schema({  
    title: String,
    author: String,
    description: { 
        type:String, 
        es_indexed:true 
    },
    content: { 
        type:String, 
        es_indexed:true 
    }
},
{
    collection: 'book-lab'
});

bookSchema.plugin(mongoosastic, {
    index: 'book-lab',
    host: "localhost",
    port: 9200,
    curlDebug: true
});

const app = express();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.get('/', (req: Request, res: Response)=>{
    var Book = mongoose.model("Book", bookSchema);
    var book = new Book({  
        title: "title",
        author: "alex",
        description: "details of book",
        content: "bla bla bla"
    });
    book.save(function(err:any){
        if (err) throw err;
        /* Document indexation on going */
        book.on('es-indexed', function(err:any, res:any){
            if (err) throw err;
            /* Document is indexed */
        });
    });

    res.send('Done');
});

