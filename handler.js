const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event, context) => {
  try {
    // Extract: Get data from an S3 bucket
    const sourceBucket = 'source-bucket-name';
    const sourceKey = 'source-data-file.csv';
    const params = {
      Bucket: sourceBucket,
      Key: sourceKey,
    };
    const data = await s3.getObject(params).promise();

    // Transform: Modify the data (In this example, we convert CSV to JSON)
    const rawData = data.Body.toString();
    const jsonData = rawData.split('\n').map((line) => {
      const [name, age] = line.split(',');
      return { name, age: parseInt(age) };
    });

    // Load: Put the transformed data into another S3 bucket
    const destinationBucket = 'destination-bucket-name';
    const destinationKey = 'output-data-file.json';
    const putParams = {
      Bucket: destinationBucket,
      Key: destinationKey,
      Body: JSON.stringify(jsonData),
      ContentType: 'application/json',
    };
    await s3.putObject(putParams).promise();

    return {
      statusCode: 200,
      body: 'ETL process completed successfully!',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'ETL process failed.',
    };
  }
};
