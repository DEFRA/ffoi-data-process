'use strict'

console.log('Loading ffoi process function')

const xml2js = require('xml2js')
const s3 = require('../s3')

module.exports.process = (event, context) => {
  console.log('Received new event: ' + JSON.stringify(event))
  const bucket = event.Records[0].s3.bucket.name
  const key = event.Records[0].s3.object.key

  s3.getObject({Bucket: bucket, Key: key}, (err, data) => {
    if (err) {
      return context.fail(err)
    }

    xml2js.parseString(data.Body, (err, value) => {
      if (err) {
        return context.fail(err)
      }
      let count = value.EATimeSeriesDataExchangeFormat.Station.length
      value.EATimeSeriesDataExchangeFormat.Station.forEach((item) => {
        // check that the forecast is for Water Level
        if (item.SetofValues[0].$.parameter === 'Water Level') {
          // set the originating filename and the forecast created date
          item.$.key = key
          item.$.date = value.EATimeSeriesDataExchangeFormat['md:Date'][0]
          item.$.time = value.EATimeSeriesDataExchangeFormat['md:Time'][0]
          let params = {
            Body: JSON.stringify(item),
            Bucket: bucket,
            Key: 'ffoi/' + item.$.stationReference + '.json'
          }
          s3.putObject(params, (err, data) => {
            if (err) {
              console.error(err)
            } else {
              console.log('Uploaded: ' + params.Key)
            }
            count--
            if (count === 0) {
              console.log('Processed: ' + key)
              context.succeed()
            }
          })
        } else {
          count--
          if (count === 0) {
            console.log('Processed: ' + key)
            context.succeed()
          }
        }
      })
    })
  })
}
