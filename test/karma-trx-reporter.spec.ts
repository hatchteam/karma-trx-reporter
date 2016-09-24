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

describe('karma-trx-reporter', () => {

    let reporterModule: any;
    let reporter: karma.Reporter;
    let fakeFs: any;

    beforeEach(() => {
        fakeFs = {
            writeFile: sinon.spy()
        }

        reporterModule = proxyquire('../src/Reporter/TrxReporter', {
            fs: fakeFs
        })
    });

    beforeEach(() => {
        reporter = <karma.Reporter>(new reporterModule.TrxReporter(
            fakeBaseReporterDecorator,
            fakeConfig,
            fakeLoggerFactory,
            fakeHelper,
            formatError));
    });

    it('can create instance', () => {
        // assert
        expect(reporter).not.to.be.undefined;
    });

    it('should write trx file after run complete', () => {
        // arrange
        var fakeBrowser: karma.Browser = {
            id: 'Android_4_1_2',
            name: 'Android',
            fullName: 'Android 4.1.2',
            lastResult: {
                error: false,
                total: 1,
                success: 1,
                skipped: 0,
                failed: 0,
                totalTime: 10 * 1000,
                netTime: 10 * 1000
                }
        };

        var fakeResult: karma.TestResult = {
            suite: [
                'Sender',
                'using it',
                'get request'
            ],
            description: 'should not fail',
            log: [],
            time: 10 * 1000,
            success: true,
            skipped: false
        };

        // act
        reporter.onRunStart([ fakeBrowser ])
        reporter.onBrowserStart(fakeBrowser);
        reporter.specSuccess(fakeBrowser, fakeResult)
        reporter.onBrowserComplete(fakeBrowser)
        reporter.onRunComplete()

        // assert
        expect(fakeFs.writeFile).to.have.been.called
    });
});