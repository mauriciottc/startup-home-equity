const documentObject = {
    "id": "/documentObject",
    "type": "object",
    "properties":{
        "object"  : {"type": "string", "minLength": 1},
        "metadata" : {"type": "object"}
    },
    "required": ["object"],
    "additionalProperties": true
};

const requiredDocuments = {
    "id"  : "/requiredDocuments",
    "type": "object",
    "properties": {
        "contractId": {
            "type": "string",
            "format": "uuid"
        },
        "personalId": {"$ref": "/documentObject"},
        "addressProof": {"$ref": "/documentObject"},
        "residence":{
            "type": "array",
            "items": {"$ref": "/documentObject"},
        },
    },
    "required": ["contractId","personalId"],
    "additionalProperties": false
};

const validTypes = {
    "id"  : "/validTypes",
    "type": "string",
    "enum": [
        "personalId", "addressProof", "residence",
    ],
};

const validDocuments = {
    "id"  : "/validDocuments",
    "type": "object",
    "properties": {
        "contractId": {
            "type": "string",
            "format": "uuid"
        },
        "personalId": {"$ref": "/documentObject"},
        "addressProof": {"$ref": "/documentObject"},
        "residence":{
            "type": "array",
            "items": {"$ref": "/documentObject"},
        },
    },
    "required": ["contractId"],
    "additionalProperties": false
};

module.exports = {
    requiredDocuments,
    validDocuments,
    documentObject,
    validTypes,
}