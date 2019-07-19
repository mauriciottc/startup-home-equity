const {
  createDocumentsURL: _createDocumentsURL,
  getDocument: _getDocument,
  registerDocument: _registerDocument,
} = require('../services/document.service');
const {
  documentTransformers: {
    returnSuccess: _returnSuccess,
  },
  httpResponseTransformers: {
    errorResponse: _errorResponse,
  },
} = require('../helpers/transformers');

exports.getPresignedURL = async (event, context) => {
  try {
    const { contractId, documentType } = event.pathParameters;
    const presignedURL = await _createDocumentsURL({contractId, documentType});
    return _returnSuccess(presignedURL);
  } catch (e) {
    return _errorResponse(e);
  }
};

exports.listDocuments = async (event, context) => {
  try {
    const { contractId } = event.pathParameters || {};
    const presignedURL = await _getDocument({contractId});
    return _returnSuccess({
      count: presignedURL.length,
      documents: presignedURL,
    });
  } catch (e) {
    return _errorResponse(e);
  }
};

exports.getDocument = async (event, context) => {
  try {
    const { contractId, documentType } = event.pathParameters || {};
    const presignedURL = await _getDocument({contractId, documentType});
    return _returnSuccess({
      count: presignedURL.length,
      documents: presignedURL,
    });
  } catch (e) {
    return _errorResponse(e);
  }
};

exports.imageProcessor = async (event, context) => {
  try {
    const objectKey = event.Records[0].s3.object.key.split('/');
    const contractId = objectKey[0];
    const documentType = objectKey[1];
    const fileName = objectKey[2];
    const register = await _registerDocument({contractId, documentType, fileName});

    return register;
  } catch(e){
  }
}

//ao deletar documentos o risco é ter que voltar o status
exports.deleteDocument = async (event, context) => {
  try {
    const { contractId, documentType } = event.pathParameters;
    const presignedURL = await _deleteDocument({contractId, documentType});
    return _returnSuccess(presignedURL);
  } catch (e) {
    return _errorResponse(e);
  }
};