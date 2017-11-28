const AWS = require('aws-sdk')
const agent = require('proxy-agent')
const s3 = new AWS.S3()

// Set the proxy agent if we have a http_proxy var
AWS.config.httpOptions = {
  agent: process.env.http_proxy ? agent(process.env.http_proxy) : AWS.config.httpOptions.agent
}

module.exports.getObject = (params, callback) => {
  s3.getObject(params, callback)
}

module.exports.putObject = (params, callback) => {
  s3.putObject(params, callback)
}

module.exports.deleteObject = (params, callback) => {
  s3.deleteObject(params, callback)
}
