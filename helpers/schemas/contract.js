const validStatus = {
    "id"  : "/validStatus",
    "type": "string",
    "enum": [
        "waiting_documents", "waiting_review", "approved", "denied",
    ],
};

const validAdrress = {
    "id"  : "/validAddress",
    "properties": {
        "street": {
            "type": "string",
            "minLength": 5,
        }, 
        "number": {
            "anyOf": [
                {
                    "type": "integer",
                    "minimum": 1
                }, 
                {
                    "type": "string",
                    "minLength": 1,
                }
            ]
        },
        "complement": {
            "anyOf": [
                {
                    "type": "integer",
                    "minimum": 1
                }, 
                {
                    "type": "string",
                    "minLength": 1,
                }
            ]
        },
        "postalCode": {
            "pattern": /^[0-9]{5}-[0-9]{3}$/,
        }, 
        "city": {
            "type": "string",
            "minLength": 1,
        },
        "state":{
            "type": "string",
            "enum": ["AC","AL","AP","AM","RR","RO","PA","PB","MA","PI","PE","RN","CE","SE","BA","DF","TO","GO","MS","MT","RJ","SP","MG","ES","RS","SC","PR"],
        },
    },
    "additionalProperties": false,
};

const validContract = (required = ["contractId"]) => ({
    "id"  : "/validContract",
    "type": "object",
    "properties": {
        "contractId": {
            "type": "string",
            "format": "uuid",
        },
        "personalId": {
            "type": "string",
            "anyOf": [
                {"pattern": /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/},
                {"minLength": 11, "maxLength": 11},
            ]
        },
        "name": {
            "type": "string", 
            "minLength": 10,
        },
        "email": {
            "type": "string",
            "format": "email",
        },
        "loanValue": {
            "type": "number", 
            "minimum": 1000,
        },
        "monthlyIncome": {
            "type": "number", 
            "minimum": 500,
        },
        "birthDate": {
            "type": "string",
            "format": "date",
        },
        "matrialStatus": {
            "type": "string",
            "enum": ["single", "married", "widower"],
        },
        "address":{"$ref": "/validAddress"},
        "status": {"$ref": "/validStatus"},
    },
    "required": required,
    "additionalProperties": false,
});

module.exports = {
    validStatus,
    validContract,
    validAdrress,
}