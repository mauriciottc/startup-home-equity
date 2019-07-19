
// TODO: verificar a existência de outro contrato com o mesmo cpf fora do estado de aprovação/negado
const {
    getContract: _getContract,
    listContracts: _listContracts,
    createContract: _createContract,
    updateContract:_updateContract,
    changeContractStatus: _changeContractStatus,
} = require('../services/contract.service');
const {
    contractTransformers: {
        returnSuccess: _returnSuccess,
    },
    httpResponseTransformers: {
        errorResponse: _errorResponse,
    },
} = require('../helpers/transformers');

exports.getContract = async (event, context) => {
    try {
        const {contractId} = event.pathParameters || null;
        const contract = await _getContract({contractId});
        return _returnSuccess({
            contract: contract,
        });
    } catch (error) {
        console.log(error);
        return _errorResponse(error);
    }
};

exports.listContracts = async (event, context) => {
    try {
        const {
            personalId,
            status,
        } = event.queryStringParameters || {};
        const contracts = await _listContracts({personalId, status});
        return _returnSuccess({
            count: contracts.length,
            contracts: contracts,
        });
    } catch (error) {
        return _errorResponse(error);
    }
};

exports.createContract = async (event, context) => {   
    try {
        const {contract} = JSON.parse(event.body) || null;
        const response = await _createContract({contract});
        return _returnSuccess({contract: response});
    } catch (error) {
        return _errorResponse(error);
    }
};

exports.updateContract = async (event, context) => {
    try {
        const {contract} = JSON.parse(event.body) || null;
        const {contractId} = event.pathParameters || null;
        const response = await _updateContract({contract, contractId});
        return _returnSuccess(response);
    } catch (error) {
        return _errorResponse(error);
    }
};

exports.reviewContract = async (event, context) => {
    try {
        const {contractId} = event.pathParameters || null;
        const {status} = JSON.parse(event.body) || null;
        const response = await _changeContractStatus({contractId, status});
        return _returnSuccess(response);
    } catch (error) {
        return _errorResponse(error);
    }
};