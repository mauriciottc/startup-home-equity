const {
    createPresignedPost: _createPresignedPost,
    getPresignedUrl: _getPresignedUrl,
    find: _find,
    registerDocument: _registerDocument,
} = require('../repositories/document.repository');
const uuidv4 = require('uuid/v4');
const {
    getContract: _getContract,
    changeContractStatus: _changeContractStatus,
} = require('./contract.service');
const {
    hasRequiredFields: _hasRequiredFields,
    isValidTypes: _isValidTypes,
} = require('../helpers/validators/document.validators');

const {
    document_bucket: {
        bucket: _bucket,
    }
} = require('../helpers/config')


const createDocumentsURL = async ({
    contractId, 
    documentType, 
    contract
}) => {
    if(!contractId || !documentType) throw 'contractId and documentType are mandatory';
    
    _isValidTypes(documentType);

    if(!contract) contract = await _getContract({contractId});
    
    if(!contract || (contract.status != 'waiting_documents' && contract.status != 'waiting_review')){
        // DELETE IMAGE SENT
        if(!contract) throw 'Contract not found';
        else throw 'change is not allowed';
    } 

    const fileName = uuidv4();
    const response = await _createPresignedPost({
        bucket: _bucket,
        key: `${contractId}/${documentType}/${fileName}`,
        contentType: 'image/jpeg'
    });

    return response;
};

const getDocument = async({
    contractId, 
    documentType
}) => {
    if(!contractId) throw 'contractId is mandatory';
    const [response] = await _find({contractId, documentType});
    if(response == undefined) throw 'not found';

    let images = [];
    if(response.personalId) images.push(_getPresignedUrl({
        bucket: _bucket, 
        key:`${contractId}/personalId/${response.personalId.object}`,
        contentType:`image/jpeg`,
        documentType: `personalId`,
    }));

    if(response.addressProof) images.push(_getPresignedUrl({
        bucket: _bucket, 
        key:`${contractId}/addressProof/${response.addressProof.object}`,
        contentType:`image/jpeg`,
        documentType: `addressProof`,
    }));

    if(response.residence){
        response.residence.map(residence => {
            images.push(_getPresignedUrl({
                bucket: _bucket, 
                key:`${contractId}/residence/${residence.object}`,
                contentType:`image/jpeg`,
                documentType: `residence`,
            }));
        })
    }

    return Promise.all(images).then(fileUrls => {
        return fileUrls
    });
}

const registerDocument = async({
    contractId, 
    documentType, 
    fileName
}) => {
    if(!contractId || !documentType || !fileName) throw 'contractId, documentType and fileName are mandatory';
    _isValidTypes(documentType);

    let resource = {
        contractId,
    };
    resource[documentType] = {
        object: fileName,
    };

    const contract = await _getContract({contractId});
    if(!contract) throw 'Contract not found';
    if(contract.status !== 'waiting_documents' && contract.status !== 'waiting_review') throw 'change is not allowed';

    const document = await _registerDocument({resource});
    // TODO verify if image was changed and delete old image
    if(_hasRequiredFields(document) && contract.status == 'waiting_documents'){
        await _changeContractStatus({contractId, status:'waiting_review'});
    }

    return document;
}

module.exports = {
    createDocumentsURL,
    getDocument,
    registerDocument,
};