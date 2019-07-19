#ENABLE DATA API REQUIRED TO USE RDS DATA SERVICE API
aws rds modify-db-cluster --db-cluster-identifier "contract-register-stg-rdscluster-x6ai215d8vzv" --enable-http-endpoint

#
aws rds-data execute-sql --db-cluster-or-instance-arn "arn:aws:rds:us-east-1:375557874332:cluster:contract-register-stg-rdscluster-x6ai215d8vzv" --schema "" \
 --aws-secret-store-arn "arn:aws:secretsmanager:us-east-1:375557874332:secret:MyRDSSecret-NLqiIM3iMIaK-X6cNTv" \
--sql-statements "CREATE DATABASE \`home-equity\`" --region us-east-1

#
aws rds-data execute-sql --db-cluster-or-instance-arn "arn:aws:rds:us-east-1:375557874332:cluster:contract-register-stg-rdscluster-x6ai215d8vzv" --schema "" \
--database "home-equity" --aws-secret-store-arn "arn:aws:secretsmanager:us-east-1:375557874332:secret:MyRDSSecret-NLqiIM3iMIaK-X6cNTv" \
--sql-statements "create table contract( \`contractId\` VARCHAR(36) NOT NULL, \`personalId\` VARCHAR(11) NOT NULL, \`name\` VARCHAR(70) NOT NULL, \`email\` VARCHAR(70) NOT NULL, \`loanValue\` INT NOT NULL, \`monthlyIncome\`INT, \`birthDate\` DATE, \`matrialStatus\` ENUM('single', 'married', 'widower'), \`status\` ENUM('waiting_documents', 'waiting_review', 'approved', 'denied') NOT NULL, PRIMARY KEY (\`contractId\`));create table contract_address(\`contractId\` VARCHAR(36) NOT NULL,\`street\` VARCHAR(100) NOT NULL,\`number\` VARCHAR(100) NOT NULL,\`complement\` VARCHAR(20),\`postalCode\` VARCHAR(8) NOT NULL,\`city\` VARCHAR(20) NOT NULL,\`state\` VARCHAR(2) NOT NULL,PRIMARY KEY (\`contractId\`));"