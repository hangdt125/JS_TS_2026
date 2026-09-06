class TestConfig {
    //B1.
    browser
    timeout
    constructor(browser = "Chromium", timeout = 5000) {
        this.browser = browser;
        this.timeout = timeout;
    }
}

// let config1 = new TestConfig();
// console.log(config1)
// let config2 = new TestConfig("firefox");
// console.log(config2)
// let config3 = new TestConfig("webkit", 10000);
// console.log(config3)

class HocVien3 {
    hoTen = "";

    constructor(ten) {
        //this = Object mới đang đc lệnh new tạo ra
        this.hoTen = ten;
        console.log(this);
    }
}

let hv3 = new HocVien3("Neko2");
console.log(hv3);

class LoginPage2 {
    url = "/login";

    moTrang() {
        //this = Object đang đứng trước dấu chấm
        console.log(`Mở trang ${this.url}`);
    }
}

let trang2 = new LoginPage2();

//trang2.moTrang();
console.log(trang2);

class User {

    constructor(name) {
        this.name = name;
    }

    sayHello() {
        console.log(`Hello ${this.name}`);
    }
}

const user = new User("Hanna");
console.log(user);

//BT
// Tạo 1 class tên là ProductPage cho trang sản phẩm
// với thuộc tính:
// txtTenSP = '#productName'
// txtGia = '#price'
// btnGioHang = '#btnCart'
// modalThongBao = '.notification'
// Method themSanPham(ten,gia) -> in ra gõ tên, gõ giá, click thêm giỏa hàng

// Method kiemTraThongBao(): in ra modal thông báo

// flowMethod thucHienThemVaKiemTra(ten, Gia): goi 2 hàm bên trên

class ProductPage {
    txtTenSP = '#productName'
    txtGia = '#price'
    btnGioHang = '#btnCart'
    modalThongBao = '.notification'

    themSanPham(ten, gia) {
        console.log(`Please enter product name ${this.txtTenSP}, price ${this.txtGia} then click ${this.btnGioHang} `)
    }

    kiemTraThongBao() {
        console.log(`This is a notification ${this.modalThongBao}`)
    }

    thucHienThemVaKiemTra(ten, gia) {
        this.themSanPham(ten, gia);
        this.kiemTraThongBao()
    }
}

//BT: Gom báo cáo tét bằng kế thừa
//Tạo class BaseSuite nhận tenSuite làm tham số
//BaseSuite có method inTieuDe() in ra tên suite
//BaseSuite óc method inKetQua(danhsachCase) dùng for ... of và destructoring để in từng tcs
//Tạo LoginSuite extends BaseSuite,
/// loginsuite extends inTieuDe() rồi in thêm "Trang kiểm thử /login"
//Data test
let loginCases = [
    { ten: "Đăng nhập đúng tài khoản", trangThai: "passed", thoiGian: 12000 },
    { ten: "Sai mật khẩu", trangThai: "failed", thoiGian: 5000 },
    { ten: "Email rỗng", trangThai: "passed", thoiGian: 8000 },
];

class BaseSuite {
    tenSuite = '';
    constructor(tenSuite) {
        this.tenSuite = tenSuite
    }

    inTieuDe() {
        console.log(`Suite name: ${this.tenSuite}`)
    }

    inKetQua(danhsachCase) {

        let list = danhsachCase.map((item) => {
            const { ten, trangThai, thoiGian } = item
            console.log(`Suite name: ${ten}`)
            console.log(`State: ${trangThai}`)
            console.log(`Duration: ${thoiGian}`)
            return item;
        })
        return list
    }
}
class LoginSuite extends BaseSuite {
    url = '/login';
    tenSuite = '';

    constructor(tenSuite) {
        super(tenSuite)
    }

    inTieuDe() {
        super.inTieuDe();
        console.log(`Page: ${this.url}`)
    }
}

for (item of loginCases) {
    tenSuite = item.ten;
    const loginSuite = new LoginSuite(tenSuite);
    loginSuite.inTieuDe();
}


