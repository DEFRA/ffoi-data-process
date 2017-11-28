'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const fs = require('fs')
const Code = require('code')
// const testProcess = require('../../lib/functions/process').process
let s3 = require('../../lib/s3')
// const event = require('../event.json')
const xml = fs.readFileSync('./test/data/test.XML')

lab.experiment('Test Lambda functionality post deployment', () => {
  lab.before((done) => {
    // load the test.XML file
    let params = {
      Body: xml,
      Bucket: process.env.FFOI_SLS_BUCKET,
      Key: 'fwfidata/ENT_7024/test.XML'
    }
    s3.putObject(params, (err, data) => {
      if (err) {
        return console.error(err)
      }
      // give lambda time to process the file
      setTimeout(done, 5000)
    })
  })

  lab.after((done) => {
    // delete the test files
    s3.deleteObject({
      Bucket: process.env.FFOI_SLS_BUCKET,
      Key: 'fwfidata/ENT_7024/test.XML'
    }, (err, data) => {
      Code.expect(err).to.be.null()
      for (let i = 1; i <= 10; i++) {
        s3.deleteObject({
          Bucket: process.env.FFOI_SLS_BUCKET,
          Key: 'ffoi/test' + i + '.json'
        }, (err, data) => {
          Code.expect(err).to.be.null()
          if (i === 10) {
            done()
          }
        })
      }
    })
  })

  lab.test('process', (done) => {
    // Confirm that the file has produced 10 test files
    for (let i = 1; i <= 10; i++) {
      s3.getObject({
        Bucket: process.env.FFOI_SLS_BUCKET,
        Key: 'ffoi/test' + i + '.json'
      }, (err, data) => {
        Code.expect(err).to.be.null()
        Code.expect(data).to.not.be.null()
        let ffoi = JSON.parse(data.Body)
        Code.expect(ffoi.$.stationReference).to.equal('test' + i)
        Code.expect(ffoi.SetofValues.length).to.be.greaterThan(0)
        if (i === 10) {
          done()
        }
      })
    }
  })
})
