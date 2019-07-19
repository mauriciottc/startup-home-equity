const {
    httpResponse 
} = require('../transformers/httpResponse.transformer');
const { 
    HTTP_STATUS_CODE: _HTTP_STATUS_CODE
} = require('../schemas');

const returnSuccess = (body) => httpResponse(_HTTP_STATUS_CODE.OK, body);
const returnInternalError = (message) => httpResponse(_HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, {errMessage: message});

const normalizeContract = ({contract}) => ({
    contractId: contract.contractId,
    personalId: contract.personalId,
    name: contract.name,
    email: contract.email,
    loanValue: contract.loanValue,
    monthlyIncome: contract.monthlyIncome,
    birthDate: contract.birthDate,
    matrialStatus: contract.matrialStatus,
    status: contract.status,
    address: {
        street: contract.street,
        number: contract.number,
        complement: contract.complement,
        postalCode: contract.postalCode,
        city: contract.city,
        state: contract.state
    },
} || null);

module.exports = {
    returnSuccess,
    returnInternalError,
    normalizeContract,
};