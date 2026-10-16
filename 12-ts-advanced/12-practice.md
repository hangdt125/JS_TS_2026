## Bài tập 1: `updateSelectedFields`

Mục tiêu: Luyện tập Generic `T`, `K extends keyof T`, `Partial`, `Pick` và spread operator.

### Đề bài

Viết hàm `updateSelectedFields` nhận vào:

- `original`: object ban đầu có kiểu `T`.
- `updates`: object chứa các thuộc tính cần cập nhật, chỉ được phép chọn từ những key thuộc `T`.

Hàm trả về một object mới, kết hợp dữ liệu ban đầu với các giá trị cập nhật.

Yêu cầu:

1. Sử dụng Generic `T` và `K extends keyof T`.
2. Sử dụng `Partial<Pick<T, K>>` để khai báo kiểu của `updates`.
3. Không thay đổi object `original` ban đầu.
4. Không cho phép cập nhật những thuộc tính không tồn tại trong kiểu `T`.

### Code mẫu

```
function updateSelectedFields<T, K extends keyof T>(
  original: T,
  updates: Partial<Pick<T, K>>
): T {
  // TODO: Hoàn thành hàm
}
```

### Dữ liệu kiểm thử

```
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const user: User = {
  id: 1,
  name: "An",
  email: "an@example.com",
  age: 20
};

const updatedUser = updateSelectedFields<
  User,
  "name" | "age"
>(user, {
  name: "Binh",
  age: 21
});

console.log(updatedUser);
// { id: 1, name: "Binh", email: "an@example.com", age: 21 }

console.log(user);
// { id: 1, name: "An", email: "an@example.com", age: 20 }
```

Câu hỏi tự luyện:

- `keyof T` có vai trò gì?
- Vì sao cần `Partial` khi cập nhật một số thuộc tính?
- `Pick<T, K>` khác `Partial<T>` như thế nào?
- Vì sao hàm trả về `T`?

## Bài tập 2: `summarizeByStatus`

Mục tiêu: Luyện tập `typeof`, `keyof typeof`, indexed access type, `Record`, Generic trong `reduce()` và xử lý mảng object.

### Đề bài

Cho danh sách đơn hàng. Viết hàm `summarizeByStatus` để thống kê số lượng đơn hàng và tổng giá trị đơn hàng theo từng trạng thái.

### Bước 1: Khai báo trạng thái

```
const ORDER_STATUS = {
  pending: "pending",
  paid: "paid",
  cancelled: "cancelled",
  refunded: "refunded"
} as const;

type OrderStatus =
  (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
```

### Bước 2: Khai báo kiểu dữ liệu

```
interface OrderInfo {
  id: number;
  status: OrderStatus;
  total: number;
}
```

### Bước 3: Khai báo chữ ký hàm

```
function summarizeByStatus(
  orders: OrderInfo[]
): Record<OrderStatus, { count: number; total: number }> {
  // TODO: Hoàn thành hàm
}
```

### Bước 4: Dữ liệu kiểm thử

```
const orders: OrderInfo[] = [
  { id: 1, status: "paid", total: 100 },
  { id: 2, status: "pending", total: 200 },
  { id: 3, status: "paid", total: 150 },
  { id: 4, status: "cancelled", total: 50 },
  { id: 5, status: "refunded", total: 80 }
];

console.log(summarizeByStatus(orders));
```

### Kết quả mong đợi

```
{
  pending:   { count: 1, total: 200 },
  paid:      { count: 2, total: 250 },
  cancelled: { count: 1, total: 50 },
  refunded:  { count: 1, total: 80 }
}
```

Yêu cầu:

1. Khởi tạo đầy đủ bốn trạng thái với `count: 0` và `total: 0`.
2. Sử dụng `reduce()` để duyệt qua danh sách đơn hàng.
3. Tăng `count` và cộng `total` cho đúng trạng thái.
4. Không sử dụng `if` riêng cho từng trạng thái; hãy truy cập trạng thái trực tiếp thông qua `result[item.status]`.
5. Không thay đổi dữ liệu đầu vào.

Câu hỏi tự luyện:

- Vì sao cần `as const`?
- `(typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]` tạo ra kiểu gì?
- Vì sao `Record<OrderStatus, ...>` yêu cầu đủ bốn key?
- Vì sao nên dùng `===` thay vì `=` khi so sánh?
- Trong `reduce<U>()`, `U` đại diện cho kiểu dữ liệu nào?


## Bài tập 3: Bài tập tổng hợp

Bài tổng hợp với chủ đề Automation Testing – quản lý kết quả chạy test. Bài này vẫn luyện Generic, `keyof`, `typeof`, `T[K]`, `Pick`, `Partial`, `Record`, `reduce` và bổ sung thêm `filter`, `Set`, xử lý mảng lồng nhau.

# TypeScript Practice — Test Run Analytics

## 1. Bộ dữ liệu cho sẵn

```
const TEST_STATUS = {
  passed: "passed",
  failed: "failed",
  skipped: "skipped",
  blocked: "blocked",
} as const;

type TestStatus =
  (typeof TEST_STATUS)[keyof typeof TEST_STATUS];

type TestEnvironment = "local" | "staging" | "production";

type SortDirection = "asc" | "desc";

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

const testRuns: TestRun[] = [
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
```

---

## 2. Yêu cầu

### Bài 1 — `getField`

Viết hàm:

```
function getField<T, K extends keyof T>(
  item: T,
  key: K
): T[K]
```

Yêu cầu:

- Lấy giá trị của một thuộc tính bất kỳ trong object.
- Return type phải phụ thuộc chính xác vào `key`.
- TypeScript phải báo lỗi khi truyền key không tồn tại.

Ví dụ:

```
console.log(getField(testRuns[0], "duration"));
// 1200

console.log(getField(testRuns[0], "tags"));
// ["smoke", "critical"]

// Lỗi TypeScript:
// getField(testRuns[0], "unknown");
```

### Bài 2 — `pickFields`

Viết hàm:

```
function pickFields<T, K extends keyof T>(
  item: T,
  keys: K[]
): Pick<T, K>
```

Yêu cầu:

- Trả về object mới chỉ chứa các thuộc tính được chọn.
- Giữ nguyên kiểu dữ liệu của từng thuộc tính.
- Không thay đổi object đầu vào.
- Không sử dụng `any`.

Ví dụ:

```
const selected = pickFields(testRuns[0], [
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
```

### Bài 3 — `updateField`

Viết hàm:

```
function updateField<T, K extends keyof T>(
  item: T,
  key: K,
  value: T[K]
): T
```

Yêu cầu:

- Tạo object mới với thuộc tính được cập nhật.
- Không mutate object gốc.
- Giá trị truyền vào phải đúng kiểu của thuộc tính tương ứng.
- Không sử dụng ép kiểu để bỏ qua lỗi TypeScript.

Ví dụ:

```
const updated = updateField(
  testRuns[0],
  "status",
  TEST_STATUS.failed
);

console.log(updated.status);
// "failed"

console.log(testRuns[0].status);
// "passed"

// Lỗi TypeScript:
// updateField(testRuns[0], "duration", "1200");
```

### Bài 4 — `updateFields`

Viết hàm:

```
function updateFields<T, K extends keyof T>(
  item: T,
  updates: Partial<Pick<T, K>>
): T
```

Yêu cầu:

- Cho phép cập nhật nhiều thuộc tính cùng lúc.
- Chỉ cho phép cập nhật các thuộc tính thuộc `K`.
- Các thuộc tính trong `updates` đều là tùy chọn.
- Trả về object mới, không mutate object ban đầu.

Ví dụ:

```
const updated = updateFields<
  TestRun,
  "status" | "duration" | "retryCount"
>(testRuns[0], {
  status: "failed",
  duration: 1800,
});

console.log(updated);
// Các thuộc tính khác giữ nguyên.
// status = "failed", duration = 1800,
// retryCount vẫn bằng 0.
```

### Bài 5 — `sortBy`

Viết hàm:

```
function sortBy<T, K extends keyof T>(
  items: T[],
  key: K,
  direction?: SortDirection
): T[]
```

Yêu cầu:

- Hỗ trợ sắp xếp theo thuộc tính kiểu `string` hoặc `number`.
- Mặc định `direction` là `"asc"`.
- `"asc"` sắp xếp tăng dần; `"desc"` sắp xếp giảm dần.
- Trả về mảng mới, không mutate mảng đầu vào.
- Xử lý đúng cả chuỗi và số.
- Không dùng `any`.

Gợi ý: dùng `localeCompare()` khi so sánh chuỗi và phép so sánh số khi so sánh number. Bạn cần tự quyết định cách xử lý trường hợp thuộc tính không phải string hoặc number.

Ví dụ:

```
console.log(
  sortBy(testRuns, "duration", "desc").map((item) => item.id)
);
// ["tr4", "tr2", "tr1", "tr3", "tr5", "tr6"]

console.log(
  sortBy(testRuns, "module").map((item) => item.id)
);
// ["tr4", "tr5", "tr1", "tr2", "tr6", "tr3"]
```

### Bài 6 — `groupBy`

Viết hàm:

```
function groupBy<T, K extends keyof T>(
  items: T[],
  key: K
): Record<string, T[]>
```

Yêu cầu:

- Nhóm các object theo giá trị của thuộc tính được chọn.
- Key của object kết quả phải được tạo bằng `String(item[key])`.
- Nếu nhiều object có cùng giá trị key, chúng phải nằm trong cùng một nhóm.
- Không mutate mảng đầu vào.

Ví dụ:

```
const grouped = groupBy(testRuns, "status");

console.log(Object.keys(grouped));
// ["passed", "failed", "blocked", "skipped"]

console.log(grouped.failed.map((item) => item.id));
// ["tr2", "tr4"]
```

Thứ tự các nhóm phụ thuộc vào lần đầu mỗi key xuất hiện trong dữ liệu.

Thử thêm với thuộc tính `environment` và `retryCount`.

### Bài 7 — `createIndex`

Viết hàm:

```
function createIndex<T, K extends keyof T>(
  items: T[],
  key: K
): Record<string, T>
```

Yêu cầu:

- Tạo object dùng để tra cứu nhanh theo một thuộc tính.
- Key của object kết quả phải là `String(item[key])`.
- Value là object gốc tương ứng.
- Nếu có key trùng nhau, quy định rõ object nào được giữ lại. Hãy chọn cách xử lý nhất quán và kiểm thử nó.

Ví dụ:

```
const index = createIndex(testRuns, "id");

console.log(index.tr3.testName);
// "Search product"

console.log(index.tr2.environment);
// "staging"
```

Câu hỏi: nếu cần tìm nhiều lần theo `id`, cách này khác gì so với việc gọi `find()` mỗi lần?

### Bài 8 — `summarizeByStatus`

Viết hàm:

```
function summarizeByStatus(
  items: TestRun[]
): Record<
  TestStatus,
  {
    count: number;
    totalDuration: number;
    totalRetries: number;
  }
>
```

Yêu cầu:

- Kết quả phải có đầy đủ bốn key: `passed`, `failed`, `skipped`, `blocked`.
- Với mỗi trạng thái, tính:
  - `count`: số test run.
  - `totalDuration`: tổng thời gian chạy.
  - `totalRetries`: tổng số lần retry.
- Trạng thái không xuất hiện trong dữ liệu vẫn phải có giá trị bằng `0`.
- Sử dụng `reduce()`.
- Không viết riêng một nhánh `if` cho từng trạng thái.
- Không mutate mảng đầu vào.

Gợi ý: khởi tạo accumulator có đủ trạng thái, sau đó truy cập trực tiếp bằng `result[item.status]`.

Ví dụ:

```
const summary = summarizeByStatus(testRuns);

console.log(summary.passed);
// {
//   count: 2,
//   totalDuration: 2000,
//   totalRetries: 0
// }

console.log(summary.failed);
// {
//   count: 2,
//   totalDuration: 5700,
//   totalRetries: 3
// }

console.log(summary.blocked);
// {
//   count: 1,
//   totalDuration: 0,
//   totalRetries: 0
// }
```

### Bài 9 — `getUniqueValues`

Viết hàm:

```
function getUniqueValues<T, K extends keyof T>(
  items: T[],
  key: K
): T[K][]
```

Yêu cầu:

- Trả về danh sách các giá trị không trùng lặp của thuộc tính `key`.
- Giữ thứ tự xuất hiện đầu tiên.
- Không thay đổi mảng đầu vào.
- Không sử dụng `any`.

Ví dụ:

```
console.log(getUniqueValues(testRuns, "module"));
// ["auth", "catalog", "cart", "checkout"]

console.log(getUniqueValues(testRuns, "status"));
// ["passed", "failed", "blocked", "skipped"]
```

Thử với `retryCount` và giải thích vì sao kết quả là một mảng number.

### Bài 10 — `filterByTags`

Viết hàm:

```
function filterByTags<T extends { tags: string[] }>(
  items: T[],
  requiredTags: string[]
): T[]
```

Yêu cầu:

- Trả về các object có chứa **tất cả** tag trong `requiredTags`.
- Không thay đổi mảng đầu vào.
- Giữ nguyên kiểu `T` của các phần tử được trả về.
- Nếu `requiredTags` là mảng rỗng, trả về tất cả phần tử.
- Không sử dụng `any`.

Ví dụ:

```
console.log(
  filterByTags(testRuns, ["critical"]).map((item) => item.id)
);
// ["tr1", "tr2", "tr5"]

console.log(
  filterByTags(testRuns, ["smoke", "critical"]).map((item) => item.id)
);
// ["tr1"]

console.log(filterByTags(testRuns, []));
// Trả về toàn bộ testRuns.
```

---

## 3. Kiểm tra lỗi kiểu dữ liệu

Sau khi hoàn thành, hãy thử bỏ comment các dòng sau. TypeScript phải báo lỗi phù hợp:

```
// Key không tồn tại
// getField(testRuns[0], "browser");

// Sai kiểu value
// updateField(testRuns[0], "duration", "1200");

// Sai status
// updateField(testRuns[0], "status", "success");

// Key không tồn tại khi sắp xếp
// sortBy(testRuns, "unknown");

// Cập nhật thuộc tính không thuộc tập K
// updateFields<TestRun, "status">(testRuns[0], {
//   duration: 1000,
// });
```

## 4. Checklist tự đánh giá

- Hiểu tại sao `K extends keyof T` giới hạn được các key hợp lệ.
- Hiểu tại sao `T[K]` giúp return type phụ thuộc vào key.
- Phân biệt được `Pick<T, K>` và `Partial<T>`.
- Biết kết hợp `Partial<Pick<T, K>>`.
- Biết vì sao `Record<TestStatus, V>` yêu cầu đủ các status.
- Viết được `reduce()` với accumulator có kiểu rõ ràng.
- Sắp xếp mảng mà không làm thay đổi mảng gốc.
- Phân biệt được `groupBy` và `createIndex`.
- Biết dùng `Set` để loại bỏ giá trị trùng lặp.
- Biết dùng Generic constraint `T extends { tags: string[] }`.
- Không sử dụng `any` hoặc ép kiểu chỉ để che lỗi.

