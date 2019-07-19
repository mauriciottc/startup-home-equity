const {Validator} = require('jsonschema');
const {contractSchema} = require('../schemas');
const v = new Validator();

const statusConditionBuilder = ({status, contractId}) => {
    let condition = `contractId = "${contractId}"`;
    switch(status){
        case 'waiting_documents':
            break;
        case 'waiting_review':
            condition = `${condition} AND status = "waiting_documents"`;
            break;
        case 'approved':
            condition = `${condition} AND status = "waiting_review"`;
            break;
        case 'denied':
            condition = `${condition} AND status = "waiting_review"`;
            break;
        default:
            throw 'unknown status';
    }
    return condition
};

const updateConditionBuilder = ({contractId}) => `contractId = "${contractId}" AND (status = "waiting_documents" OR status = "waiting_review")`;

const hasRequiredContractFields = ({contract}) => validateSchema({
    body: contract, 
    schema: contractSchema.validContract(["name", "email", "personalId", "loanValue"]), 
    addSchema: [
        {
            obj:contractSchema.validStatus, 
            name:'/validStatus',
        }, 
        {
            obj:contractSchema.validAdrress, 
            name:'/validAddress',
        }
    ],
});

const isValidContract = ({contract, required}) => validateSchema({
    body: contract, 
    schema: contractSchema.validContract(required), 
    addSchema: [
        {
            obj:contractSchema.validStatus, 
            name:'/validStatus',
        }, 
        {
            obj:contractSchema.validAdrress, 
            name:'/validAddress',
        }
    ],
});

const isValidstatus = ({status}) => validateSchema({body: status, schema: contractSchema.validStatus});

const validateSchema = ({body, schema, addSchema = false}) => {
    if(!body || Object.keys(body).length === 0) throw 'missing contract';
    if(!schema) throw 'missing schema';

    if(addSchema) addSchema.map(schema => v.addSchema(schema.obj, schema.name));

    const validation = v.validate(body, schema);

    validation.errors.every(err => {
        throw err;
    })

    return true;
};

const isNewContractAble = (contracts) => {
    contracts.map(_contract => {
        if(_contract.status == 'waiting_documents' || _contract.status == 'waiting_review'){
            throw 'user through contract process';
        }
    })
    return true;
}

module.exports = {
    isValidstatus,
    statusConditionBuilder,
    isValidContract,
    hasRequiredContractFields,
    isNewContractAble,
    updateConditionBuilder,
};