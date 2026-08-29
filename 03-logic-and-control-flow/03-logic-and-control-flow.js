let rawProjectName = "   Neko CRM   ";
let rawEnvName = "   ";
let rawPassRate = "82";
let rawHasReport = "true";
let rawCriticalMessage = "   ";
let browserUsed = "chrome"; // "chrome", "firefox", "safari", "edge"
let hasCriticalBug;
let passRate;
let engineName;

rawProjectName = rawProjectName.trim();
let passRateNumber = Number(rawPassRate);

// if (!rawEnvName.trim()) {
//     rawEnvName = "Development";
// }
// else {
//     rawEnvName = rawEnvName.trim();
// }

rawEnvName = rawEnvName.trim() || "Development";

// if (rawHasReport.trim().toLowerCase() === "true") {
//     rawHasReport = true;
// }
// else {
//     rawHasReport = false;
// }
rawHasReport = rawHasReport.trim().toLowerCase() === "true" ? true : false;

if (rawCriticalMessage === null || rawCriticalMessage === undefined) {
    hasCriticalBug = false;
}
else if (rawCriticalMessage.trim() === "") {
    hasCriticalBug = false;
}
else {
    hasCriticalBug = true;
}

if (passRateNumber >= 95) {
    passRate = "EXCELLENT";
}
else if (passRateNumber >= 80) {
    passRate = "GOOD";
}
else if (passRateNumber >= 60) {
    passRate = "NEEDS IMPROVEMENT";
}
else {
    passRate = "CRITICAL";
}

switch (browserUsed) {
    case "chrome":
        engineName = "Chromium";
        break;
    case "edge":
        engineName = "Chromium";
        break;
    case "firefox":
        engineName = "Gecko";
        break;
    case "safari":
        engineName = "WebKit";
        break;
    default:
        engineName = "Unknown";
}

let isReadyToRelease = passRateNumber >= 80 && hasCriticalBug === false && rawHasReport === true;

let hasReport = rawHasReport ? "Có report" : "Chưa có report";
let criticalBugMessage = hasCriticalBug ? "Có bug nghiêm trọng" : "Không có bug nghiêm trọng";
let readyMessage = isReadyToRelease ? "YES" : "NO";

console.log(`Project: ${rawProjectName}`);
console.log(`Environment: ${rawEnvName}`);
console.log(`Browser: ${browserUsed}`);
console.log(`Engine: ${engineName}`);
console.log('');
console.log(`Pass Rate: ${passRateNumber.toFixed(2)}%`);
console.log(`Grade: ${passRate}`);
console.log(`Report: ${hasReport}`);
console.log(`Critical Bug: ${criticalBugMessage}`);
console.log('');
console.log(`Ready: ${readyMessage}`);