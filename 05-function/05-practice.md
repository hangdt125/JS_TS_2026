# Bộ 5 Bài Tập: Xử Lý Mảng & Object trong Automation Testing

Chủ đề: destructuring, `map`, `filter`, `find`, `reduce` áp dụng vào nghiệp vụ automation testing.

---

## Bài 6: Phân loại test case theo tốc độ chạy (Test Duration Classifier)

**Đề bài:** Viết hàm `phanLoaiTocDoChay(testCases, thresholds)` nhận vào mảng test case và ngưỡng thời gian, trả về:
- `fastTests`: các test có `duration <= thresholds.fast`
- `normalTests`: `thresholds.fast < duration <= thresholds.slow`
- `slowTests`: `duration > thresholds.slow`
- `summary`: đếm số lượng mỗi loại + tổng thời gian chạy toàn bộ suite (ms)

**Yêu cầu kỹ thuật:** dùng `map` để chuẩn hoá (trim id, lowercase module), dùng `filter` để phân loại 3 nhóm, dùng `reduce` để tính tổng duration.

```javascript
const testCases = [
    { id: " TC_001 ", module: "Login", duration: 450 },
    { id: "TC_002", module: "Search", duration: 1200 },
    { id: "TC_003", module: " Cart ", duration: 3500 },
    { id: "TC_004", module: "Payment", duration: 800 },
    { id: "TC_005", module: "User", duration: 150 },
    { id: "TC_006", module: "Report", duration: 5200 },
];

const thresholds = { fast: 500, slow: 3000 };
```

---

## Bài 7: Gom nhóm test case theo module (Group By Module)

**Đề bài:** Viết hàm `gomNhomTheoModule(testCases)` nhận mảng test case, trả về 1 object dạng `{ [module]: [danh sách id đã chuẩn hoá] }`, đồng thời tính thêm tỷ lệ pass của từng module (dựa trên field `status`).

**Yêu cầu kỹ thuật:** dùng `reduce` để gom nhóm (không dùng vòng lặp `for`), dùng destructuring để lấy field cần thiết trong callback.

```javascript
const testCases = [
    { id: "tc_001", module: "login", status: "pass" },
    { id: "tc_002", module: "login", status: "fail" },
    { id: "tc_003", module: "cart", status: "pass" },
    { id: "tc_004", module: "cart", status: "pass" },
    { id: "tc_005", module: "payment", status: "fail" },
    { id: "tc_006", module: "login", status: "pass" },
];
```

**Output mong muốn (ví dụ):**
```javascript
{
  login: { ids: ["TC_001", "TC_002", "TC_006"], passRate: 0.67 },
  cart: { ids: ["TC_003", "TC_004"], passRate: 1 },
  payment: { ids: ["TC_005"], passRate: 0 }
}
```

---

## Bài 8: Tìm test case đầu tiên gây block pipeline (Find First Blocker)

**Đề bài:** Trong CI/CD, một test được coi là "blocker" nếu: `priority === 1`, `status === 'fail'`, và KHÔNG nằm trong danh sách `knownIssues` (danh sách id đã biết lỗi, được phép bỏ qua tạm thời). Viết hàm `timBlockerDauTien(testCases, knownIssues)` trả về:
- `blocker`: test case đầu tiên thỏa điều kiện (dùng `find`), hoặc `null`
- `ignoredKnownIssues`: danh sách các test fail priority 1 nhưng nằm trong `knownIssues` (dùng `filter`)

**Yêu cầu kỹ thuật:** kết hợp `find` + `filter` + `Array.includes()`, xử lý object rỗng an toàn.

```javascript
const testCases = [
    { id: "TC_001", priority: 2, status: "fail" },
    { id: "TC_002", priority: 1, status: "pass" },
    { id: "TC_003", priority: 1, status: "fail" },
    { id: "TC_004", priority: 1, status: "fail" },
    { id: "TC_005", priority: 3, status: "fail" },
];

const knownIssues = ["TC_003"];
```

**Gợi ý kết quả:** `blocker` = `TC_004` (vì `TC_003` bị loại do nằm trong knownIssues), `ignoredKnownIssues` = `[TC_003]`.

---

## Bài 9: Đối chiếu kết quả 2 lần chạy để phát hiện Regression

**Đề bài:** Viết hàm `phatHienRegression(previousRun, currentRun)` so sánh 2 mảng kết quả test (chạy trước và chạy sau), mỗi phần tử có `{ id, status }`. Trả về:
- `regressions`: các test **trước đó pass, giờ fail**
- `fixed`: các test **trước đó fail, giờ pass**
- `stillFailing`: các test fail cả 2 lần
- `newTests`: test case xuất hiện ở `currentRun` nhưng không có ở `previousRun`

**Yêu cầu kỹ thuật:** dùng `find` để đối chiếu id giữa 2 mảng, dùng `filter` để lọc từng nhóm. Có thể làm 2 phiên bản: (1) thuần `find`/`filter` để đúng trọng tâm bài học, (2) nâng cao dùng `Map` để tối ưu hiệu năng tra cứu.

```javascript
const previousRun = [
    { id: "TC_001", status: "pass" },
    { id: "TC_002", status: "fail" },
    { id: "TC_003", status: "pass" },
    { id: "TC_004", status: "fail" },
];

const currentRun = [
    { id: "TC_001", status: "fail" },   // regression
    { id: "TC_002", status: "pass" },   // fixed
    { id: "TC_003", status: "pass" },   // ổn định
    { id: "TC_004", status: "fail" },   // vẫn fail
    { id: "TC_005", status: "fail" },   // test mới
];
```

---

## Bài 10: Tính điểm rủi ro (Risk Score) và xếp hạng module cần ưu tiên test

**Đề bài:** Mỗi module có nhiều test case. Viết hàm `xepHangRuiRoModule(testCases)` tính điểm rủi ro cho từng module theo công thức:

```
riskScore = (số lượng fail × 3) + (số lượng flaky × 2) + (số lượng slow × 1)
```

(trong đó `flaky` = status `'flaky'`, `slow` = `duration > 2000`), sau đó trả về mảng module đã **sắp xếp giảm dần theo riskScore**, kèm chi tiết từng chỉ số.

**Yêu cầu kỹ thuật:** dùng `reduce` để gom nhóm + tính toán, dùng `map` để tính riskScore cho từng module, dùng `sort` để xếp hạng (không sửa mảng gốc — dùng `[...array].sort()` hoặc `toSorted()`).

```javascript
const testCases = [
    { id: "TC_001", module: "login", status: "pass", duration: 500 },
    { id: "TC_002", module: "login", status: "fail", duration: 1800 },
    { id: "TC_003", module: "cart", status: "flaky", duration: 2500 },
    { id: "TC_004", module: "cart", status: "fail", duration: 3000 },
    { id: "TC_005", module: "payment", status: "pass", duration: 400 },
    { id: "TC_006", module: "payment", status: "flaky", duration: 2200 },
    { id: "TC_007", module: "cart", status: "pass", duration: 600 },
];
```

**Output mong muốn (ví dụ, sắp theo riskScore giảm dần):**
```javascript
[
  { module: "cart", fail: 1, flaky: 1, slow: 2, riskScore: 7 },
  { module: "login", fail: 1, flaky: 0, slow: 1, riskScore: 4 },
  { module: "payment", fail: 0, flaky: 1, slow: 1, riskScore: 3 },
]
```

---

## Tổng quan độ khó

| Bài | Chủ đề | Kỹ thuật chính | Độ khó |
|---|---|---|---|
| 6 | Phân loại theo ngưỡng | `map`, `filter`, `reduce` | ⭐⭐ |
| 7 | Gom nhóm theo key | `reduce`, destructuring | ⭐⭐⭐ |
| 8 | Tìm phần tử đầu tiên thỏa điều kiện loại trừ | `find`, `filter`, `includes` | ⭐⭐⭐ |
| 9 | Đối chiếu 2 tập dữ liệu | `find`, `filter` (hoặc `Map` để tối ưu) | ⭐⭐⭐⭐ |
| 10 | Tính điểm & xếp hạng | `reduce`, `map`, `sort` | ⭐⭐⭐⭐ |