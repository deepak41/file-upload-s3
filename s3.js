require('dotenv').config();
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
	region,
	accessKeyId,
	secretAccessKey
});

// uploads a file to s3
function uploadFile(file) {
	const fileStream = fs.createReadStream(file.path)
	const params = {
		Bucket: bucketName,
		Body: fileStream,
		Key: 'my-files/' + file.originalname
	}
	return s3.upload(params).promise()
}

// downloads a file from s3
function getFileStream(fileKey) {
	const params = {
		Bucket: bucketName,
		Key: fileKey
	}
	return s3.getObject(params).createReadStream()
}

// deletes a file from s3
function deleteFile(fileName) {
	const params = {
		Bucket: bucketName,
		Key: fileName,  // my-files/img25.png
	};
	return s3.deleteObject(params).promise()
}


module.exports = {
	uploadFile,
	getFileStream,
	deleteFile
}
