var AWS = require('aws-sdk');
var translate = new AWS.Translate();
var s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    
   
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key
    };
    
    const key_elements = key.split(".json");
    const object_name = key_elements[0];
    
    s3.getObject(params, function(err, data) {
        if(err){
            console.log(err, err.stack);
            callback(err);
        }
        else{
        
            //let object_data = data.Body;
            try {
                //console.log(data.Body.toString())
                let object_data = JSON.parse(data.Body.toString())
                const raw_text = object_data.results.transcripts[0]
                const from_language = object_data.results.language_code;
                console.log(raw_text, from_language)
                
                const translateParams = {
                    SourceLanguageCode: from_language.substr(0, 2),
                    TargetLanguageCode: 'en',
                    Text: raw_text.transcript
                };
                
                translate.translateText( translateParams, function(err, data) {
                    if(err){
                        console.log(err, err.stack);
                        callback(err);
                    }
                    else{
                        let translated_text = data.TranslatedText;
                        const s3params = {
                            Body: translated_text,
                            Bucket: `moo-chat-voice-translate`,
                            Key: `${object_name}.txt`};
                            s3.putObject(s3params, function(err, data) {
                                if(err){
                                    console.log(err, err.stack);
                                    callback(err);
                                } 
                                else{
                                    console.log(data);
                                    callback(null, {});
                                }
                                
                            });
                    }
                });
            }
            catch (exception) {
                //handle error
                console.error(exception);
                return {};
            }
        };
    });
}
