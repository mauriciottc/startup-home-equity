const squel = require('squel');
const AWS = require('aws-sdk');
const RDS = new AWS.RDSDataService();
const {
  acquisition_DB: _acquisition_DB,
} = require('../helpers/config');
const {
  rdsTransformers: {
    normalizeResponse: _normalizeResponse,
  },
} = require('../helpers/transformers');
let params = {
  awsSecretStoreArn: _acquisition_DB.awsSecretStoreArn,
  dbClusterOrInstanceArn: _acquisition_DB.dbClusterOrInstanceArn,
  database: _acquisition_DB.database,
};

const find = async ({
  contractId,
  personalId,
  status,
}) => {
  let sqlStatements = squel.select()
    .from(_acquisition_DB.contractTable, 'c' )
    .left_join(_acquisition_DB.contractAddressTable, null, squel.expr().and(`c.contractId = ${_acquisition_DB.contractAddressTable}.contractId`));

  if(contractId) sqlStatements.where(`c.contractId = '${contractId}'`);
  if(personalId) sqlStatements.where(`personalId = '${personalId.replace(/[^0-9]/g, "")}'`);
  if(status) sqlStatements.where(`status = '${status}'`);

  params.sqlStatements = sqlStatements.toString();

  const {sqlStatementResults} = await RDS.executeSql(params).promise();
  return _normalizeResponse({sqlStatementResults}).data[0];
};

const insert = async ({
  resource,
  table,
}) => {
  params.sqlStatements = squel.insert()
    .into(table)
    .setFields(resource)
    .toString();

  const response = await RDS.executeSql(params).promise();
  return response;
};

const update = async ({
  resource,
  condition,
  table,
}) => {
  let sqlStatements = squel.update()
    .table(table)
    .setFields(resource);

  if(condition) sqlStatements.where(condition);
  params.sqlStatements = sqlStatements.toString();
  const {sqlStatementResults} = await RDS.executeSql(params).promise();
  return sqlStatementResults[0];
};

const beginTransaction = async () => {
  return await RDS.beginTransaction(params);
}

const commitTransaction = async ({transactionId}) => {
  return await RDS.commitTransaction({params, transactionId});
};

module.exports = {
  beginTransaction,
  commitTransaction,
  find,
  insert,
  update,
};