// // Bài toán
// // Viết hàm taoBaoCaoTest(testRuns) để tạo báo cáo từ danh sách kết quả test.

// // Yêu cầu
// // - Dùng destructuring để bóc tách từng phần tử trong mảng.
// // - Gợi ý:
// //   const [rawTestName, { browser, env }, rawStatus] = item
// // - Tương ứng:
// //   + rawTestName: tên test thô
// //   + { browser, env }: thông tin môi trường chạy
// //   + rawStatus: trạng thái test thô

// // Rule xử lý
// // - Nếu testName rỗng thì tăng invalid và bỏ qua dòng đó.
// // - Nếu status không phải PASS hoặc FAIL thì tăng invalid và bỏ qua.
// // - Nếu dữ liệu hợp lệ:
// //   + Tạo chuỗi theo định dạng: testName - browser - env
// //   + Ví dụ: login smoke - chromium - staging
// //   + Nếu PASS thì đưa vào mảng passed.
// //   + Nếu FAIL thì đưa vào mảng failed.

// // Kết quả mong đợi
// // Hàm cần trả về dữ liệu theo dạng:
// // return {
// //   totalValid:3 ,
// //   invalid: 1,
// //   passed: [
// //     "login smoke - chromium - staging",
// //     "search product - webkit - staging"
// //   ],
// //   failed: [
// //     "checkout payment - firefox - prod"
// //   ]
// // }

const testRuns = [
    [
        " login smoke ",
        { browser: "   chromium   ", env: "  staging  " },
        "  PASS ",
    ],
    [
        " checkout payment ",
        { browser: "   firefox   ", env: "  prod  " },
        "  FAIL ",
    ],
    [
        " search product ",
        { browser: "   webkit   ", env: "  staging  " },
        "  PASS ",
    ],
    ["  ", { browser: "   chromium   ", env: "  dev  " }, "  PASS "],
];


function taoBaoCaoTest(testRuns) {
    let invalid = 0;
    const passed = []; //mang nên được khai báo là const vì chỉ khi cần gán lại toàn bộ biến này thì mới không gán đc còn hoàn toàn có thể thêm phần tử vào mảng với khai báo const.
    const failed = [];

    for (item of testRuns) {
        [rawTestName, { browser, env }, rawStatus] = item;
        rawTestName = rawTestName.trim();
        browser = browser.trim();
        env = env.trim();
        rawStatus = rawStatus.trim();

        if (!rawTestName) {
            invalid++;
            continue;
        }
        if (rawStatus !== 'PASS' && rawStatus !== "FAIL") {
            invalid++;
            continue;
        }

        const str = `${rawTestName} - ${browser} - ${env}`;
        if (rawStatus === 'PASS') {
            passed.push(str);

        } else {
            failed.push(str)
        }

    }
    return {
        totalValid: testRuns.length - invalid,
        invalid: invalid,
        passed: passed,
        failed: failed

    }
}

console.log(taoBaoCaoTest(testRuns));


// Bài toán
// Cho dữ liệu đầu vào như sau:

// Cấu hình mặc định của bài tập
const configMacDinhBaiTap = {
    baseUrl: "https://staging.neko.vn", // Địa chỉ mặc định đang trỏ tới môi trường staging
    timeout: 30000, // Thời gian chờ tối đa là 30 giây
    headless: true, // Chạy trình duyệt ở chế độ không hiển thị giao diện
    retries: 2, // Số lần thử lại khi có lỗi
};

// Cấu hình dùng để ghi đè một số giá trị mặc định
const configGhiDe = {
    timeout: 10000,
    headless: false,
};

// Danh sách tag mặc định
const tagsMacDinh = [" smoke  ", "  login "];

// Danh sách tag cần thêm
const tagsThem = ["  checkout  ", "  smoke  ", "  regression ", " "];

// Mảng thời gian phản hồi
const tocDoPhanHoi = [1200, 3400, 800, 1500];

// Tên suite thô, chưa được làm sạch
const tenSuiteRaw = "  Payment  Flow  ";

// Yêu cầu
// Viết hàm taoCauHinhChayTest().
// - Dùng object spread để tạo configCuoi từ configMacDinhBaiTap và configGhiDe.
// - Dùng array spread để gộp tagsMacDinh và tagsThem thành một mảng mới.
// - Sau đó xử lý mảng mới bằng cách loại bỏ tag rỗng và chuyển về chữ thường, và có thể xử lý tag trùng (dùng includes)
// - Làm sạch tenSuiteRaw.
// - Nếu tenSuiteRaw rỗng thì dùng giá trị mặc định là "unknown-suite".
// - Tìm thời gian phản hồi lớn nhất bằng spread với Math.max.
// - Trả về object có dạng sau:

// Kết quả mong đợi
// {
//   suiteName: "Payment Flow",
//   config: {
//     baseUrl: "https://staging.neko.vn", // Địa chỉ mặc định đang trỏ tới môi trường staging
//     timeout: 10000, // Thời gian chờ tối đa là 30 giây
//     headless: false, // Chạy trình duyệt ở chế độ không hiển thị giao diện
//     retries: 2,
//   },
//   tags: ["smoke", "login", "checkout", "regression"],
//   slowestRespone: 3400
// }

function taoCauHinhChayTest() {
    const configCuoi = {
        ...configMacDinhBaiTap, ...configGhiDe
    }
    const mangMoi = [...tagsMacDinh, ...tagsThem];
    const unique = []
    for (item of mangMoi) {
        let cleanItem = item.trim().toLowerCase();
        if (!cleanItem) { continue; }
        if (!unique.includes(cleanItem)) {
            unique.push(cleanItem);
        }

    }
    let tenSuite = tenSuiteRaw.trim();
    if (!tenSuite) { tenSuite = 'unknown-suite' };
    const max = Math.max(...tocDoPhanHoi);
    return {
        suiteName: tenSuite,
        config: configCuoi,
        tags: unique,
        slowestRespone: max
    }
}

console.log(taoCauHinhChayTest());

const sanPhamUI = [
    { ten: "Chuột", gia: 150000, tonKho: true },
    { ten: "Bàn phím", gia: 500000, tonKho: false },
    { ten: "Màn hình", gia: 3000000, tonKho: true },
    { ten: "Tai nghe", gia: 200000, tonKho: true },
];

//Lọc các sản phẩm còn hàng dùng for
// const conHang = [];
// for (item of sanPhamUI) {
//     if (item.tonKho === true) {
//         conHang.push(item);
//     }
// }
// console.log(conHang);

//Lọc các sản phẩm còn hàng dùng filter
// const conHangFiler = sanPhamUI.filter((item) => {

//         return item.tonKho === true
    
// })

//Cách viết rút gọn - Khi chỉ có 1 paramater -> bỏ dấu () ở paramter. Khi chỉ có 1 dòng execute để thực thi function -> bỏ return và {}
// const conHangFiler = sanPhamUI.filter(item => item.tonKho === true);
// console.log(conHangFiler)

///Lọc giá nhỏ hơn 200000
// const gia = sanPhamUI.filter(item => item.gia < 200000);
// console.log(gia);

// Lọc giá nhỏ hơn 200000 và còn hàng
const sanPham = sanPhamUI.filter(item => item.gia > 200000 && item.tonKho === true);
console.log(sanPham);

const usersTest = [
  { id: 1, ten: "neko", role: "admin" },
  { id: 2, ten: "mew", role: "tester" },
  { id: 3, ten: "Cat", role: "tester" },
];

//Tìm phần tử có role là admin
const admins = usersTest.find(user => user.role === 'admin');
console.log(admins);

//Tìm phần tử có role là tester
const testers = usersTest.find(user => user.role === 'tester');
console.log(testers);

let mau = "Đỏ"; //global

function ngoai() {
  //function scope của ngoai() - hàm cha
  let size = "Lớn";

  function trong() {
    //fc scope của hàm con

    //trong() tìm biến theo scope chain
    let gia = 1000;
    //tìm thấy ngay tại chỗ vì gia là của fc trong()
    console.log(gia);
    //ko có ở đây -> leo ra ngoài tìm -> lớn
    console.log(size);
    //ko có ở đây -> lèo ra ngoài() -> global()
    console.log(mau);
  }
  trong();
  //lỗi vì sao thằng cha ko nhìn đc thằng con
}
ngoai();