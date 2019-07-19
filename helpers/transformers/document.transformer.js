const {
    httpResponse 
} = require('../transformers/httpResponse.transformer');
const { 
    HTTP_STATUS_CODE: _HTTP_STATUS_CODE
} = require('../schemas');

const returnSuccess = (body) => httpResponse(_HTTP_STATUS_CODE.OK, body);

module.exports = {
    returnSuccess,
};