import { use, expect } from 'chai';
import * as sinonchai from 'sinon-chai';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

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
        reporter.onRunStart([ fakeBrowser ])
        reporter.onBrowserStart(fakeBrowser);
        reporter.specSuccess(fakeBrowser, fakeResult)
        reporter.onBrowserComplete(fakeBrowser)
        reporter.onRunComplete()
        
        // assert
        //const  writtenXml = fakeFs.writeFile.firstCall.args[1];
        expect(fakeFs.writeFile).to.have.been.called
    });

    it('', () => {

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
});