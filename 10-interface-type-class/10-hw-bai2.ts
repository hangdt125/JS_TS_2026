interface ITestResult {
    testName: string;
    status: "passed" | "failed" | "skipped";
    duration: number; // đơn vị: giây
    errorMessage?: string; // chỉ có khi status === "failed"
    tags: string[]; // 1 test có thể có nhiều tag
}

type TestSummary = {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    passRate: string; // VD: "75.0%"
    avgDuration: string; // VD: "2.30s"
    slowest: string; // VD: "User registration (5.10s)"
};

class TestReporter {


    private results: ITestResult[] = []

    addResult(result: ITestResult): void {
        const cleanName = result.testName.trim();
        let cleanError;
        if (result.errorMessage !== undefined) { cleanError = result.errorMessage.trim() }
        else cleanError = undefined
        let cleanTags = result.tags.map(tag => tag.trim())

        if (result.errorMessage !== undefined) { }

        const testName = this.results.map(item => item.testName)
        if (testName.includes(cleanName)) { throw Error('Test name đã tồn tại') }
        // if (result.status === 'passed' || result.status === 'skipped') {
        //     if (cleanError !== undefined) { throw Error('Test name chứa error message mặc dù test case passed hoặc skipped') }
        // }
        if (result.status === 'failed' && cleanError === undefined) { throw Error('Test case failed nhưng không chứa message lỗi') }
        const cleanResult = { testName: cleanName, status: result.status, duration: result.duration, errorMessage: cleanError, tags: cleanTags }
        this.results.push(cleanResult)
    }

    getSummary(): TestSummary {
        let total = this.results.length;
        let passed = 0;
        let failed = 0;
        let skipped = 0;
        let duration = 0;
        let passRate = ''
        let avgDuration = ''
        let slowestNum = 0
        let testName = ''

        for (let item of this.results) {
            duration += item.duration
            if (item.status === 'failed') { failed++ }
            else if (item.status === 'passed') { passed++ }
            else { skipped++ }
        }

        for (let item of this.results) {
            if (item.duration > slowestNum) {
                slowestNum = item.duration
                testName = item.testName
            }
        }

        if (total === 0) {
            avgDuration = '0s'

        }
        if (passed + failed === 0) {
            passRate = '0%'
        }

        passRate = `${((passed / (passed + failed)) * 100).toFixed(1)}%`
        avgDuration = `${(duration / total).toFixed(2)}s`
        let slowest = `${testName} (${slowestNum.toFixed(2)}s)`
        return {
            total, passed, failed, skipped, passRate, avgDuration, slowest
        }
    }

    getFailedTests(): ITestResult[] {
        const failed = this.results.filter(item => item.status === 'failed')
        return failed
    }

    getTestsByStatus(status: "passed" | "failed" | "skipped"): ITestResult[] {
        const filtered = this.results.filter(item => item.status === status)
        return filtered
    }

    searchTests(keyword: string): ITestResult[] {

        const matched = this.results.filter(item => {
            if (item.errorMessage === undefined) { return item.testName.toLowerCase().includes(keyword.trim().toLowerCase()) }
            else return (item.testName.toLowerCase().includes(keyword.trim().toLowerCase()) || item.errorMessage.toLowerCase().includes(keyword.trim().toLowerCase()))
        })
        return matched
    }

    getSlowTests(threshold: number): ITestResult[] {
        const slow = this.results.filter(item => item.duration > threshold)
        return slow
    }

    getReportByTag(): { tag: string; total: number; passed: number; failed: number; skipped: number }[] {

        interface reportByTag { tag: string, total: number; passed: number; failed: number; skipped: number }

        const reports: reportByTag[] = [];

        for (let item of this.results) {
            for (let tag of item.tags) {
                let existedTag = reports.find(report => report.tag === tag)
                if (!existedTag) {
                    existedTag = { tag: tag, total: 0, passed: 0, failed: 0, skipped: 0 }
                    reports.push(existedTag)
                }
                existedTag.total++
                if (item.status === 'passed') {
                    existedTag.passed++
                }
                else if (item.status === 'failed') { existedTag.failed++ }
                else { existedTag.skipped++ }
            }
        }
        return reports
    }

    exportReport(): string {
        let failed: ITestResult[] = this.getFailedTests();
        let sum: TestSummary = this.getSummary();
        let sumStr: string = [
            `======== TEST REPORT ========`,
            `Total: ${sum.total} | Passed: ${sum.passed} | Failed: ${sum.failed} | Skipped: ${sum.skipped}`,
            `Pass Rate: ${sum.passRate}`,
            `Avg Duration: ${sum.avgDuration}`,
            `Slowest: ${sum.slowest}`
        ].join("\n");

        const failedList = failed.map(item =>
            `[FAIL] ${item.testName} ${item.duration}\nError: ${item.errorMessage}`
        );

        const failedStr = failedList.length > 0
            ? `\n======== FAILED TESTS ========\n${failedList.join("\n")}`
            : "";

        if (!failedStr) { return sumStr } else { return [sumStr, failedStr].join("\n") }
    }
}


const reporter = new TestReporter();

reporter.addResult({
    testName: "Login with valid credentials",
    status: "passed",
    duration: 2.5,
    tags: ["smoke", "login"],
});
reporter.addResult({
    testName: "Login with invalid password",
    status: "failed",
    duration: 1.2,
    errorMessage: "Expected error message not displayed",
    tags: ["login", "validation"],
});
reporter.addResult({
    testName: "Checkout with empty cart",
    status: "failed",
    duration: 3.8,
    errorMessage: "Cart is empty",
    tags: ["checkout", "validation"],
});
reporter.addResult({
    testName: "User registration",
    status: "passed",
    duration: 5.1,
    tags: ["smoke", "registration"],
});
reporter.addResult({
    testName: "Add to cart",
    status: "passed",
    duration: 1.0,
    tags: ["smoke", "cart"],
});
reporter.addResult({
    testName: "Logout",
    status: "skipped",
    duration: 0,
    tags: ["login"],
});

const summary = reporter.getSummary();
console.log(summary.total); // 6
console.log(summary.passed); // 3
console.log(summary.failed); // 2
console.log(summary.skipped); // 1
console.log(summary.passRate); // "60.0%"  (3/(3+2)*100)
console.log(summary.avgDuration); // "2.27s"  (13.6/6)
console.log(summary.slowest); // "User registration (5.10s)"

console.log(reporter.getFailedTests().length); // 2
console.log(reporter.getTestsByStatus("passed").length); // 3
console.log(reporter.searchTests("login").length); // 2
console.log(reporter.searchTests("empty").length); // 1
console.log(reporter.getSlowTests(3).length); // 2

const tagReport = reporter.getReportByTag();
//Phải có 6 tag: smoke, login, validation, checkout, registration, cart
console.log(tagReport.length); // 6

//Tag "smoke": 3 tests (Login valid, User registration, Add to cart), tất cả passed
const smokeTag = tagReport.find((t) => t.tag === "smoke");
if (smokeTag) {
    console.log(smokeTag.total); // 3
    console.log(smokeTag.passed); // 3
    console.log(smokeTag.failed); // 0
}

console.log(reporter.exportReport());



// ---- Bộ test nâng cao: tự kiểm tra xử lý lỗi ----
// Test passed NHƯNG có errorMessage -> searchTests phải tìm trong errorMessage, getFailedTests không tính test passed
reporter.addResult({
    testName: "Search with long timeout",
    status: "passed",
    duration: 12.0,
    errorMessage: "Timeout after 30s",
    tags: ["search", "performance"],
});
console.log(reporter.searchTests("timeout").length); // >= 1
console.log(
    reporter
        .getFailedTests()
        .find((t) => t.testName === "Search with long timeout"),
); // undefined
// Test có tags rỗng -> getReportByTag không crash
reporter.addResult({
    testName: "No tags test",
    status: "passed",
    duration: 0.5,
    tags: [],
});
console.log(reporter.getReportByTag().length); // >= 6
// searchTests("") -> trả về tất cả, không crash
console.log(reporter.searchTests("").length); // 8
// getSlowTests(0) -> tất cả test có duration > 0
console.log(reporter.getSlowTests(0).length); // >= 6
// passRate = passed/(passed+failed), không tính skipped (4 passed, 2 failed -> 66.7%)
const s2 = reporter.getSummary();
console.log(s2.total); // 8
console.log(s2.passRate); // "66.7%"