const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const formData = require('form-data');
const s3 = new AWS.S3();

const SOCKET_SERVER = 'https://socket.moochat.awesomepossum.dev:80/senddata'

async function getAudio(params) {
  try {
    const audio = await s3.getObject(params).promise();
    return audio.Body
  } catch (ex) {
    console.error(ex)
    return null
  }
}

exports.handler = async (event) => {
  let bucketName = event.Records[0].s3.bucket.name;
  let fileName = event.Records[0].s3.object.key;
  let audioFile = await getAudio({ Bucket: bucketName, Key: fileName });
  let id = fileName.split('.')[0];
  const sessionId = id.split('-')[0]
  var data = new formData()
  data.append('somefile', audioFile)
  data.append('sessionId', sessionId)
  await fetch(SOCKET_SERVER, {
    method: 'POST',
    body: data
  }).promise()
};