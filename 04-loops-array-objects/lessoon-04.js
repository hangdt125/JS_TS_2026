//Bai tap tren lop:
//Đầu vào có mật khẩu đúng và số lần nhập mật khẩu tối đa là 3 lần. Nếu nhập đúng thì thông báo đăng nhập thành công, nếu sai thì thông báo sai mật khẩu, nếu nhập sai quá 3 lần thì thông báo tài khoản bị khoá.

let currentTime = 1;
let correctPass = '123456';
let matKhau;
let isLoginSucess = false;

while (currentTime <= 3 && isLoginSucess === false) {

    if (currentTime === 1) {
        matKhau = '123455';
    } else if (currentTime === 2) {
        matKhau = '123433';
    } else {
        matKhau = '123459';
    }

    if (matKhau === correctPass) {
        console.log('Đăng nhập thành công');
        isLoginSucess = true;
    }
    else {
        console.log('Sai mật khẩu, vui lòng thử lại');
        currentTime++;
    }
}

if (isLoginSucess === false) {
    console.log('Tài khoản của bạn bị khoá');
}

// Tạo mã đơn hàng tự động sử dụng vòng lặp for
let soLuongDon = 5;
for (let i = 0; i < soLuongDon; i++) {
    console.log(`ORDER-${i + 1}`);
}

// Dung for .. of hiển thị danh sách url
let danhSachUrl = ["/login", "/dashboard", "/profile"];
for (let url of danhSachUrl) {
    console.log(`Đang kiểm tra: ${url}`)
}

// Dùng for ..of và for ..in để in danh sách sản phẩm

let products = [
    { ten: "iphone", "gia": 200000 },
    { ten: "airpod", "gia": 300000 },
    { ten: "macbook", "gia": 400000 }

]

for (let product of products) {
    for (let key in product) {
        console.log(`${key}: ${product[key]}`);


    }
    console.log('---')
}


let inventories = [
    { ten: "iphone", "conHang": true },
    { ten: "airpod", "conHang": false },
    { ten: "macbook", "conHang": false }

]

// Tìm sản phẩm hết hàng đầu tiên
console.log(`Sản phẩm hết hàng đầu tiên: `);
for (let product of inventories) {

    if (!product.conHang) {
        console.log(`${product.ten}`);
        break;

    }
}
//Tìm các sản phẩm còn hàng, sử dụng continue
console.log('Sản phẩm còn hàng: ');
for (let product of inventories) {

    if (!product.conHang) {
        //console.log(`${product.ten}`);
        continue;

    }
    console.log(product.ten);
}

// In ra các giá trị của một object trong đó không chứa các thông tin nhạy cảm được định nghĩa ở mảng hiddenInfo
let userInfo = {
    username: "Neko",
    email: "neko@gmail.com",
    password: "123456",
    role: "admin"
}

let hiddenInfo = ["password"];

for (key in userInfo) {
    if (hiddenInfo.includes(key)) {
        continue;
    }

    console.log(`${key} - ${userInfo[key]}`) //Idea là check mảng hiddenInfo - nơi định nghĩa các thông tin nhạy cảm - xem có chứa keyword nào nằm trong danh sách các key trong object userInfo hay không, nếu có thì bỏ qua key đó (thông qua keyword: continue), nếu không có thì in thông tin key - value đó ra.
}

// Tạo mảng mới, push các giá trị > 100000 vào mảng mới từ mảng cho sẵn
let prices = [100000, 200000, 50000, 30000, 150000, 10000];
let vipProducts = [];
for (let price of prices) {
    if (price >= 100000) {
        vipProducts.push(price);
    }
}

console.log(vipProducts.length);

for (let product of vipProducts) {
    console.log(product)
}

// Homework: Bài 1

let apiResponse = {
    userId: 101,
    username: "neko_tester",
    email: null,
    isActive: "true",
    phone: "",
    role: "admin"
};

let count = 0;

for (key in apiResponse) {
    if (!apiResponse[key]) {
        console.log(`Field ${key} should not empty`);
        count++;
    }
}
if (typeof (apiResponse.isActive) !== 'boolean') {
    console.log(`Type of field isActive should be boolean`);
    count++;
}

if (count === 0) { console.log('There is no error in the response') } else { console.log(`There are ${count} error in the response`) }

//Homeword: Bài 2

let testUrls = [
    { url: "/api/users", status: 200 },
    { url: "", status: null },
    { url: "/api/products", status: 200 },
    { url: "/api/orders", status: 500 },
    { url: "/api/reviews", status: 200 }
];

let testedUrl = 0;

for (link of testUrls) {
    if (link.status === 500) {
        console.log('Server error!!!!STOP TESTING');
        break;
    } else if (!link.url) {
        console.log('Empty url');
        continue;
    } else {
        console.log('PASS');
        testedUrl++;

    }
}