// Bai 1
function updateSelectedFields<T, K extends keyof T>(original: T, updates: Partial<Pick<T, K>>): T {
    return {
        ...original,
        ...updates
    }
}

interface UserInfo {
    id: number;
    name: string;
    email: string;
    age: number;
}

const user1: UserInfo = {
    id: 1,
    name: "An",
    email: "an@example.com",
    age: 20
};

const updatedUser = updateSelectedFields<
    UserInfo,
    "name" | "age"
>(user1, {
    name: "Binh",
    age: 21
});

console.log(updatedUser);
// { id: 1, name: "Binh", email: "an@example.com", age: 21 }

console.log(user1);
// { id: 1, name: "An", email: "an@example.com", age: 20 }

// Bai 2

const ORDER_STATUS_INFO = {
    pending: "pending",
    paid: "paid",
    cancelled: "cancelled",
    refunded: "refunded"
} as const;

type OrderStatusInfo =
    (typeof ORDER_STATUS_INFO)[keyof typeof ORDER_STATUS_INFO];

interface OrderInformation {
    id: number;
    status: OrderStatus;
    total: number;
}

type OrderSummary = {
    count: number;
    total: number
}

function summarizeByStatus(orderInfo: OrderInformation[]): Record<OrderStatusInfo, OrderSummary> {
    const initValue = {
        pending: { count: 0, total: 0 },
        paid: { count: 0, total: 0 },
        cancelled: { count: 0, total: 0 },
        refunded: { count: 0, total: 0 }
    }
    return orderInfo.reduce<Record<OrderStatusInfo, OrderSummary>>((acc, item) => {
        acc[item.status].count++;
        acc[item.status].total += item.total;
        return acc
    }, initValue)
}

const orderList: OrderInformation[] = [
    { id: 1, status: "paid", total: 100 },
    { id: 2, status: "pending", total: 200 },
    { id: 3, status: "paid", total: 150 },
    { id: 4, status: "cancelled", total: 50 },
    { id: 5, status: "refunded", total: 80 }
];

console.log(summarizeByStatus(orderList));

// Bai 3

const TEST_STATUS = {
    passed: "passed",
    failed: "failed",
    skipped: "skipped",
    blocked: "blocked",
} as const;

type TestStatus =
    (typeof TEST_STATUS)[keyof typeof TEST_STATUS];

type TestEnvironment = "local" | "staging" | "production";

type SortDirect = "asc" | "desc";

interface TestRun {
    id: string;
    testName: string;
    module: string;
    status: TestStatus;
    environment: TestEnvironment;
    duration: number;
    executedAt: string;
    tags: string[];
    retryCount: number;
}

const testExecution: TestRun[] = [
    {
        id: "tr1",
        testName: "Login with valid credentials",
        module: "auth",
        status: "passed",
        environment: "staging",
        duration: 1200,
        executedAt: "2026-09-01",
        tags: ["smoke", "critical"],
        retryCount: 0,
    },
    {
        id: "tr2",
        testName: "Login with invalid password",
        module: "auth",
        status: "failed",
        environment: "staging",
        duration: 2500,
        executedAt: "2026-09-02",
        tags: ["regression", "critical"],
        retryCount: 2,
    },
    {
        id: "tr3",
        testName: "Search product",
        module: "catalog",
        status: "passed",
        environment: "production",
        duration: 800,
        executedAt: "2026-09-03",
        tags: ["smoke"],
        retryCount: 0,
    },
    {
        id: "tr4",
        testName: "Add item to cart",
        module: "cart",
        status: "failed",
        environment: "staging",
        duration: 3200,
        executedAt: "2026-09-04",
        tags: ["regression"],
        retryCount: 1,
    },
    {
        id: "tr5",
        testName: "Checkout with credit card",
        module: "checkout",
        status: "blocked",
        environment: "production",
        duration: 0,
        executedAt: "2026-09-05",
        tags: ["critical", "payment"],
        retryCount: 0,
    },
    {
        id: "tr6",
        testName: "Logout",
        module: "auth",
        status: "skipped",
        environment: "local",
        duration: 0,
        executedAt: "2026-09-06",
        tags: ["smoke"],
        retryCount: 0,
    },
];

function getField<T, K extends keyof T>(
    item: T, // kiểu dữ liệu của item, là kiểu dữ liệu đầu vào
    key: K // K là kiểu dữ liệu của key K cho kiểu T. T[K] là kiểu dữ liệu của value cho key K của kiểu dữ liệu T
): T[K] {
    return item[key] // lấy value tại 'key' của kiểu dữ liệu T
}

console.log(getField(testExecution[0], "duration"));
// 1200

console.log(getField(testExecution[0], "tags"));
// ["smoke", "critical"]

// Lỗi TypeScript:
// getField(testExecution[0], "unknown");

function pickFields<T, K extends keyof T>(
    item: T,
    keys: K[]
): Pick<T, K> {
    const result = {} as Pick<T, K> // khi muốn khởi tạo object rỗng nhưng lại có kiểu dữ liệu Pick/Record,,... -> kiểu dữ liệu có sự ràng buộc -> sử dụng từ khoá as + kiểu dữ liệu để ép kiểu tạm thời

    for (let key of keys) {
        result[key] = item[key]
    }
    return result
}

const selected = pickFields(testExecution[0], [
    "id",
    "status",
    "duration",
]);

console.log(selected);
// {
//   id: "tr1",
//   status: "passed",
//   duration: 1200
// }

function updateField<T, K extends keyof T>(
    item: T,
    key: K,
    value: T[K]
): T {
    const result: T = {
        ...item, //copy dữ liệu từ object cũ sau đó ghi đè bằng 1 cặp key-value
        [key]: value //key là biến và cần đặt trong []
    }
    return result
}

const updated = updateField(
    testExecution[0],
    "status",
    TEST_STATUS.failed
);
console.log(updated.status);
// "failed"

console.log(testExecution[0].status);
// "passed"

// Lỗi TypeScript:
// updateField(testExecution[0], "duration", "1200");

function updateFields<T>(
    item: T,
    updates: Partial<T> //updates có kiểu partial, dùng để update 1 phần dữ liệu thay vì update toàn bộ value của object
): T {
    const result = {
        ...item, // đây là cách không làm thay đổi mảng gốc, copy obbject sau đó ghi đè dữ liệu cũ
        ...updates
    }
    return result
}

const updatedList = updateFields<TestRun>(testExecution[0], {
    status: "failed",
    duration: 1800,
});

console.log(updatedList);
// Các thuộc tính khác giữ nguyên.
// status = "failed", duration = 1800,
// retryCount vẫn bằng 0.

function sortBy<T, K extends keyof T>(
    items: T[],
    key: K,
    direction: SortDirect = 'asc'
): T[] {
    const multiplier = direction === 'asc' ? 1 : -1

    return [...items].sort((a, b) => {
        const valueA = a[key]
        const valueB = b[key]
        if (typeof valueA === 'string' && typeof valueB === 'string') { return valueA.localeCompare(valueB) * multiplier } // đây là cách sort cơ bản, sort theo string thì dùng hàm localeCompare để so sánh, multiplier giúp đảo chiều sort
        if (typeof valueA === 'number' && typeof valueB === 'number') { return (valueA - valueB) * multiplier } // sort theo number, nếu valueA - value B <0 -> a đứng trước b,  > 0 thì b đứng trước a, = 0 thì giữ nguyên vị trí hiện tại
        throw new TypeError('Type of value should be string or number')
    })
}

console.log(
    sortBy(testExecution, "duration", "desc").map((item) => item.id)
);
// ["tr4", "tr2", "tr1", "tr3", "tr5", "tr6"]

console.log(
    sortBy(testExecution, "module").map((item) => item.id)
);
// [ 'tr1', 'tr2', 'tr6', 'tr4', 'tr3', 'tr5' ]


function groupBy<T, K extends keyof T>(
    items: T[],
    key: K
): Record<string, T[]> {

    const result = Object.groupBy(items, (item) => String(item[key])) as Record<string, T[]> // groupBy giúp gom nhóm các object theo tiêu chí là 1 key nào đó
    return result
}

const grouped = groupBy(testExecution, "status");

console.log(Object.keys(grouped));
// ["passed", "failed", "blocked", "skipped"]

console.log(grouped.failed.map((item) => item.id));
// ["tr2", "tr4"]

function createIndex<T, K extends keyof T>(
    items: T[],
    key: K
): Record<string, T> {
// có thể xác định kiểu dữ liệu cho  giá trị acculator (acc)) - giá trị tổng hợp khi duyệt mảng arr. Đối với các kiểu dữ liệu cơ bản, typw của acc có thể đc typescript tự suy luận nhưng đối với các kiểu dữ liệu phức tạp được tự định nghĩa thì cần define kiểu dữ liệu cho gía trị này
    const result = items.reduce<Record<string, T>>((acc, item) => {
        const keyValue = String(item[key]); // tạo index cho object giúp tìm kiếm phần tử hiệu quả hơn, đặc biệt là khi phải tìm kiếm nhiều lần
        acc[keyValue] = item
        return acc
    }, {})
    return result
}

const index = createIndex(testExecution, "id");

console.log(index);

console.log(index.tr3.testName);
// "Search product"

console.log(index.tr2.environment);
// "staging"

type TestSum = {
    count: number;
    totalDuration: number;
    totalRetries: number;
}

function summarizeByStatus2(
    items: TestRun[]
): Record<TestStatus, TestSum> {
    const initValue: Record<TestStatus, TestSum> = {
        "blocked": { count: 0, totalDuration: 0, totalRetries: 0 },
        "failed": { count: 0, totalDuration: 0, totalRetries: 0 },
        "passed": { count: 0, totalDuration: 0, totalRetries: 0 },
        "skipped": { count: 0, totalDuration: 0, totalRetries: 0 }
    }

    const result = items.reduce<Record<TestStatus, TestSum>>((acc, item) => {
        acc[item.status].count++;
        acc[item.status].totalDuration += item.duration;
        acc[item.status].totalRetries += item.retryCount;
        return acc
    }, initValue)

    return result;
}

const report1 = summarizeByStatus2(testExecution);

console.log(report1.passed);
// {
//   count: 2,
//   totalDuration: 2000,
//   totalRetries: 0
// }

console.log(report1.failed);
// {
//   count: 2,
//   totalDuration: 5700,
//   totalRetries: 3
// }

console.log(report1.blocked);
// {
//   count: 1,
//   totalDuration: 0,
//   totalRetries: 0
// }

function getUniqueValues<T, K extends keyof T>(
    items: T[],
    key: K
): T[K][] {
    const uniqueValue = new Set(items.map(item => item[key]))
    const result = [...uniqueValue] // dùng spread để gom tất cả các phần tử của 1 set vào 1 mảng
    return result;
}

console.log(getUniqueValues(testExecution, "module"));
// ["auth", "catalog", "cart", "checkout"]

console.log(getUniqueValues(testExecution, "status"));
// ["passed", "failed", "blocked", "skipped"]

function filterByTags<T extends { tags: string[] }>(
    items: T[],
    requiredTags: string[]
): T[] {
    let results: T[] = [];
    if (requiredTags.length === 0) { return results = items }

    for (let item of items) {
        const isContainTags = requiredTags.every(tag => item.tags.includes(tag)) // dùng every để kiểm tra tất cả các phần tử của 1 mảng có thoả mãn điều kiện không
        if (isContainTags === true){results.push(item)}
    }

    return results
}

console.log(
    filterByTags(testExecution, ["critical"]).map((item) => item.id)
);
// ["tr1", "tr2", "tr5"]

console.log(
    filterByTags(testExecution, ["smoke", "critical"]).map((item) => item.id)
);
// ["tr1"]

console.log(filterByTags(testExecution, []));
// Trả về toàn bộ testRuns.