import { use, expect } from 'chai';
import * as sinonchai from 'sinon-chai';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';
import * as fs from 'fs';

import { TrxReporterFactory } from './TrxReporterFactory';
import { FsStub, createFakeBrowser, createFakeResult } from './Helpers';

use(sinonchai);

describe('karma-trx-reporter', () => {

    let factory: TrxReporterFactory;
    let reporter: karma.Reporter;
    let fakeFs: FsStub;

    beforeEach(() => {
        fakeFs = {
            writeFile: sinon.spy()
        };

        factory = new TrxReporterFactory( { fs: fakeFs });
        reporter = factory.createReporter();
    });

    it('can create instance', () => {
        // assert
        expect(reporter).not.to.be.undefined;
    });

    it('should write trx file after run complete', () => {
        // arrange
        const fakeBrowser: karma.Browser = createFakeBrowser('Android', false, 1, 0, 0);
        const fakeResult: karma.TestResult = createFakeResult('should not fail', true, false);

        // act
        simulateKarmaTestRun([ fakeBrowser ], [ fakeResult ]);

        // assert
        expect(fakeFs.writeFile).to.have.been.called;
    });

    it('resulting trx file single spec contains correct counters', () => {
        // arrange
        const fakeBrowser: karma.Browser = createFakeBrowser('Android', false, 1, 0, 0);
        const fakeResult: karma.TestResult = createFakeResult('should not fail', true, false);

        // act
        simulateKarmaTestRun([ fakeBrowser ], [ fakeResult ]);

        // assert
        const  writtenXml = fakeFs.writeFile.firstCall.args[1];
        expect(writtenXml).to.contain('<Counters total=\"1\" executed=\"1\" passed=\"1\" error=\"0\" failed=\"0\" timeout=\"0\" aborted=\"0\" inconclusive=\"0\" passedButRunAborted=\"0\" notRunnable=\"0\" notExecuted=\"0\" disconnected=\"0\" warning=\"0\" completed=\"0\" inProgress=\"0\" pending=\"0\"/>');
    });

    it('resulting trx file with multiple specs contains correct counters', () => {
        // arrange
        const fakeBrowser: karma.Browser = createFakeBrowser('Android', false, 1, 0, 0);
        const fakeResultSuccess: karma.TestResult = createFakeResult('should not fail', true, false);
        const fakeResultFailed: karma.TestResult = createFakeResult('should  fail', false, false);
        const fakeResultSkipped: karma.TestResult = createFakeResult('should be skipped', false, true);

        // act
        simulateKarmaTestRun([ fakeBrowser ], [ fakeResultSuccess, fakeResultFailed, fakeResultSkipped ]);

        // assert
        const  writtenXml = fakeFs.writeFile.firstCall.args[1];
        expect(writtenXml).to.contain('<Counters total=\"3\" executed=\"2\" passed=\"1\" error=\"0\" failed=\"1\" timeout=\"0\" aborted=\"0\" inconclusive=\"0\" passedButRunAborted=\"0\" notRunnable=\"0\" notExecuted=\"1\" disconnected=\"0\" warning=\"0\" completed=\"0\" inProgress=\"0\" pending=\"0\"/>');
    });

    it('resulting trx file contains spec', () => {
        // arrange
        const fakeBrowser: karma.Browser = createFakeBrowser('Android', false, 1, 0, 0);
        const fakeResult: karma.TestResult = createFakeResult('should not fail', true, false);

        // act
        simulateKarmaTestRun([ fakeBrowser ], [ fakeResult ]);

        // assert
        const  writtenXml = fakeFs.writeFile.firstCall.args[1];
        expect(writtenXml).to.contain('name=\"Android_should not fail\"');
    });

    it('resulting trx file contains spec code base', () => {
        // arrange
        const fakeBrowser: karma.Browser = createFakeBrowser('Android', false, 1, 0, 0);
        const fakeResult: karma.TestResult = createFakeResult('should not fail', true, false);

        // act
        simulateKarmaTestRun([ fakeBrowser ], [ fakeResult ]);

        // assert
        const  writtenXml = fakeFs.writeFile.firstCall.args[1];
        expect(writtenXml).to.contain('codeBase=\"Sender.using it.get request\'.\'Android_should not fail\"');
    });

    it('resulting trx file contains spec class name', () => {
        // arrange
        const fakeBrowser: karma.Browser = createFakeBrowser('Android', false, 1, 0, 0);
        const fakeResult: karma.TestResult = createFakeResult('should not fail', true, false);

        // act
        simulateKarmaTestRun([ fakeBrowser ], [ fakeResult ]);

        // assert
        const  writtenXml = fakeFs.writeFile.firstCall.args[1];
        expect(writtenXml).to.contain('className=\"Sender.using it.get request\"');
    });

    it('resulting trx file contains succeeded spec outcome', () => {
        // arrange
        const fakeBrowser: karma.Browser = createFakeBrowser('Android', false, 1, 0, 0);
        const fakeResult: karma.TestResult = createFakeResult('should not fail', true, false);

        // act
        simulateKarmaTestRun([ fakeBrowser ], [ fakeResult ]);

        // assert
        const  writtenXml = fakeFs.writeFile.firstCall.args[1];
        expect(writtenXml).to.contain('outcome=\"Passed\"');
    });

    it('resulting trx file contains failed spec outcome', () => {
        // arrange
        const fakeBrowser: karma.Browser = createFakeBrowser('Android', false, 1, 0, 0);
        const fakeResult: karma.TestResult = createFakeResult('should fail', false, false);

        // act
        simulateKarmaTestRun([ fakeBrowser ], [ fakeResult ]);

        // assert
        const  writtenXml = fakeFs.writeFile.firstCall.args[1];
        expect(writtenXml).to.contain('outcome=\"Failed\"');
    });

    it('resulting trx file contains skipped spec outcome', () => {
        // arrange
        const fakeBrowser: karma.Browser = createFakeBrowser('Android', false, 1, 0, 0);
        const fakeResult: karma.TestResult = createFakeResult('should fail', false, true);

        // act
        simulateKarmaTestRun([ fakeBrowser ], [ fakeResult ]);

        // assert
        const  writtenXml = fakeFs.writeFile.firstCall.args[1];
        expect(writtenXml).to.contain('outcome=\"NotExecuted\"');
    });

    function simulateKarmaTestRun(browsers: Array<karma.Browser>, results: Array<karma.TestResult>): void {
        reporter.onRunStart(browsers);

        for (let browser of browsers) {
            reporter.onBrowserStart(browser);

            for (let result of results) {
                if (result.success) {
                    reporter.specSuccess(browser, result);
                } else if (result.skipped) {
                    reporter.specSkipped(browser, result);
                } else {
                    reporter.specFailure(browser, result);
                }
            }

            reporter.onBrowserComplete(browser);
        }

        reporter.onRunComplete();
    };
});