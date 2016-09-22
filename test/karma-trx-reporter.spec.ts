import { use, expect } from 'chai';
import * as sinonchai from 'sinon-chai';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

use(sinonchai);

function noop () {}

const fakeConfig  = {
    outputFile: './TestTrxResultsFile.trx'
};

const fakeHelper = { 
    mkdirIfNotExists: sinon.stub().yields(),
    normalizeWinPath: (directory:string) => directory
};

const fakeLoggerFactory = {
  create: noop
}

const formatError = (error: string) => error;

const fakeBaseReporterDecorator = noop

describe('karma-trx-reporter', function(){

    let reporterModule: any;
    let reporter: karma.Reporter;
    let fakeFs: any;

    beforeEach(function () {
        fakeFs = {
            writeFile: sinon.spy()
        }

        reporterModule = proxyquire('../src', {
            fs: fakeFs
        })
    });

    beforeEach(function () {
        let TryReporter = reporterModule['reporter:trx'][1];
        reporter = <karma.Reporter>(new TryReporter(
            fakeBaseReporterDecorator,
            fakeConfig,
            fakeLoggerFactory,
            fakeHelper,
            formatError));
    });

    it('can create instance', function(){
        // assert
        expect(reporter).not.to.be.undefined;
    });

});