const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const polly = new AWS.Polly();

async function getTxt (s3Params) {
    var params = {
        Bucket: s3Params[0], 
        Key: s3Params[1]
    };
    let text2Convert = await s3.getObject(params).promise();
    return text2Convert.Body.toString('ascii');
}

exports.handler = async (event) => {
    let bucketName = event.Records[0].s3.bucket.name;
    let fileName = event.Records[0].s3.object.key;
    let s3Params = [bucketName,fileName];
    let text2Convert = await getTxt(s3Params);
    let id = fileName.split('.')[0]; 
    
    var pollyParams = {
      OutputFormat: 'mp3',
      OutputS3BucketName: 'moo-chat-voice-polly', 
      Text: text2Convert, 
      VoiceId: 'Amy', 
      Engine: 'standard',
      OutputS3KeyPrefix: id,
      SampleRate: '8000',
      TextType: 'text'
    };
   
   console.log(pollyParams);
   
   await polly.startSpeechSynthesisTask(pollyParams, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data); // successful response
    }).promise();
};