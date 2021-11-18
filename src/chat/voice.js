import { useAlert } from 'react-alert'
import React, { useState } from 'react'
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import { uuidv4 } from '../utils'
//import AWS from 'aws-sdk'

export default function Voice() {
  const [recordState, setRecordState] = useState()
  const alert = useAlert()
  const IDENTITY_POOL_ID = `us-east-1:7865814d-f248-428e-b1e8-88981b16f12f`
  const BUCKET_NAME = `moo-chat-voice-support`
  const REGION = `us-east-1`

  // AWS.config.update({
  //   region: REGION,
  //   credentials: AWS.CognitoIdentityCredentials({ apiVersion: '2016-04-18', IdentityPoolId: IDENTITY_POOL_ID })
  // })

  // const S3 = new AWS.S3({
  //   apiVersion: '2006-03-01',
  //   params: {
  //     Bucket: BUCKET_NAME
  //   }
  // })

  const toggleRecording = () => {
    if (!recordState || recordState === RecordState.STOP) {
      setRecordState(RecordState.START)
    } else if (recordState === RecordState.START) {
      setRecordState(RecordState.STOP)
    }
  }

  const onStop = (audioData) => {

    alert.show(`Processing your voice...`, { type: 'info', timeout: 5000 })
    const fileName = `${uuidv4()}.wav`
    // S3.upload({ Key: `original-voice/${fileName}`, Body: audioData.blob }, (err, data) => {
    //   if (err) {
    //     alert.show(`Error uploading`, { type: 'error' })
    //   }
    // });
    console.log(audioData)
  }

  return (<div>
    <label onClick={toggleRecording}>
      <i className={`fas fa-microphone record-voice ${recordState === RecordState.START ? 'recording' : ''}`}></i>
    </label>
    <AudioReactRecorder state={recordState} onStop={onStop} />
  </div>)
}