const expect  = require("chai").expect;
const Contarct = require("../services/contract.service");
/*
describe("Contract", () => {
    it("Creates a contract - only required", () => {

    });

    const contract = {
		personalId: "126.011.360-05",
		name:"jose agnaldo pereira",
		email:"jose@jose.com.br",
		loanValue:10000,
		monthlyIncome:5000,
		birthDate:"2015-02-03",
		matrialStatus:"single",
		address:{
			street:"R. João Cachoeira",
			number:"1405",
			complement:"apyo 117",
			postalCode:"04.535-015",
			city:"São Paulo",
			state:"SP",
		},
	}
    it("Creates a contract - only required", async () => {
        const response = await Contarct.createContract({contract});
        expect(err.message).to.be.equal('requires property "name"');
        expect(err.stack).to.be.equal('instance requires property "name"');
    });

    it("Update first contract - add address", () => {

    });

    it("Update first contract - add address", () => {

    });
});
*/

describe("Contract - FAILS", () => {
    const contract = {
		personalId:"126.011.360-03",
		name:"jose agnaldo pereira",
		email:"jose@jose.com.br",
		loanValue:10000,
		monthlyIncome:5000,
		birthDate:"2015-02-03",
		matrialStatus:"single",
		address:{
			street:"R. João Cachoeira",
			number:"1405",
			complement:"apyo 117",
			postalCode:"04.535-015",
			city:"São Paulo",
			state:"SP",
		},
	}

    it("Try to create a contract - without required field", async () => {
        let _contract = {
            ...contract,
        };
        delete _contract.name;
        const err = await Contarct.createContract({contract: _contract}).catch(e => { return {stack: e.stack, message: e.message} });
        expect(err.message).to.be.equal('requires property "name"');
        expect(err.stack).to.be.equal('instance requires property "name"');
    });

    it("Try to create a contract - with invalid field", async () => {
        let _contract = {
            ...contract,
            invalid: '123',
        };
        const err = await Contarct.createContract({contract: _contract}).catch(e => { return {stack: e.stack, message: e.message} });
        expect(err.stack).to.be.equal('instance additionalProperty "invalid" exists in instance when not allowed');
        expect(err.message).to.be.equal('additionalProperty "invalid" exists in instance when not allowed');
    });

    it("Try to create a contract - with invalid cpf value", async () => {
        let _contract = {
            ...contract,
            personalId: '123.456.789-0',
        };
        const err = await Contarct.createContract({contract: _contract}).catch(e => { return {stack: e.stack, message: e.message} });
        expect(err.stack).to.be.equal('instance.personalId is not any of [subschema 0],[subschema 1]');
        expect(err.message).to.be.equal('is not any of [subschema 0],[subschema 1]');
    });

    it("Try to create a contract - with invalid CEP value", async () => {
        let _contract = {
            ...contract,
            address: {
                street:"R. João Cachoeira",
                number:"1405",
                complement:"apyo 117",
                city:"São Paulo",
                state:"SP",
                postalCode: '11065-89',
            }
        };
        const err = await Contarct.createContract({contract: _contract}).catch(e => { return {stack: e.stack, message: e.message} });
        expect(err.stack).to.be.equal('instance.address.postalCode does not match pattern {}');
        expect(err.message).to.be.equal('does not match pattern {}');
    });

    it("Try to create a contract - with invalid field value", async () => {
        let _contract = {
            ...contract,
            address: {
                street:"R. João Cachoeira",
                number:"1405",
                complement:"apyo 117",
                city:"São Paulo",
                state:"SP",
                postalCode: '11065-89',
            }
        };
        const err = await Contarct.createContract({contract: _contract}).catch(e => { return {stack: e.stack, message: e.message} });
        expect(err.stack).to.be.equal('instance.address.postalCode does not match pattern {}');
        expect(err.message).to.be.equal('does not match pattern {}');
    });

    it("Try to create a contract - with same CPF in another waiting documents", async () => {

    });
});