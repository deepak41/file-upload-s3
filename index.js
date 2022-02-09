const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const s3 = require('./s3');
const fs = require('fs');
const unlinkFile = require('util').promisify(fs.unlink);

const app = express();
app.use(express.json()); 


// home page
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
})


// upload file
app.post('/upload', upload.single('myfile'), async (req, res) => {
	const result = await s3.uploadFile(req.file);
	await unlinkFile(req.file.path)
	res.json({
		message: "File uploaded successfully!",
		data: {imagePath: `/images/${result.Key}`}
	});
});


// download file
app.post('/file', (req, res) => {
	const readStream = s3.getFileStream(req.body.key)
	readStream.pipe(res)
})


// delete file
app.post('/delete', async(req, res) => {
	const result = await s3.deleteFile(req.body.key);
	res.json({
		message: "File deleted successfully!",
		data: {file: req.body.key}
	})
})

app.listen(7011, () => console.log("The server is running at localhost:7011"));
