const aws = require("aws-sdk");
const { generateRandomID } = require("../utils");

const bucketName = "todo-pics-2";

const s3 = new aws.S3({
  region: "ap-southeast-1",
  accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
  secretAccessKey: `${process.env.AWS_ACCESS_KEY_SECRET}`,
  signatureVersion: "v4",
});

async function getS3Url(req, res) {
  const imageName = generateRandomID();

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 3600 * 24,
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    res.status(200).json({ uploadURL });
  } catch (e) {
    console.log(e);
  }
}

module.exports = { getS3Url };
