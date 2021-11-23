var AWS = require('aws-sdk');
var uuid = require('uuid');
var s3 = new AWS.S3({
  signatureVersion: 'v4',
});


exports.handler = (event, context, callback) => {
  const sessionId = event['queryStringParameters']['sessionID']
  console.log(event)
  const url = s3.getSignedUrl('putObject', {
    Bucket: 'moo-chat-voice-support',
    Key: `${sessionId}-${uuid.v4()}.wav`,
    Expires: 6000,
  });

  callback(null, url);
};