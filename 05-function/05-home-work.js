// Bài 1
console.log('--- Bài 1 ---');
const loginOptions = {
    defaultRole: "guest",
    allowedRoles: ["admin", "tester", "viewer", "guest"],
    minPasswordLength: 8,
};

const loginTestData = [
    {
        name: "Case 1 - Hợp lệ cơ bản",
        formInput: {
            username: "  Neko_Admin  ",
            password: "  12345678  ",
            role: " tester ",
            rememberMe: "yes",
            device: "  chrome-win11  ",
        },
    },
    {
        name: "Case 2 - Role rỗng, phải dùng defaultRole",
        formInput: {
            username: "  guest_user  ",
            password: "  abcdefgh  ",
            role: "   ",
            rememberMe: "no",
            device: " firefox ",
        },
    },
    {
        name: "Case 3 - Username rỗng",
        formInput: {
            username: "    ",
            password: "12345678",
            role: "tester",
            rememberMe: "yes",
            device: "chrome",
        },
    },
    {
        name: "Case 4 - Username có khoảng trắng ở giữa",
        formInput: {
            username: "neko admin",
            password: "12345678",
            role: "tester",
            rememberMe: "yes",
            device: "chrome",
        },
    },
    {
        name: "Case 5 - Password quá ngắn",
        formInput: {
            username: "valid_user",
            password: "123",
            role: "tester",
            rememberMe: true,
            device: "chrome",
        },
    },
    {
        name: "Case 6 - Role không hợp lệ",
        formInput: {
            username: "valid_user",
            password: "12345678",
            role: "manager",
            rememberMe: "on",
            device: "chrome",
        },
    },
    {
        name: "Case 7 - rememberMe là boolean true",
        formInput: {
            username: "admin01",
            password: "abcdefgh",
            role: "admin",
            rememberMe: true,
            device: "edge",
        },
    },
    {
        name: "Case 8 - rememberMe là chuỗi lạ",
        formInput: {
            username: "viewer01",
            password: "abcdefgh",
            role: "viewer",
            rememberMe: "maybe",
            device: "safari",
        },
    },
];

function taoPayloadDangNhap(formInput, options = {}) {
    const { username, password, role, rememberMe, device } = formInput;
    const { defaultRole = loginOptions.defaultRole, allowedRoles, minPasswordLength = loginOptions.minPasswordLength } = options;

    // Chuẩn hóa dữ liệu
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanRole = (role.trim() || options.defaultRole).toLowerCase();
    const cleanDevice = device.trim();
    const cleanRememberMe = rememberMe === true || rememberMe === 'true' || rememberMe === 'on';

    const cleanformInput = {
        username: cleanUsername,
        password: cleanPassword,
        role: cleanRole,
        rememberMe: cleanRememberMe,
        device: cleanDevice
    };

    // Kiểm tra hợp lệ:
    // - `username` không được rỗng
    // - `username` không được chứa khoảng trắng ở giữa
    // - `password` phải dài ít nhất `minPasswordLength`
    // - `role` phải nằm trong `allowedRoles`
    const errors = [];
    let isValid = true;

    if (!cleanUsername) {
        isValid = false;
        errors.push('Username rỗng');
    }
    if (cleanUsername.includes(' ')) {
        isValid = false;
        errors.push('Username chứa khoảng trắng');
    }
    if (cleanPassword.length < options.minPasswordLength) {
        isValid = false;
        errors.push(`Password có độ dài ít hơn ${options.minPasswordLength}`);
    }
    if (!options.allowedRoles.includes(cleanRole)) {
        isValid = false;
        errors.push(`Role không nằm trong danh sách cho phép ${options.allowedRoles}`);
    }

    return {
        isValid: isValid,
        payload: cleanformInput,
        errors: errors
    };
}

let result = taoPayloadDangNhap(loginTestData[7].formInput, loginOptions);
console.log(result);

//Bài 2
console.log('--- Bài 2 ---');
function chuanHoaDanhSachTest(rawRows, config = {}) {
    const validCases = [];
    const { minPriority, maxPriority } = config;

    for (item of rawRows) {
        [id, module, priority, tag, status] = item;
        let cleanId = id.trim();
        let cleanModule = module.trim();
        let cleanPriority = Number(priority.trim());
        let cleanTag = tag.trim().toLowerCase();
        let cleanStatus = status.trim().toLowerCase();
        if (cleanId && cleanModule && cleanPriority && cleanTag && cleanStatus) {
            if (cleanPriority <= maxPriority && cleanPriority >= minPriority) {
                validCases.push({ cleanId, cleanModule, cleanPriority, cleanTag, cleanStatus });
            }
        }
    }
    return validCases
}

const testCaseConfig = {
    minPriority: 1,
    maxPriority: 5,
};

const rawRows = [
    [" TC_LOGIN_001 ", "login", "1", " smoke ", "active"],
    ["TC_LOGIN_001", "login", "2", "regression", "active"],
    ["TC_SEARCH_002", "search", "0", "smoke", "active"],
    ["TC_CART_003", "", "3", "checkout", "inactive"],
    ["TC_PAY_004", "payment", "2", " critical ", "ACTIVE"],
    ["TC_ORDER_005", "order", "5", "sanity", "inactive"],
    ["TC_ORDER_006", " order ", "4", " SANITY ", "active"],
    ["LOGIN_007", "login", "2", "smoke", "active"],
    ["TC_USER_008", "user", "6", "regression", "active"],
    ["TC_API_009", "api", "3", "api", "disabled"],
    ["TC_API_010", "api", "2", " api ", "active"],
    ["TC_API_010", "api", "2", " api ", "active"],
    ["TC_REPORT_011", "report", "1", " nightly ", "INACTIVE"],
    [" TC_EMPTY_012 ", "   ", "2", "misc", "active"],
];
const result2 = chuanHoaDanhSachTest(rawRows, testCaseConfig);
console.log(result2);


// Bài 3
console.log('--- Bài 3 ---');
function taoCauHinhCuoi(defaultConfig, envConfig, overrideConfig) {
    const finalConfig = { ...defaultConfig, ...envConfig, ...overrideConfig }
    return finalConfig;
}

function kiemTraCauHinh(configCase, taoCauHinhCuoi) {
    const finalConfig = taoCauHinhCuoi(configCase.defaultConfig, configCase.envConfig, configCase.overrideConfig);
    //console.log(finalConfig);
    const { env, baseUrl, timeout, retries, headed, browsers, reporter } = finalConfig;
    const errorList = [];
    const warnings = [];
    let cleanBrowser = browsers.map(item => item.trim().toLowerCase())

    let uniqueBrowser = cleanBrowser.filter((item, index) => cleanBrowser.indexOf(item) === index); // hàm callback bên trong filter có quy định vị trí của biến. Vị trí đầu tiên là phần tử, vị trí thứ 2 là index của phần tử đó, vị trí thứ 3 là mảng. Vị trí đầu tiên là require, 2 vị trí sau là optional

    if (!baseUrl.startsWith('https://') && !baseUrl.startsWith('http://')) {
        errorList.push("baseUrl doesn't start with https:// or https://");
    }

    if (timeout < 1000) { errorList.push("timeout is less than 1000ms"); }
    if (retries < 0) { errorList.push("retries is less than 0"); }
    if (uniqueBrowser.length === 0) { errorList.push("browser is empty"); }
    if (uniqueBrowser.find((item, index) => uniqueBrowser.indexOf(item) !== index)) { errorList.push('Browser contains duplicated element. The 1st is: ' + uniqueBrowser.indexOf(item)) }
    if (env === 'ci' && headed === true) {
        warnings.push('Please check again, headed true is not recommended for ci env');
    }
    if (baseUrl.includes('prod') && env !== 'product') { warnings.push("Please check env of this config. Are you sure you are working on production?") };

    return {
        errors: errorList,
        warnings: warnings,
        wanrning: env === 'ci',
        env: env
    }
}

const configCase1 = {
    defaultConfig: {
        env: "local",
        baseUrl: "http://localhost:3000",
        timeout: 30000,
        retries: 0,
        headed: true,
        browsers: ["chromium"],
        reporter: {
            type: "html",
            output: "reports/default",
        },
    },
    envConfig: {
        env: "staging",
        baseUrl: "https://staging.neko.dev",
        retries: 1,
        browsers: ["chromium", "firefox"],
    },
    overrideConfig: {
        timeout: 500,
        headed: true,
        browsers: [" Chromium ", "chromium", "webkit"],
        reporter: {
            type: "html",
            output: "reports/custom",
        },
    },
};

const configCase2 = {
    defaultConfig: {
        env: "ci",
        baseUrl: "https://ci.neko.dev",
        timeout: 10000,
        retries: 2,
        headed: true,
        browsers: [" chromium "],
        reporter: {
            type: "html",
            output: "reports/ci",
        },
    },
    envConfig: {},
    overrideConfig: {},
};

const configCase3 = {
    defaultConfig: {
        env: "staging",
        baseUrl: "ftp://bad-url",
        timeout: 2000,
        retries: 1,
        headed: false,
        browsers: ["firefox"],
        reporter: {
            type: "json",
            output: "reports/json",
        },
    },
    envConfig: {},
    overrideConfig: {},
};

const configCase4 = {
    defaultConfig: {
        env: "test",
        baseUrl: "https://prod.neko.dev",
        timeout: 5000,
        retries: 1,
        headed: false,
        browsers: ["webkit"],
        reporter: {
            type: "html",
            output: "reports/test",
        },
    },
    envConfig: {},
    overrideConfig: {},
};

const configCase5 = {
    defaultConfig: {
        env: "local",
        baseUrl: "http://localhost:3000",
        timeout: 30000,
        retries: -1,
        headed: false,
        browsers: [],
        reporter: {
            type: "",
            output: "",
        },
    },
    envConfig: {},
    overrideConfig: {},
};
const result3 = kiemTraCauHinh(configCase2, taoCauHinhCuoi);
console.log(result3);

// Bài 4
console.log('--- Bài 4 ---');
function phanTichKetQuaChay(results, options) {
    const analyzed = [];
    const invalid = [];
    let passed = 0;
    let failed = 0;
    let flaky = 0;
    let slow = 0;
    let invalidCount = 0;


    for (let item of results) {
        let totalDuration = 0;
        let isValidDuration = true;

        const { id, module, statuses, durations, owner } = item;
        const { slowThreshold } = options;

        const finalStatus = statuses[statuses.length - 1];
        const retryCount = statuses.length;
        for (let duration of durations) {
            totalDuration += duration
            if (duration < 0) { isValidDuration = false }
        };
        const isFlaky = finalStatus === 'pass' && statuses.includes('fail');
        const isSlow = totalDuration > slowThreshold;


        let isValid = id !== "" && statuses.length === durations.length && isValidDuration;

        if (isValid === true) {
            analyzed.push(item);
            if (finalStatus === 'fail') { failed++ } else if (finalStatus === 'pass') { passed ++ }
            if (isFlaky) { flaky++ }
            if (isSlow) { slow++ }
        } else {
            invalidCount++;
            invalid.push(item)
        };
    }

    return {
        analyzed: analyzed,
        invalid: invalid,
        summary: {
            total: results.length,
            passed: passed,
            failed: failed,
            flaky: flaky,
            slow: slow,
            invalid: invalidCount
        }
    }
}

const resultOptions = {
    slowThreshold: 2500,
};

const results = [
    {
        id: "TC_LOGIN_001",
        module: "login",
        statuses: ["fail", "pass"],
        durations: [1200, 800],
        owner: "an"
    },
    {
        id: "TC_SEARCH_002",
        module: "search",
        statuses: ["pass"],
        durations: [600],
        owner: "binh"
    },
    {
        id: "TC_CART_003",
        module: "cart",
        statuses: ["fail", "fail", "fail"],
        durations: [1500, 1700, 1600],
        owner: ""
    },
    {
        id: "TC_PAY_004",
        module: "payment",
        statuses: ["pass"],
        durations: [-50],
        owner: "chi"
    },
    {
        id: "TC_PROFILE_005",
        module: "profile",
        statuses: ["pass", "pass"],
        durations: [700, 650],
        owner: "duy"
    },
    {
        id: "",
        module: "report",
        statuses: ["pass"],
        durations: [300],
        owner: "ha"
    },
    {
        id: "TC_API_006",
        module: "api",
        statuses: ["fail", "unknown"],
        durations: [400, 500],
        owner: "linh"
    },
    {
        id: "TC_BILL_007",
        module: "billing",
        statuses: ["fail", "pass", "pass", "pass"],
        durations: [600, 700, 650, 620],
        owner: "minh"
    },
    {
        id: "TC_LOG_008",
        module: "log",
        statuses: ["skip"],
        durations: [100],
        owner: "nam"
    },
    {
        id: "TC_SYNC_009",
        module: "sync",
        statuses: ["fail", "pass"],
        durations: [1500],
        owner: "oanh"
    }
];

const result4 = phanTichKetQuaChay(results, resultOptions);
console.log(result4);

// Bai 5
console.log('--- Bài 5 ---')

function locDanhSachChayLai(rawRuns) {
    const normalizedRuns = rawRuns.map(({ id, module, status, owner, priority, enabled }) => ({
        id: id.trim().toUpperCase(),
        module: module.trim().toLowerCase(),
        status: status.trim().toLowerCase(),
        owner: owner.trim(),
        priority,
        enabled
    }));

    const rerunList = normalizedRuns.filter(
        ({ enabled, id, status }) => enabled === true && id !== "" && (status === 'flaky' || status === 'fail')
    );

    const missingOwnerList = normalizedRuns.filter(
        ({ enabled, id, owner }) => enabled === true && id !== "" && owner === ""
    );

    const firstCriticalCase = normalizedRuns.find(
        ({ enabled, id, priority, status }) =>
            enabled === true && id !== "" && priority === 1 && status === 'fail'
    ) || null;

    return { normalizedRuns, rerunList, missingOwnerList, firstCriticalCase };
}

const rawRuns = [
    { id: " tc_login_001 ", module: " login ", status: " FAIL ", owner: "an", priority: 1, enabled: true },
    { id: "TC_SEARCH_002", module: "search", status: "pass", owner: "binh", priority: 2, enabled: true },
    { id: " tc_cart_003 ", module: " cart ", status: " flaky ", owner: " chi ", priority: 1, enabled: true },
    { id: "TC_PAY_004", module: "payment", status: "fail", owner: "", priority: 1, enabled: true },
    { id: " TC_USER_005 ", module: " user ", status: " skip ", owner: "duy", priority: 3, enabled: true },
    { id: "TC_REPORT_006", module: "report", status: "fail", owner: "ha", priority: 2, enabled: false },
    { id: " ", module: "api", status: "fail", owner: "linh", priority: 1, enabled: true },
    { id: "TC_SYNC_007", module: " sync ", status: " FAIL ", owner: " minh ", priority: 2, enabled: true },
    { id: "TC_BILL_008", module: "billing", status: "pass", owner: "", priority: 1, enabled: true },
    { id: "TC_ORDER_009", module: " order ", status: " flaky ", owner: "nam", priority: 2, enabled: true }
];

const result5 = locDanhSachChayLai(rawRuns);
console.log(result5);