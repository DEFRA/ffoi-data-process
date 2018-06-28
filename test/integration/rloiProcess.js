'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const fs = require('fs')
const Code = require('code')
let s3 = require('../../lib/s3')
const xml = fs.readFileSync('./test/data/rloiTest.XML')
const files = require('../data/rloiFiles.json')

lab.experiment('Test RLOI Lambda functionality post deployment', () => {
  lab.before(async () => {
    try {
      // load the test.XML file
      let params = {
        Body: xml,
        Bucket: process.env.FFOI_SLS_BUCKET,
        Key: 'fwfidata/rloi/rloiTest.XML'
      }
      console.log('putObject: ' + params.Key)
      await s3.putObject(params)
      // give lambda time to process the file
      console.log('File loaded')
      console.log('Pause 5 seconds')
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 5000)
      })
      console.log('Pause finished')
    } catch (err) {
      throw err
    }
  })

  lab.after(async () => {
    // delete the test files
    try {
      await s3.deleteObject({ Bucket: process.env.FFOI_SLS_BUCKET, Key: 'fwfidata/rloi/rloiTest.XML' })
      console.log('Deleted: fwfidata/rloi/rloiTest.XML')
      for (let i = 0; i < files.files.length; i++) {
        await s3.deleteObject({ Bucket: process.env.FFOI_SLS_BUCKET, Key: files.files[i] })
        console.log('Deleted: ' + files.files[i])
      }
    } catch (err) {
      Code.expect(err).to.be.null()
      throw err
    }
  })

  lab.test('check for processed files', async () => {
    // Confirm that the file has produced all test files
    // TODO: bulk out some extra tests in here for data contained in files
    try {
      for (let i = 0; i < files.files.length; i++) {
        const data = await s3.getObject({Bucket: process.env.FFOI_SLS_BUCKET, Key: files.files[i]})
        Code.expect(data).to.not.be.null()
        let rloi = JSON.parse(data.Body)
        Code.expect(rloi.stationReference).to.contain('test')
        Code.expect(rloi.values.length).to.be.greaterThan(0)
        console.log('Tested: ' + files.files[i])
      }
    } catch (err) {
      Code.expect(err).to.be.null()
      throw err
    }
  })

  lab.test('process', async () => {
    Code.expect(true).to.equal(true)
  })
})
