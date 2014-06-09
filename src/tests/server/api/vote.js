
require('./../../trace.ninja.js');

// unit test
var assert = require('assert');
var sinon = require('sinon');
// api
var vote = require("../../../server/api/vote");
// models
var Comm = require("../../../server/documents/comm").Comm;

describe('vote::status', function () {

	it('should yield "pending" if comm not found', function (done) {

		var stub = sinon.stub(Comm, "findOne", function(args, done) {
			done(null, null);
		});

		vote.status({args: {uuid: "uuid"}}, function(err, obj) {

			assert.equal(obj, "pending");
		
			stub.restore();

			done();
		
		});

	});

	it('should yield "pending" if comm::status is not set', function (done) {

		var stub = sinon.stub(Comm, "findOne", function(args, done) {
			done(null, {
				id: "id",
				uuid: "uuid",
				status: undefined
			});
		});

		vote.status({args: {uuid: "uuid"}}, function(err, obj) {

			assert.equal(obj, "pending");
		
			stub.restore();

			done();
		
		});

	});

	it('should yield comm::status if comm::status is set', function (done) {

		var stub = sinon.stub(Comm, "findOne", function(args, done) {
			done(null, {
				id: "id",
				uuid: "uuid",
				status: "approved"
			});
		});

		vote.status({args: {uuid: "uuid"}}, function(err, obj) {

			assert.equal(obj, "approved");
		
			stub.restore();

			done();
		
		});

	});

});