const {Validator} = require('jsonschema');
const {documentSchema} = require('../schemas');
const v = new Validator();

const hasRequiredFields = (body) => {
    const v = new Validator();
    v.addSchema(documentSchema.documentObject, '/documentObject');
    const validation = v.validate(body, documentSchema.requiredDocuments);

    validation.errors.every(err => {
        throw err;
    })

    return true;
}

const isValidDocument = (body) => validateSchema({
    body, 
    schema: documentSchema.requiredDocuments, 
    addSchema:[
        {
            obj:documentSchema.documentObject, 
            name:'/documentObject',
        }
    ]
});

const isValidTypes = (body) => validateSchema({
    body,
    schema: documentSchema.validTypes,
})

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

module.exports = {
    hasRequiredFields,
    isValidDocument,
    isValidTypes,
}