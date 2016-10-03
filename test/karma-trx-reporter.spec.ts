import { use, expect } from 'chai';
import * as sinonchai from 'sinon-chai';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';
import * as fs from 'fs';

import { TrxReporterFactory } from './TrxReporterFactory';
import { FsStub } from './Stubs';

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

    // it('resulting trx file contains succeeded spec', () => {
    //     // arrange
    //     const xsdString: string = fs.readFileSync('./test/vstst.xsd', 'utf8');
    //     const xsdDoc: XMLDocument = parseXmlString(xsdString);

    //     const fakeBrowser: karma.Browser = createFakeBrowser('Android', false, 1, 0, 0);
    //     const fakeResult: karma.TestResult = createFakeResult('should not fail', true, false);

    //     // act
    //     simulateKarmaTestRun([ fakeBrowser ], [ fakeResult ]);

    //     // assert
    //     const  writtenXml = fakeFs.writeFile.firstCall.args[1];
    //     const trxDoc = parseXmlString(writtenXml);

    //     const isValidTrx: boolean = trxDoc.validate(xsdDoc);
    //     expect(isValidTrx).to.be.true;
    // });

    function createFakeBrowser(name: string, error: boolean, success: number, skipped: number, failed: number): karma.Browser {
        return {
            id: `${name}_4_1_2`,
            name: name,
            fullName: `${name} 4.1.2`,
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
    };

    function createFakeResult(description: string, success: boolean, skipped: boolean): karma.TestResult {
        return {
            suite: [
                'Sender',
                'using it',
                'get request'
            ],
            description: description,
            log: [],
            time: 10 * 1000,
            success: success,
            skipped: skipped
        };
    };

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