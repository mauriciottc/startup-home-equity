module.exports = {
    rules: {
        minLoanValue: 1000,
        minMonthlyIncome: 500,
        //maxLoanValue: 0,
    },
    acquisition_DB: {
        awsSecretStoreArn: process.env.awsSecretStoreArn || 'arn:aws:secretsmanager:us-east-1:375557874332:secret:MyRDSSecret-NLqiIM3iMIaK-X6cNTv',
        dbClusterOrInstanceArn: process.env.dbClusterOrInstanceArn || 'arn:aws:rds:us-east-1:375557874332:cluster:contract-register-stg-rdscluster-x6ai215d8vzv',
        database: process.env.database || 'home-equity',
        contractTable: process.env.contractTable || 'contract',
        contractAddressTable: process.env.contractAddressTable || 'contract_address',
    },
    document_DB: {
        doc_table: process.env.db_document || 'contract-register-stg-document',
    },
    document_bucket: {
        bucket: process.env.document_bucket || 'contract-register-stg-document',
    },
};