const AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1",
    signatureVersion: 'v4',
});
const s3 = new AWS.S3({
    signatureVersion: 'v4',
});
const {
    document_DB: document_DB,
} = require('../helpers/config');

const dynamo = new AWS.DynamoDB();
const DB = new AWS.DynamoDB.DocumentClient()

/**
 * Creates pre-signed POST data.
 * file size limit (100B - 10MB).
 * @param key
 * @param contentType
 * @returns {Promise<object>}
 */
const createPresignedPost = async ({
    bucket, 
    key, 
    contentType, 
}) => {
    const params = {
        Expires: 10 * 60, // 10 minutes
        Bucket: bucket,
        Conditions: [
            ["content-length-range", 100, 10000000], // 10 Mb
        ],
        Fields: {
            "Content-Type": contentType,
            key: key,
        },
    };

    const response = await s3.createPresignedPost(params);
    return response;
};

/**
 * Creates pre-signed GET image data.
 * @param bucket
 * @param key
 * @param contentType
 * @returns {Promise<object>}
 */
const getPresignedUrl = async ({ 
    bucket, 
    key, 
    contentType, 
    documentType 
}) => {
    const params = {
        Expires: 300, // 5 minutes
        Bucket: bucket,
        Key: key,
    };

    const response = await s3.getSignedUrl('getObject', params);
    return {
        url: response,
        documentType,
    };
};


const find = async ({contractId, documentType}) => {
    let params = {
        TableName: document_DB.doc_table,
        KeyConditionExpression: "#cId = :a",
        ExpressionAttributeNames: {
            "#cId" : 'contractId'
        },
        ExpressionAttributeValues: {
            ":a": {"S": contractId}
        }
    };

    if(documentType) params.ProjectionExpression = `contractId, ${documentType}`;

    const response = await dynamo.query(params).promise();
    return response.Items.map(item => AWS.DynamoDB.Converter.unmarshall(item));
}

const registerDocument = async({resource}) => {
    let upExp = "SET";
    let expAttrNames = {};
    let expAttrVals = {};

    if(resource.personalId){
        upExp = `${upExp} #pid = :pid`;
        expAttrNames["#pid"] = 'personalId';
        expAttrVals[":pid"] = resource.personalId;
    }

    if(resource.addressProof){
        upExp = `${upExp} #adp = :adp`;
        expAttrNames["#adp"] = 'addressProof';
        expAttrVals[":adp"] = resource.M.addressProof;
    }

    if(resource.residence){
        upExp = `${upExp} #rs = list_append(if_not_exists(#rs, :empty_list), :newResidence)`;
        expAttrNames["#rs"] = 'residence';
        expAttrVals[":newResidence"] = [resource.residence];
        expAttrVals[":empty_list"] = [];
    }

    let params = {
        TableName: document_DB.doc_table,
        Key: {
            "contractId": resource.contractId
        },
        UpdateExpression: upExp,
        ExpressionAttributeValues: expAttrVals,
        ExpressionAttributeNames: expAttrNames,
        ReturnValues: "ALL_NEW"
    };

    const {Attributes} = await DB.update(params).promise();
    return Attributes;
}

module.exports = {
    createPresignedPost,
    find,
    registerDocument,
    getPresignedUrl,
};