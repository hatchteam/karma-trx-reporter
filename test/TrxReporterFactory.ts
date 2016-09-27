import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

function noop () {}

const fakeConfig  = {
    outputFile: './TestTrxResultsFile.trx'
};

const fakeHelper = {
    mkdirIfNotExists: sinon.stub().yields(),
    normalizeWinPath: (directory: string) => directory
};

const fakeLoggerFactory = {
    create: noop
};

const formatError = (error: string) => error;
const fakeBaseReporterDecorator = noop;

export class TrxReporterFactory {

    constructor(private requireStubs: any) {
    }

    public createReporter(): karma.Reporter {
        const module = proxyquire('../src/Reporter/TrxReporter', this.requireStubs);

        return <karma.Reporter>(new module.TrxReporter(
            fakeBaseReporterDecorator,
            fakeConfig,
            fakeLoggerFactory,
            fakeHelper,
            formatError));
    }
};