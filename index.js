var path = require('path');
var fs = require('fs');
var builder = require('xmlbuilder');

function defaultNameFormatter(browser, result) {
    return browser.name + '_' + result.description;
}

var TRXReporter = function(
    baseReporterDecorator,
    config,
    emitter,
    logger,
    helper,
    formatError
) {
    var outputFile = config.outputFile;
    var shortTestName = !!config.shortTestName;
    var trimTimestamps = !!config.trimTimestamps;
    var nameFormatter = config.nameFormatter || defaultNameFormatter;
    var log = logger.create('reporter.trx');
    var hostName = require('os').hostname();
    var testRun;
    var resultSummary;
    var counters;
    var testDefinitions;
    var testListIdNotInAList;
    var testEntries;
    var results;
    var times;

    var getTimestamp = function() {
        // todo: use local time ?
        return trimTimestamps ?
            new Date().toISOString().substr(0, 19) :
            new Date().toISOString();
    };

    var s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    var newGuid = function() {
        return (
            s4() +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            s4() +
            s4()
        );
    };

    var formatDuration = function(duration) {
        duration = duration | 0;
        var ms = duration % 1000;
        duration -= ms;
        var s = (duration / 1000) % 60;
        duration -= s * 1000;
        var m = (duration / 60000) % 60;
        duration -= m * 60000;
        var h = (duration / 3600000) % 24;
        duration -= h * 3600000;
        var d = duration / 86400000;

        return (
            (d > 0 ? d + '.' : '') +
            (h < 10 ? '0' + h : h) +
            ':' +
            (m < 10 ? '0' + m : m) +
            ':' +
            (s < 10 ? '0' + s : s) +
            '.' +
            (ms < 10 ? '00' + ms : ms < 100 ? '0' + ms : ms)
        );
    };

    baseReporterDecorator(this);

    this.onRunStart = function() {
        var userName = process.env.USERNAME || process.env.USER || 'karma-trx';
        var runStartTimestamp = getTimestamp();
        testRun = builder
            .create('TestRun', { version: '1.0', encoding: 'UTF-8' })
            .att('id', newGuid())
            .att('name', userName + '@' + hostName + ' ' + runStartTimestamp)
            .att('runUser', userName)
            .att('xmlns', 'http://microsoft.com/schemas/VisualStudio/TeamTest/2010');

        testRun
            .ele('TestSettings')
            .att('name', 'Karma Test Run')
            .att('id', newGuid());

        times = testRun.ele('Times');
        times.att('creation', runStartTimestamp);
        times.att('queuing', runStartTimestamp);
        times.att('start', runStartTimestamp);

        resultSummary = testRun.ele('ResultSummary');
        counters = resultSummary.ele('Counters');
        testDefinitions = testRun.ele('TestDefinitions');

        testListIdNotInAList = '8c84fa94-04c1-424b-9868-57a2d4851a1d';
        var testLists = testRun.ele('TestLists');

        testLists
            .ele('TestList')
            .att('name', 'Results Not in a List')
            .att('id', testListIdNotInAList);

        // seems to be VS is expecting that exact id
        testLists
            .ele('TestList')
            .att('name', 'All Loaded Results')
            .att('id', '19431567-8539-422a-85d7-44ee4e166bda');

        testEntries = testRun.ele('TestEntries');
        results = testRun.ele('Results');
    };

    this.onBrowserStart = function(browser) {};

    this.onBrowserComplete = function(browser) {
        var total = 0;
        var executed = 0;
        var successful = 0;
        var error = 0;
        var failed = 0;
        if (browser.lastResult._realLastResults) {
            console.log(
                'Merging result(s) from parallel test run(s) into the trx report.'
            );
            try {
                var realLastResult = browser.lastResult._realLastResults;
                for (var i in realLastResult) {
                    var item = realLastResult[i];
                    total += item.total;
                    executed += item.total - item.skipped;
                    successful += item.success;
                    error += item.error ? 1 : 0;
                    failed += item.failed;
                }
                console.log('Merge was successful.');
            } catch (e) {
                console.error(`Merge failed with error: ${e}`);
            }
        } else {
            var result = browser.lastResult;
            // todo: checkout if all theses numbers map well
            total = result.total;
            executed = result.total - result.skipped;
            successful = result.success;
            error = result.error ? 1 : 0;
            failed = result.failed;
        }
        var passed = failed <= 0 && !error;
        resultSummary.att('outcome', passed ? 'Passed' : 'Failed');
        counters
            .att('total', total)
            .att('executed', executed)
            .att('passed', successful)
            .att('error', error)
            .att('failed', failed);
        // possible useful info:
        // todo: result.disconnected => this seems to happen occasionally? => Possibly handle it!
        // (result.netTime || 0) / 1000)
    };

    this.onRunComplete = function() {
        times.att('finish', getTimestamp());
        var xmlToOutput = testRun;

        helper.mkdirIfNotExists(path.dirname(outputFile), function() {
            fs.writeFile(outputFile, xmlToOutput.end({ pretty: true }), function(
                err
            ) {
                if (err) {
                    log.warn('Cannot write TRX testRun\n\t' + err.message);
                } else {
                    log.debug('TRX results written to "%s".', outputFile);
                }
            });
        });
    };

    this.specSuccess = this.specSkipped = this.specFailure = function(
        browser,
        result
    ) {
        var unitTestId = newGuid();
        var unitTestName = shortTestName ?
            result.description :
            nameFormatter(browser, result);
        var className = result.suite.join('.');
        var codeBase = className + '.' + unitTestName;

        var unitTest = testDefinitions
            .ele('UnitTest')
            .att('name', unitTestName)
            .att('id', unitTestId);
        var executionId = newGuid();
        unitTest.ele('Execution').att('id', executionId);
        unitTest
            .ele('TestMethod')
            .att('codeBase', codeBase)
            .att('name', unitTestName)
            .att('className', className);

        testEntries
            .ele('TestEntry')
            .att('testId', unitTestId)
            .att('executionId', executionId)
            .att('testListId', testListIdNotInAList);

        var unitTestResult = results
            .ele('UnitTestResult')
            .att('executionId', executionId)
            .att('testId', unitTestId)
            .att('testName', unitTestName)
            .att('computerName', hostName)
            .att('duration', formatDuration(result.time > 0 ? result.time : 0))
            .att('startTime', getTimestamp())
            .att('endTime', getTimestamp())
            // todo: are there other test types?
            .att('testType', '13cdc9d9-ddb5-4fa4-a97d-d965ccfc6d4b') // that guid seems to represent 'unit test'
            .att(
                'outcome',
                result.skipped ? 'NotExecuted' : result.success ? 'Passed' : 'Failed'
            )
            .att('testListId', testListIdNotInAList);

        if (!result.success) {
            unitTestResult
                .ele('Output')
                .ele('ErrorInfo')
                .ele('Message', formatError(result.log[0]));
        }
    };
};

TRXReporter.$inject = [
    'baseReporterDecorator',
    'config.trxReporter',
    'emitter',
    'logger',
    'helper',
    'formatError'
];

// PUBLISH DI MODULE
module.exports = {
    'reporter:trx': ['type', TRXReporter]
};