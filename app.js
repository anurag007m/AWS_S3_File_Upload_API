require("dotenv").config();

const express = require('express');

const app = express();

const port =3001



const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,

});

const BUCKET = process.env.BUCKET

const s3 = new aws.S3();//We're creating a new instance (a copy) of something called S3 from a package called aws-sdk. 

const upload = multer({ //setting up an object using a tool called multer
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: BUCKET,

        // We're telling multer-s3 how to name the files when they go into the bucket. We're using the original name of the uploaded file (file.originalname) as the name.
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname)
        }
    })
});


app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>File Upload</title>
        </head>
        <body>
          <h1>Upload a File</h1>
          <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="file" />
            <input type="submit" value="Upload" />
          </form>
        </body>
      </html>
    `);
  });

app.post('/upload', upload.single('file'),(req, res)=> {

    res.send('Successfully uploaded to s3 bucket')

});








app.listen(port,()=>console.log(`server started at PORT: ${port} `));