var assert = require("assert");
var TrxReporter = require("../index")['reporter:trx'][1];

describe('some noise', function(){
    it('true does not equal false', function(){

        assert.equal(false, !true);
    });
    it('Can resolve user', function(){
        var user = process.env['USER'];
        assert.equal(user!== undefined, true);
    });
});

describe('karma-trx-reporter', function(){
    it('can create instance', function(){
        // act
        var reporter = createReporter();

        // assert
        assert.equal(reporter !== undefined, true);
    });

});

function createReporter() {
    var config = { outputFile: './TestTrxResultsFile.trx' };
    var emitter = { };
    var logger = { create: function(logger) {} };
    var helper = { };
    var formatError = { };

    var reporter = new TrxReporter(function(reporter){}, config, emitter, logger, helper, formatError);
    return reporter;
};