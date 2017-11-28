const AWS = require('aws-sdk')
const s3 = new AWS.S3()

module.exports.getObject = (params, callback) => {
  s3.getObject(params, callback)
}

module.exports.putObject = (params, callback) => {
  s3.putObject(params, callback)
}

module.exports.deleteObject = (params, callback) => {
  s3.deleteObject(params, callback)
}
