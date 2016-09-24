declare module "node-trx" {
    interface TestRunParams {
        name: string;
        runUser: string;
        times: Times;
    }

    interface UnitTestParams {
        name: string;
        methodName: string;
        methodCodeBase: string;
        methodClassName: string; 
        description?: string;
    }

    interface Times {
        creation: string,
        queuing: string,
        start: string,
        finish: string
    }

    interface TestResult {  
        test: UnitTest; 
        computerName: string,
        outcome: string,
        duration: string,
        startTime: string,
        endTime: string
        output?: string;
        errorMessage?: string;
        errorStacktrace?: string;
    }

    class TestRun {
        public id: string;
        public name: string;
        public times: Times;
        constructor(metadata: TestRunParams);
        addResult(result: TestResult);
        toXml(): string;
    }

    class UnitTest {
        public id: string;
        public name: string;
        public type: string;
        public methodName: string;
        public methodCodeBase: string;
        public methodClassName: string; 
        public description: string;
        constructor(params: UnitTestParams);
    }
}