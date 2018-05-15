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

lab.experiment('process', () => {
  lab.before(async () => {
    s3.getObject = (params) => {
      return new Promise((resolve, reject) => {
        resolve(file)
      })
    }

    s3.putObject = (params) => {
      return new Promise((resolve, reject) => {
        resolve({ ETag: '"47f693afd590c0b546bc052f6cfb4b71"' })
      })
    }
  })

  lab.test('process', async () => {
    process(event, {
      succeed: () => {
      },
      fail: (err) => {
        Code.expect(err).to.be.null()
      }
    })
  })
})
