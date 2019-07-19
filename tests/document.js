const expect  = require("chai").expect;
const Document = require("../services/document.service");

describe("Create Document URL", () => {
    
});

describe("Get Document URLs - FAILS", () => {
    it("Try to register a document - without any required fields", async () => {
        const contractId = null;

        const err = await Document.getDocument({contractId}).catch(e => { return e });
        console.log('error', err)
        expect(err).to.be.equal('contractId is mandatory');
    });

    it("Try to register a document - without valid contract", async () => {
        const contractId = '7f618c76-e24c-403e-8321-1bdf44f0671e';

        const err = await Document.getDocument({contractId}).catch(e => { return e });
        expect(err).to.be.equal('not found');
    });

    it("Try to register a document - with approved contract", async () => {
        const contractId = 'f36c045f-1230-4440-bfae-89dc21efa4d6'; //TODO dinamically

        const err = await Document.getDocument({contractId}).catch(e => { return e });
        console.log(err)
        expect(err).to.be.equal('not found');
    });
});

describe("Create Document URL - FAILS", () => {

    it("Try to create a contract - without required fields", async () => {
        const contractId = null;
        const documentType = null;

        const err = await Document.createDocumentsURL({contractId, documentType}).catch(e => { return e });
        expect(err).to.be.equal('contractId and documentType are mandatory');
    });

    it("Try to create a contract - without required fields", async () => {
        const contractId = 12345;
        const documentType = null;

        const err = await Document.createDocumentsURL({contractId, documentType}).catch(e => { return e });
        expect(err).to.be.equal('contractId and documentType are mandatory');
    });

    it("Try to create a contract - without valid contract", async () => {
        const contractId = '7f618c76-e24c-403e-8321-1bdf44f0671e';
        const documentType = 'personalId';

        const err = await Document.createDocumentsURL({contractId, documentType}).catch(e => { return {stack: e.stack, message: e.message} });
        expect(err.message).to.be.equal('Contract not found');
    });

    it("Try to create a contract - without required fields", async () => {
        const contractId = '7f618c76-e24c-403e-8321-1bdf44f0671e';
        const documentType = 'hello';

        const err = await Document.createDocumentsURL({contractId, documentType}).catch(e => { return {stack: e.stack, message: e.message} });
        expect(err.message).to.be.equal('is not one of enum values: personalId,addressProof,residence');
    });
    
});

describe("Register uploaded Document - FAILS", () => {
    it("Try to register a document - without any required fields", async () => {
        const contractId = null;
        const fileName = null;
        const documentType = null;

        const err = await Document.registerDocument({contractId, documentType, fileName}).catch(e => { return e});
        expect(err).to.be.equal('contractId, documentType and fileName are mandatory');
    });

    it("Try to register a document - without 2 required fields", async () => {
        const contractId = 12345;
        const fileName = null;
        const documentType = null;

        const err = await Document.registerDocument({contractId, documentType, fileName}).catch(e => { return e });
        expect(err).to.be.equal('contractId, documentType and fileName are mandatory');
    });

    it("Try to register a document - without 1 required fields", async () => {
        const contractId = 12345;
        const fileName = 'name';
        const documentType = null;

        const err = await Document.registerDocument({contractId, documentType, fileName}).catch(e => { return e });
        expect(err).to.be.equal('contractId, documentType and fileName are mandatory');
    });

    it("Try to register a document - without valid contract", async () => {
        const contractId = '7f618c76-e24c-403e-8321-1bdf44f0671e';
        const documentType = 'personalId';
        const fileName = 'name';

        const err = await Document.registerDocument({contractId, documentType, fileName}).catch(e => { return {stack: e.stack, message: e.message} });
        expect(err.message).to.be.equal('Contract not found');
    });
});