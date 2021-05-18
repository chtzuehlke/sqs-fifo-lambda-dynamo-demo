'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports.hello = async event => {
  const record = event["Records"][0]; //batchSize==1 -> one record
  const id = record["attributes"]["MessageGroupId"];
  const message = JSON.parse(record["body"]);

  console.log("Entity: " + id + ", Message: " + JSON.stringify(message));

  const result = await dynamodb.updateItem({
    ExpressionAttributeNames: {
      "#C": "Count"
    },
    ExpressionAttributeValues: {
      ":i": {
        N: message["increment"].toString()
      }
    },
    Key: {
      "Key": {
        S: id
      }
    },
    ReturnValues: "ALL_NEW",
    TableName: process.env.TABLE,
    UpdateExpression: "ADD #C :i"
  }).promise();

  console.log("Updated: " + JSON.stringify(result));

  await snooze(15000);
  console.log("Done (after 15s delay)");

  return;
};
