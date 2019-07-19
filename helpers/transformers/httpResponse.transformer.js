/**
 * Fn to return default configured headers and body specified
 * @param {Number} statusCode 
 * @param {Object} body 
 * @returns {Object} body response Object
 */
const httpResponse = (statusCode, body) => ({
    statusCode: statusCode,
    headers: {
        "Content-type" : "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(body),
});

/**
 * Fn to return return right errMsg according to error given
 * @param {Object} err 
 * @returns {Object} body response Object
 */
const errorResponse = (err) => {
    console.error(err);

    if(err == 'notfound' || err == 'not found') return httpResponse(404, { errMsg: err });
    if(err == 'user through contract process') return httpResponse(409, { errMsg: err });
    if(err == 'unknown status') return httpResponse(400, { errMsg: err });
    if(err == 'missing contract') return httpResponse(400, { errMsg: err });
    if(err == 'missing schema') return httpResponse(500, { errMsg: err });
    if(err == 'contractId is mandatory') return httpResponse(400, { errMsg: err });
    if(err == 'Contract not found') return httpResponse(404, { errMsg: err });
    if(err == 'contractId and documentType are mandatory') return httpResponse(400, { errMsg: err });
    if(err == 'change is not allowed') return httpResponse(409, { errMsg: err });
    if(err == 'contractId, documentType and fileName are mandatory') return httpResponse(400, { errMsg: err });

    //JSONSCHEMA erros
    if(err.errorType) return httpResponse(400, { errMsg: err.errorMessage });
    if(err.stack) return httpResponse(400, { errMsg: err.stack });

    return httpResponse(500, { errMsg: 'unspected error' });
};

module.exports = {
    httpResponse,
    errorResponse,
};