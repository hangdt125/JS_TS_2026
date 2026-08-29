## Bài 1: Refactor hàm `taoPayloadDangNhap()`

### Bối cảnh thực tế

Form đăng nhập ngoài đời thường rất bẩn:

- người dùng gõ thừa khoảng trắng
- role viết hoa viết thường lung tung
- checkbox `remember me` lúc thì là `true`, lúc là `"yes"`, lúc là `"on"`
- dev truyền object input vào nhiều nơi, chỉ cần sửa trực tiếp nhầm một lần là bug dây chuyền

### Đề bài

Viết hàm:

```javascript
function taoPayloadDangNhap(formInput, options = {})
```

### Bộ data test dùng để làm bài

```javascript
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
```

Khi làm với bộ data test này:

- `formInput` nhận `loginTestData[i].formInput`
- `options` nhận `loginOptions`
- Ví dụ gọi hàm: ``taoPayloadDangNhap(loginTestData[0].formInput, loginOptions)

### Yêu cầu

1. Dùng object destructuring để lấy dữ liệu từ `formInput`.
2. Dùng object destructuring + default value để lấy dữ liệu từ `options`.
   - Nếu `options.defaultRole` không có thì biến `defaultRole` nhận `"guest"`.
   - Nếu `options.minPasswordLength` không có thì biến `minPasswordLength` nhận `8`.
   - `"guest"` và `8` lấy theo `loginOptions` đã cho ở đầu bài, không phải tự nghĩ thêm.
   - `allowedRoles` lấy thẳng từ `options.allowedRoles`, không tự thêm giá trị khác.
   - Trong bộ data test hiện tại, `options` đã có đủ field nên 2 giá trị mặc định này có thể không chạy; chúng được giữ lại để bám đúng YC2.
3. Chuẩn hóa dữ liệu:
   - `username` -> trim, chuyển về lowercase
   - `password` -> trim
   - `role` -> trim, lowercase
   - `device` -> trim
   - `rememberMe` -> chuyển về boolean
4. Kiểm tra hợp lệ:
   - `username` không được rỗng
   - `username` không được chứa khoảng trắng ở giữa
   - `password` phải dài ít nhất `minPasswordLength`
   - `role` phải nằm trong `allowedRoles`
5. Không được sửa trực tiếp `formInput` hoặc `options`.
6. Phải trả về object theo dạng:

```javascript
{
    isValid: true,
    payload: {
        username: "neko_admin",
        password: "12345678",
        role: "tester",
        rememberMe: true,
        device: "chrome-win11"
    },
    errors: []
}
```

---

## Bài 2: Chuẩn hóa dữ liệu test case import từ spreadsheet

### Bối cảnh thực tế

Khi import test case từ Excel hoặc Google Sheet, dữ liệu thường lộn xộn:

- có dòng thừa khoảng trắng
- priority lúc là số, lúc là chuỗi
- status viết sai chính tả
- cùng một test case id xuất hiện 2 lần

### Đề bài

Viết hàm:

```javascript
function chuanHoaDanhSachTest(rawRows, config = {})
```

### Bộ data test dùng để làm bài

```javascript
const testCaseConfig = {
  minPriority: 1,
  maxPriority: 5,
};

const rawRows = [
  [" TC_LOGIN_001 ", "login", "1", " smoke ", "active"],
  ["TC_LOGIN_001", "login", "2", "regression", "active"],
  ["TC_SEARCH_002", "search", "0", "smoke", "active"],
  ["TC_CART_003", ", "3", "checkout", "inactive"],
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
```

Khi làm với bộ data test này:

- `rawRows` nhận mảng `rawRows` ở trên
- `config` nhận `testCaseConfig`
- Ví dụ gọi hàm: `chuanHoaDanhSachTest(rawRows, testCaseConfig)`

### Quy ước dữ liệu

Mỗi dòng có cấu trúc:

```javascript
[id, module, priority, tag, status];
```

### Yêu cầu

1. Dùng array destructuring để bóc từng cột.
2. Chuẩn hóa:
   - `id` -> trim, uppercase
   - `module` -> trim, lowercase
   - `priority` -> đổi sang number
   - `tag` -> trim, lowercase
   - `status` -> trim, lowercase
3. Test case hợp lệ khi:
   - `id` bắt đầu bằng `TC_`
   - `module` không rỗng
   - `priority` nằm trong `1` đến `5`
   - `status` chỉ là `active` hoặc `inactive`
   - không bị trùng `id`
4. Khi gọi `chuanHoaDanhSachTest(rawRows, testCaseConfig)`, hàm phải `return` object có dạng:

```javascript
{
    validCases: [...],
    invalidCases: [...],
    summary: {
        total: rawRows.length,
        valid: ...,
        invalid: ...,
        duplicateIds: ...
    }
}
```

### Điều bắt buộc

1. Dùng `for` để duyệt `rawRows`.
2. Không dùng `map`, `filter`, `find` cho phần duyệt chính của bài này.
3. Không được sửa trực tiếp `rawRows`.
   Nghĩa là không gán ngược vào từng dòng cũ trong mảng này, mà chỉ đọc dữ liệu cũ rồi tạo object mới để đưa vào kết quả trả về.
4. Mỗi test case hợp lệ phải được build thành object mới:

```javascript
{
    id: "TC_LOGIN_001",
    module: "login",
    priority: 1,
    tag: "smoke",
    status: "active"
}
```

---

## Bài 3: Merge config chạy test và bắt lỗi cấu hình

### Bối cảnh thực tế

Dự án thường có nhiều lớp config:

- `defaultConfig`
- `envConfig`
- `overrideConfig` do người chạy test truyền vào

Bug rất hay gặp:

- gộp sai thứ tự nên config bị ghi đè ngược
- dùng spread với object rồi tưởng là sao chép sâu
- timeout âm hoặc quá bé
- CI mà vẫn bật `headed: true`
- danh sách browser bị trùng tên

### Đề bài

Viết 2 hàm:

```javascript
function taoCauHinhCuoi(defaultConfig, envConfig, overrideConfig)
function kiemTraCauHinh(config)
```

### Bộ data test dùng để làm bài

```javascript
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
    browsers: ["chromium"],
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
      type: ",
      output: ",
    },
  },
  envConfig: {},
  overrideConfig: {},
};
```

Khi làm với bộ data test này:

- `defaultConfig`, `envConfig`, `overrideConfig` lấy từ từng `configCase`
- `config` truyền vào `kiemTraCauHinh(config)` là object cuối sau khi đã merge
- Ví dụ với `configCase1`:

```javascript
const finalConfig = taoCauHinhCuoi(
  configCase1.defaultConfig,
  configCase1.envConfig,
  configCase1.overrideConfig,
);

kiemTraCauHinh(finalConfig);
```

### Yêu cầu

1. Dùng spread để merge config.
2. Thứ tự merge phải là:

```javascript
defaultConfig -> envConfig -> overrideConfig
```

3. Trong `kiemTraCauHinh(config)`, với mảng `browsers`:
   - dùng `map` để `trim` và đưa từng browser về lowercase
   - dùng `filter` để lấy ra browser bị trùng
   - dùng `find` để lấy browser trùng đầu tiên nếu có
4. Hàm `kiemTraCauHinh()` phải trả về:

```javascript
{
    errors: [],
    warnings: []
}
```

- Không bắt buộc đúng từng câu chữ của `errors` và `warnings`.
- Chỉ cần phân biệt đúng lỗi nào đưa vào `errors`, cảnh báo nào đưa vào `warnings`.
- Có thể dùng câu ngắn gọn, dễ hiểu.

### Luật kiểm tra

- `baseUrl` phải bắt đầu bằng `http://` hoặc `https://`
- `timeout` phải từ `1000` trở lên
- `retries` không được âm
- `browsers` không được rỗng
- không được có browser trùng sau khi đã `trim` và đưa về lowercase
- nếu `env === "ci"` mà `headed === true` -> warning
- nếu `baseUrl` chứa `"prod"` nhưng `env !== "production"` -> warning

### Điều bắt buộc

1. Không được sửa trực tiếp bất kỳ config đầu vào nào.
2. Dùng object destructuring ít nhất 1 lần.
3. Dùng `map`, `filter`, `find` ở phần xử lý `browsers`.

"


## Bài 4: Phân tích kết quả chạy test có chạy lại

### Bối cảnh thực tế

Đây là kiểu dữ liệu QA và automation gặp suốt:

- một test có thể chạy nhiều lần
- có test fail rồi pass ở lần chạy lại sau
- có test duration âm do dữ liệu log lỗi
- có kết quả trả về cho một test không tồn tại trong danh sách master

### Đề bài

Viết hàm:

```javascript
function phanTichKetQuaChay(results, options)
```

### Bộ data test dùng để làm bài

```javascript
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
        owner: "
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
        id: ",
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
```

Khi làm với bộ data test này:

- `results` nhận mảng `results` ở trên
- `options` nhận `resultOptions`
- Ví dụ gọi hàm: `phanTichKetQuaChay(results, resultOptions)`

### Yêu cầu

1. Tính cho mỗi test:
   - `finalStatus`
   - `retryCount`
   - `totalDuration`
   - `isFlaky`
   - `isSlow`
2. Một test được xem là `flaky` nếu:
   - có ít nhất 1 lần `fail`
   - và lần cuối là `pass`
3. Một test là `slow` nếu tổng duration lớn hơn `slowThreshold`
4. Một test là invalid nếu:
   - thiếu `id`
   - `statuses.length !== durations.length`
   - có duration âm
5. Khi gọi `phanTichKetQuaChay(results, resultOptions)`, hàm phải `return` object có dạng:

```javascript
{
    analyzed: [...],
    invalid: [...],
    summary: {
        total: results.length,
        passed: ...,
        failed: ...,
        flaky: ...,
        slow: ...,
        invalid: ...
    }
}
```

### Điều bắt buộc

1. Dùng destructuring khi đọc từng result object.
2. Không dùng biến global để cộng dồn phần tổng kết.
3. Giữ bài này trong 1 hàm chính `phanTichKetQuaChay(results, options)`."

"
## Bài 5: Lọc danh sách test cần chạy lại bằng `map`, `filter`, `find`

### Bối cảnh thực tế

Sau một lượt chạy regression, team thường phải chốt rất nhanh:

- test nào cần chạy lại
- test nào thiếu owner để giao người xử lý
- test fail mức độ ưu tiên cao đầu tiên là test nào
- dữ liệu trả về có đang bị thừa khoảng trắng hoặc viết hoa viết thường lung tung không

### Đề bài

Viết hàm:

```javascript
function locDanhSachChayLai(rawRuns)
```

### Bộ data test dùng để làm bài

```javascript
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
```

Khi làm với bộ data test này:

- `rawRuns` nhận trực tiếp mảng `rawRuns` ở trên
- Ví dụ gọi hàm: `locDanhSachChayLai(rawRuns)`

### Yêu cầu

1. Dùng `map` để tạo `normalizedRuns`.
2. Trong từng phần tử của `normalizedRuns`, chuẩn hóa dữ liệu:
   - `id` -> trim, uppercase
   - `module` -> trim, lowercase
   - `status` -> trim, lowercase
   - `owner` -> trim
   - giữ nguyên `priority`, `enabled`
3. Dùng `filter` để tạo `rerunList`. Một test cần chạy lại khi:
   - `enabled === true`
   - `id` không rỗng
   - `status` là `fail` hoặc `flaky`
4. Dùng `filter` để tạo `missingOwnerList`. Chỉ lấy các test:
   - `enabled === true`
   - `id` không rỗng
   - `owner === ""`
5. Dùng `find` để tạo `firstCriticalCase`. Đây là test đầu tiên thỏa:
   - `enabled === true`
   - `id` không rỗng
   - `priority === 1`
   - `status === "fail"`
6. Hàm phải `return` object có dạng:

```javascript
{
    normalizedRuns: [...],
    rerunList: [...],
    missingOwnerList: [...],
    firstCriticalCase: { ... } // hoặc null nếu không có
}
```

### Điều bắt buộc

1. Dùng object destructuring khi đọc từng phần tử bên trong `map`.
2. Giữ bài này trong 1 hàm chính `locDanhSachChayLai(rawRuns)`.
3. Không được sửa trực tiếp `rawRuns`.
4. Không dùng `for` cho phần xử lý chính của bài này.
"