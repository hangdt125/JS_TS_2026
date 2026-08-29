/**
 * LỜI GIẢI MẪU - BỘ 5 BÀI TẬP AUTOMATION TESTING
 * Chủ đề: destructuring, map, filter, find, reduce
 */

// ============================================================
// BÀI 6: Phân loại test case theo tốc độ chạy
// ============================================================
console.log('--- Bài 6 ---');

function phanLoaiTocDoChay(testCases, thresholds) {
    const { fast, slow } = thresholds;

    // Bước 1: chuẩn hoá dữ liệu (map -> mảng mới, không mutate gốc)
    const normalized = testCases.map(({ id, module, duration }) => ({
        id: id.trim().toUpperCase(),
        module: module.trim().toLowerCase(),
        duration,
    }));

    // Bước 2: phân loại bằng filter
    const fastTests = normalized.filter(({ duration }) => duration <= fast);
    const normalTests = normalized.filter(
        ({ duration }) => duration > fast && duration <= slow
    );
    const slowTests = normalized.filter(({ duration }) => duration > slow);

    // Bước 3: tính tổng duration bằng reduce
    const totalDuration = normalized.reduce((sum, { duration }) => sum + duration, 0);

    return {
        fastTests,
        normalTests,
        slowTests,
        summary: {
            fastCount: fastTests.length,
            normalCount: normalTests.length,
            slowCount: slowTests.length,
            totalDuration,
        },
    };
}

const testCases6 = [
    { id: ' TC_001 ', module: 'Login', duration: 450 },
    { id: 'TC_002', module: 'Search', duration: 1200 },
    { id: 'TC_003', module: ' Cart ', duration: 3500 },
    { id: 'TC_004', module: 'Payment', duration: 800 },
    { id: 'TC_005', module: 'User', duration: 150 },
    { id: 'TC_006', module: 'Report', duration: 5200 },
];

const thresholds6 = { fast: 500, slow: 3000 };

console.log(phanLoaiTocDoChay(testCases6, thresholds6));


// ============================================================
// BÀI 7: Gom nhóm test case theo module
// ============================================================
console.log('\n--- Bài 7 ---');

function gomNhomTheoModule(testCases) {
    // Dùng reduce để gom nhóm: accumulator là object { [module]: { ids, passCount, total } }
    const grouped = testCases.reduce((acc, { id, module, status }) => {
        const normalizedId = id.trim().toUpperCase();
        const normalizedModule = module.trim().toLowerCase();
        const isPass = status.trim().toLowerCase() === 'pass';

        // Nếu module chưa tồn tại trong acc, khởi tạo mới (không mutate object cũ)
        if (!acc[normalizedModule]) {
            acc[normalizedModule] = { ids: [], passCount: 0, total: 0 };
        }

        // Lưu ý: đang mutate acc[normalizedModule] để tránh tạo object mới mỗi vòng lặp
        // (đây là pattern chuẩn khi dùng reduce để group-by, chấp nhận mutate accumulator nội bộ)
        acc[normalizedModule].ids.push(normalizedId);
        acc[normalizedModule].total += 1;
        if (isPass) acc[normalizedModule].passCount += 1;

        return acc;
    }, {});

    // Chuyển từ { total, passCount } sang passRate, dùng map trên Object.entries
    const result = Object.fromEntries(
        Object.entries(grouped).map(([module, { ids, passCount, total }]) => [
            module,
            {
                ids,
                passRate: Number((passCount / total).toFixed(2)),
            },
        ])
    );

    return result;
}

const testCases7 = [
    { id: 'tc_001', module: 'login', status: 'pass' },
    { id: 'tc_002', module: 'login', status: 'fail' },
    { id: 'tc_003', module: 'cart', status: 'pass' },
    { id: 'tc_004', module: 'cart', status: 'pass' },
    { id: 'tc_005', module: 'payment', status: 'fail' },
    { id: 'tc_006', module: 'login', status: 'pass' },
];

console.log(gomNhomTheoModule(testCases7));


// ============================================================
// BÀI 8: Tìm test case đầu tiên gây block pipeline
// ============================================================
console.log('\n--- Bài 8 ---');

function timBlockerDauTien(testCases, knownIssues = []) {
    // Điều kiện chung: priority 1 + fail
    const isCriticalFail = ({ priority, status }) => priority === 1 && status === 'fail';

    // blocker: critical fail NHƯNG không nằm trong knownIssues -> dùng find
    const blocker =
        testCases.find(
            (tc) => isCriticalFail(tc) && !knownIssues.includes(tc.id)
        ) || null;

    // ignoredKnownIssues: critical fail VÀ nằm trong knownIssues -> dùng filter
    const ignoredKnownIssues = testCases.filter(
        (tc) => isCriticalFail(tc) && knownIssues.includes(tc.id)
    );

    return { blocker, ignoredKnownIssues };
}

const testCases8 = [
    { id: 'TC_001', priority: 2, status: 'fail' },
    { id: 'TC_002', priority: 1, status: 'pass' },
    { id: 'TC_003', priority: 1, status: 'fail' },
    { id: 'TC_004', priority: 1, status: 'fail' },
    { id: 'TC_005', priority: 3, status: 'fail' },
];

const knownIssues8 = ['TC_003'];

console.log(timBlockerDauTien(testCases8, knownIssues8));
// Kết quả mong đợi: blocker = TC_004, ignoredKnownIssues = [TC_003]


// ============================================================
// BÀI 9: Đối chiếu 2 lần chạy để phát hiện Regression
// ============================================================
console.log('\n--- Bài 9 ---');

// ----- Phiên bản 1: dùng thuần find/filter (đúng trọng tâm bài học) -----
function phatHienRegression_v1(previousRun, currentRun) {
    // Với mỗi item hiện tại, tìm item tương ứng ở lần chạy trước (dùng find)
    const findPrev = (id) => previousRun.find((item) => item.id === id);

    const regressions = currentRun.filter((curr) => {
        const prev = findPrev(curr.id);
        return prev && prev.status === 'pass' && curr.status === 'fail';
    });

    const fixed = currentRun.filter((curr) => {
        const prev = findPrev(curr.id);
        return prev && prev.status === 'fail' && curr.status === 'pass';
    });

    const stillFailing = currentRun.filter((curr) => {
        const prev = findPrev(curr.id);
        return prev && prev.status === 'fail' && curr.status === 'fail';
    });

    const newTests = currentRun.filter((curr) => !findPrev(curr.id));

    return { regressions, fixed, stillFailing, newTests };
}

// ----- Phiên bản 2: dùng Map để tối ưu tra cứu O(1) thay vì find lặp lại O(n) -----
function phatHienRegression_v2(previousRun, currentRun) {
    // Map giúp tra cứu id trước đó với độ phức tạp O(1) thay vì O(n) mỗi lần find
    const prevMap = new Map(previousRun.map((item) => [item.id, item.status]));

    const regressions = [];
    const fixed = [];
    const stillFailing = [];
    const newTests = [];

    currentRun.forEach((curr) => {
        const prevStatus = prevMap.get(curr.id);

        if (prevStatus === undefined) {
            newTests.push(curr);
        } else if (prevStatus === 'pass' && curr.status === 'fail') {
            regressions.push(curr);
        } else if (prevStatus === 'fail' && curr.status === 'pass') {
            fixed.push(curr);
        } else if (prevStatus === 'fail' && curr.status === 'fail') {
            stillFailing.push(curr);
        }
    });

    return { regressions, fixed, stillFailing, newTests };
}

const previousRun9 = [
    { id: 'TC_001', status: 'pass' },
    { id: 'TC_002', status: 'fail' },
    { id: 'TC_003', status: 'pass' },
    { id: 'TC_004', status: 'fail' },
];

const currentRun9 = [
    { id: 'TC_001', status: 'fail' }, // regression
    { id: 'TC_002', status: 'pass' }, // fixed
    { id: 'TC_003', status: 'pass' }, // ổn định
    { id: 'TC_004', status: 'fail' }, // vẫn fail
    { id: 'TC_005', status: 'fail' }, // test mới
];

console.log('v1 (find/filter):', phatHienRegression_v1(previousRun9, currentRun9));
console.log('v2 (Map, tối ưu):', phatHienRegression_v2(previousRun9, currentRun9));


// ============================================================
// BÀI 10: Tính điểm rủi ro (Risk Score) và xếp hạng module
// ============================================================
console.log('\n--- Bài 10 ---');

function xepHangRuiRoModule(testCases) {
    // Bước 1: gom nhóm theo module, đếm fail/flaky/slow bằng reduce
    const grouped = testCases.reduce((acc, { module, status, duration }) => {
        if (!acc[module]) {
            acc[module] = { fail: 0, flaky: 0, slow: 0 };
        }

        if (status === 'fail') acc[module].fail += 1;
        if (status === 'flaky') acc[module].flaky += 1;
        if (duration > 2000) acc[module].slow += 1;

        return acc;
    }, {});

    // Bước 2: tính riskScore cho từng module bằng map
    const ranked = Object.entries(grouped).map(([module, { fail, flaky, slow }]) => ({
        module,
        fail,
        flaky,
        slow,
        riskScore: fail * 3 + flaky * 2 + slow * 1,
    }));

    // Bước 3: sắp xếp giảm dần theo riskScore, KHÔNG mutate mảng gốc
    // dùng [...array].sort() (hoặc toSorted() nếu môi trường hỗ trợ ES2023)
    const sorted = [...ranked].sort((a, b) => b.riskScore - a.riskScore);

    return sorted;
}

const testCases10 = [
    { id: 'TC_001', module: 'login', status: 'pass', duration: 500 },
    { id: 'TC_002', module: 'login', status: 'fail', duration: 1800 },
    { id: 'TC_003', module: 'cart', status: 'flaky', duration: 2500 },
    { id: 'TC_004', module: 'cart', status: 'fail', duration: 3000 },
    { id: 'TC_005', module: 'payment', status: 'pass', duration: 400 },
    { id: 'TC_006', module: 'payment', status: 'flaky', duration: 2200 },
    { id: 'TC_007', module: 'cart', status: 'pass', duration: 600 },
];

console.log(xepHangRuiRoModule(testCases10));
/* Kết quả mong đợi:
[
  { module: 'cart', fail: 1, flaky: 1, slow: 2, riskScore: 7 },
  { module: 'login', fail: 1, flaky: 0, slow: 1, riskScore: 4 },
  { module: 'payment', fail: 0, flaky: 1, slow: 1, riskScore: 3 }
]
*/