'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
// const Code = require('code')
const process = require('../../lib/functions/process').process

lab.experiment('processs', () => {
  lab.test('vanilla', (done) => {
    process({}, {}, () => {
      done()
    })
  })
})
