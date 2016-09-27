import { use, expect } from 'chai';
import * as sinonchai from 'sinon-chai';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';
import * as fs from 'fs';
import { parseXmlString, XMLDocument } from 'libxmljs';

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
        }

        factory = new TrxReporterFactory( { fs: fakeFs });
        reporter = factory.createReporter();
    });

    it('can create instance', () => {
        // assert
        expect(reporter).not.to.be.undefined;
    });

    it('should write trx file after run complete', () => {
        // arrange
        var fakeBrowser: karma.Browser = createFakeBrowser();
        var fakeResult: karma.TestResult = createFakeResult();

        // act
        simulateKarmaTestRun([ fakeBrowser ], [ fakeResult ]);
        
        // assert
        //const  writtenXml = fakeFs.writeFile.firstCall.args[1];
        expect(fakeFs.writeFile).to.have.been.called
    });

    it('resulting trx file is valid against the xsd', () => {
        // arrange
        const xsdString: string = fs.readFileSync('./test/vstst.xsd', 'utf8');
        const xsdDoc: XMLDocument = parseXmlString(xsdString);

        const fakeBrowser: karma.Browser = createFakeBrowser();
        const fakeResult: karma.TestResult = createFakeResult();

        // act
        simulateKarmaTestRun([ fakeBrowser ], [ fakeResult ]);
        
        // assert
        const  writtenXml = fakeFs.writeFile.firstCall.args[1];
        const trxDoc = parseXmlString(writtenXml);

        const isValidTrx: boolean = trxDoc.validate(xsdDoc);
        expect(isValidTrx).to.be.true;
    });

    function createFakeBrowser(): karma.Browser {
        return {
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
    }

    function createFakeResult(): karma.TestResult {
        return {
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
    }

    function simulateKarmaTestRun(browsers: Array<karma.Browser>, results: Array<karma.TestResult>): void {
        reporter.onRunStart(browsers)

        for(let browser of browsers) {
            reporter.onBrowserStart(browser);

            for(let result of results) {
                if (result.success) {
                    reporter.specSuccess(browser, result);
                } else if(result.skipped) {
                    reporter.specSkipped(browser, result);
                } else {
                    reporter.specFailure(browser, result);
                }
            }
            
            reporter.onBrowserComplete(browser)
        }

        reporter.onRunComplete()
    }
});