const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const s3 = require('./s3');
const fs = require('fs');
const unlinkFile = require('util').promisify(fs.unlink);

const app = express();


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


// get file
app.get('/files/:key', (req, res) => {
	const fileKey = req.params.key
	const readStream = s3.getFileStream(fileKey)
	readStream.pipe(res)
})

app.listen(3000, () => console.log("The server is running at localhost:3000"));
