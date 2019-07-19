const {
  acquisition_DB: {
    contractTable,
    contractAddressTable,
  }
} = require('../helpers/config');
const {
  createDocumentsURL: _createDocumentsURL,
} = require('./document.service');
const {
  find: _find,
  update: _update,
  insert: _insert,
} = require('../repositories/contract.repository');
const {
  normalizeContract: _normalizeContract,
} = require('../helpers/transformers/contract.transformer');
const {
  isValidstatus: _isValidstatus,
  statusConditionBuilder: _statusConditionBuilder,
  hasRequiredContractFields: _hasRequiredContractFields,
  isValidContract: _isValidContract, 
  isNewContractAble: _isNewContractAble,
  updateConditionBuilder: _updateConditionBuilder,
} = require('../helpers/validators/contract.validators');

const uuid = require('node-uuid');

/**
* fn to list contracts.
*
* @param {string} {personalId}
* @param {string} {status}
* @return {Promise<object[]>}
*/
const listContracts = async ({
  status,
  personalId,
}) => {
  const contracts = await _find({status, personalId});
  return contracts.records.map(contract => _normalizeContract({contract}));
};

/**
* fn to get a contract.
*
* @param {string} {contractId}
* @return {Promise<object>}
*/
const getContract = async ({
  contractId,
}) => {
  if(!contractId) throw new Error('contractId is mandatory');
  const response = await _find({contractId});
  if(!response.records[0]) throw new Error('Contract not found');
  //console.log('response', response);
  return _normalizeContract({contract: response.records[0]})
};

/**
* fn to create a contract.
*
* @param {Object} {contract}
* @return {Promise<object>}
*/
const createContract = async ({
  contract,
}) => {
  const contractId = uuid.v4();
  let address;

  _hasRequiredContractFields({contract})  
  _isNewContractAble(await listContracts({personalId: contract.personalId}))

  if(contract.address){
    address = {
      ...contract.address,
      postalCode: contract.address.postalCode ? contract.address.postalCode.replace(/[^0-9]/g, "") : undefined,
      contractId,
    };
    delete contract.address;
  }

  const resource = {
    ...contract, 
    contractId,
    personalId: contract.personalId.replace(/[^0-9]/g, ""),
    status: 'waiting_documents',
  };

  //TODO add begin transaction
  _isValidContract({contract: resource});
  await _insert({resource, table: contractTable});

  if(address) {
    await _insert({resource: address, table: contractAddressTable});
    delete address.contractId;
  }

  const files = [
    _createDocumentsURL({ contractId, documentType: 'personalId', contract: resource }),
    _createDocumentsURL({ contractId, documentType: 'addressProof', contract: resource }),
    _createDocumentsURL({ contractId, documentType: 'residence', contract: resource }),
  ];

  return Promise.all(files).then(fileUrls => {
    return {
      ...contract,
      contractId,
      status: resource.status,
      address: address ? address : {},
      documents: {
        personalId: fileUrls[0],
        addressProof: fileUrls[1],
        residence: fileUrls[2],
      },
    }
  }); //TODO add commit transaction and rollback
};

/**
* fn to update a contract.
*
* @param {Object} {contract}
* @param {string} {contractId}
* @return {Promise<object>}
*/
const updateContract = async ({
  contract,
  contractId,
}) => {
  let address;
  _isValidContract({contract, required: []});

  delete contract.status;
  delete contract.personalId;

  if(contract.address){
    address = {
      ...contract.address,
      postalCode: contract.address.postalCode ? contract.address.postalCode.replace(/[^0-9]/g, "") : undefined,
    };
    delete contract.address;
  }

  const contractUpated = await _update({resource: contract, table: contractTable, condition: _updateConditionBuilder({contractId})});
  let addresstUpated

  if(address){
    addresstUpated = await _update({resource: address, table: contractAddressTable});
  }

  return contractUpated || addresstUpated;
};

/**
* fn to change a status.
* Should be used when a reviewer approves or deny a contract
* @param {string} {contractId}
* @param {string} {status}
* @return {Promise<object>}
*/
const changeContractStatus = async ({
  contractId,
  status,
}) => {
  _isValidstatus({status})

  const condition = _statusConditionBuilder({status, contractId});
  const response = await _update({resource: {status}, table: contractTable, condition});
  return response;
};

module.exports = {
  listContracts,
  getContract,
  createContract,
  changeContractStatus,
  updateContract,
};