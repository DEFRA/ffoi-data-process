'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const fs = require('fs')
const Code = require('code')
const process = require('../../lib/functions/process').process
let s3 = require('../../lib/s3')
const event = require('../event.json')
const xml = fs.readFileSync('./test/data/test.XML')
let file = {
  Body: xml
}

lab.experiment('processs', () => {
  lab.before((done) => {
    s3.getObject = (params, callback) => {
      callback(null, file)
    }

    s3.putObject = (params, callback) => {
      callback(null, { ETag: '"47f693afd590c0b546bc052f6cfb4b71"' })
    }

    done()
  })

  lab.test('process', (done) => {
    process(event, { succeed: () => {
      done()
    },
      fail: (err) => {
        Code.expect(err).to.be.null()
        done()
      }})
  })
})
