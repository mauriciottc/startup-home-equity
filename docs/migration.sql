create table contract(
    `contractId` VARCHAR(36) NOT NULL,
    `personalId` VARCHAR(11) NOT NULL,
    `name` VARCHAR(70) NOT NULL,
    `email` VARCHAR(70) NOT NULL,
    `loanValue` INT NOT NULL,
    `monthlyIncome`INT,
    `birthDate` DATE,
    `matrialStatus` ENUM('single', 'married', 'widower'),
    `status` ENUM('waiting_documents', 'waiting_review', 'approved', 'denied') NOT NULL,
    PRIMARY KEY (`contractId`)
);

create table contract_address(
    `contractId` VARCHAR(36) NOT NULL,
    `street` VARCHAR(100) NOT NULL,
    `number` VARCHAR(100) NOT NULL,
    `complement` VARCHAR(20),
    `postalCode` VARCHAR(8) NOT NULL,
    `city` VARCHAR(20) NOT NULL,
    `state` VARCHAR(2) NOT NULL,
    PRIMARY KEY (`contractId`)
);