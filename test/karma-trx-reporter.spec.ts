import * as  assert from 'assert';
import { TrxReporter, TrxReporterConfig } from '../src/Reporter';

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
    const config:TrxReporterConfig  = {
        outputFile: './TestTrxResultsFile.trx'
    };

    const logger: karma.Logger = {
        debug: (message: string) => {},
        warn: (message: string) => {} }

    const loggerFactory: karma.LoggerFactory = {
        create: (name: string) => logger
    };

    const helper: karma.Helper = { 
        mkdirIfNotExists: (directory:string, callback: () => {}) => {},
        normalizeWinPath: (directory:string) => directory
    };
    const formatError = (error: string) => error;

    const reporter = new TrxReporter(
        function(reporter){},
        config,
        loggerFactory,
        helper, 
        formatError);

    return reporter;
};