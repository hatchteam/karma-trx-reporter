import { TestRun, TestRunParams } from 'node-trx';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

import { TrxReporterConfig } from './TrxReporterConfig';
import * as Formatters from './Formatters';
import * as Outcomes from './Outcomes';

export class TrxReporter implements karma.Reporter {
    public static $inject: Array<string>;

    private testRun: TestRun;
    private hostName: string = os.hostname();
    private log:karma.Logger;
    private pendingFileWritings: number = 0;
    private fileWritingFinished: () => any;

    constructor(
        private baseReporterDecorator: (reporter: karma.Reporter) => any,
        private config: TrxReporterConfig,
        logger: karma.LoggerFactory,
        private helper: karma.Helper,        
        private formatError: (error: string) => string) {

        this.log = logger.create('reporter.trx');
        this.baseReporterDecorator(this);   
    }

    public onRunStart(browsers: Array<karma.Browser>): void {
        const userName: string = process.env.USERNAME || process.env.USER;
        const runStartTimestamp = TrxReporter.getTimestamp();

        this.testRun = new TestRun({
            name: userName + '@' + this.hostName + ' ' + runStartTimestamp,
            runUser: userName,
            times: {
                creation: runStartTimestamp,
                queuing: runStartTimestamp,
                start: runStartTimestamp,
                finish: runStartTimestamp
            }
        });
    }

    public onRunComplete(): void {     
        this.testRun.times.finish = TrxReporter.getTimestamp();
        const output:string = this.testRun.toXml();
        const outputFile: string = this.config.outputFile;

        this.pendingFileWritings++;

        this.helper.mkdirIfNotExists(path.dirname(outputFile), function () {
            fs.writeFile(outputFile, output, function (err) {
                if (err) {
                    this.log.warn(`Cannot write TRX testRun\n\t${err.message}`);
                } else {
                    this.log.debug(`TRX results written to "${outputFile}".`);
                }

                if (!--this.pendingFileWritings) {
                    this.fileWritingFinished()
                }
            });     
        });
    }

    public onBrowserStart(browser: karma.Browser): void {

    }

    public onBrowserComplete(browser: karma.Browser): void {

    }

    public specSuccess(browser: karma.Browser, result: karma.TestResult): void {
        this.addSpec(browser, result);
    }

    public specSkipped(browser: karma.Browser, result: karma.TestResult): void {
        this.addSpec(browser, result);
    }

    public specFailure(browser: karma.Browser, result: karma.TestResult): void {
        this.addSpec(browser, result);
    }

    public onExit (done: () => any) {
        if (this.pendingFileWritings) {
            this.fileWritingFinished = done
        } else {
        done()
    }
  }

    private static getTimestamp() {
        return (new Date()).toISOString().substr(0, 19);
    }

    private static formatDuration(duration: number): string {
        duration = duration | 0;
        const ms = duration % 1000;
        duration -= ms;
        const s = (duration / 1000) % 60;
        duration -= s * 1000;
        const m = (duration / 60000) % 60;
        duration -= m * 60000;
        const h = (duration / 3600000) % 24;
        duration -= h * 3600000;
        const d = duration / 86400000;

        return (d > 0 ? d + '.' : '') +
            (h < 10 ? '0' + h : h) + ':' +
            (m < 10 ? '0' + m : m) + ':' +
            (s < 10 ? '0' + s : s) + '.' +
            (ms < 10 ? '00' + ms : ms < 100 ? '0' + ms : ms);
    };

    private static getTestOutcome(result: karma.TestResult) {
        if (result.skipped) {
            return Outcomes.NOTEXECUTED;
        } else if(result.success) {
            return Outcomes.PASSED;
        } else {
            return Outcomes.FAILED;
        }
    }

    private addSpec(browser: karma.Browser, result: karma.TestResult): void {
        const unitTestName: string = Formatters.defaultNameFormatter(browser, result);
        const className: string = Formatters.defaultClassNameFormatter(browser, result);
        const errorMessage: string = result.log.map((item) => this.formatError(item)).join('\n');

        this.testRun.addResult({
            test: {
                name: unitTestName,
                methodName: unitTestName,
                methodCodeBase: `${className}'.'${unitTestName}`,
                methodClassName: className
            },
            computerName: this.hostName,
            outcome: TrxReporter.getTestOutcome(result),
            duration: TrxReporter.formatDuration(result.time || 0),
            startTime: TrxReporter.getTimestamp(),
            endTime: TrxReporter.getTimestamp(),
            errorMessage: !result.success ? errorMessage : null
        });
    }
}