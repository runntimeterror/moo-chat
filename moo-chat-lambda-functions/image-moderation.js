const AWS = require('aws-sdk')
const atob = require('atob')

function getBinary(base64Image) {
  var binaryImg = atob(base64Image);
  var length = binaryImg.length;
  var ab = new ArrayBuffer(length);
  var ua = new Uint8Array(ab);
  for (var i = 0; i < length; i++) {
    ua[i] = binaryImg.charCodeAt(i);
  }
  return ab;
}

exports.handler = (event, context, callback) => {

  const request = JSON.parse(event.body);

  const DISALLOWED_LABELS = [`Explicit Nudity`,
    `Suggestive`,
    `Violence`,
    `Visually Disturbing`,
    `Rude Gestures`,
    `Drugs`,
    `Tobacco`,
    `Alcohol`,
    `Gambling`,
    `Hate Symbols`]

  //Call Rekognition  
  var rekognition = new AWS.Rekognition({ region: `us-east-1` });
  var params = {
    Image: {
      Bytes: getBinary(request.image)
    }, MinConfidence: 65
  }
  rekognition.detectModerationLabels(params, function (error, data) {
    if (error) {
      console.error(error)
      callback(Error("Detect Moderation Label - failed execution"))
      return
    }
    data.ModerationLabels.forEach(label => {
      if (DISALLOWED_LABELS.includes(label.Name)) {
        callback(null,  JSON.stringify({
          ImageModeration: `fail`,
          Description: `Image contains ${label.Name}`
        })) 
        return
      }
    })
    callback(null, JSON.stringify({
      ImageModeration: `pass`,
      Description: `Image can be posted`
    }))
  })
}