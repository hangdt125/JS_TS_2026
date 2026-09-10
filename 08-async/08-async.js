//Bt
// viết 1 hàm kiemTraMatKhau(matKhau) trả về 1 promise
// giả lập server kiểm tra mât 1.5sec (setTimeout)
// neu matKhau là Neko@123 -> resolve với message: Đăng nhập thằng công, chào admin
// nếu matKhau sai -> reject với message "sai mâht khẩu"\
// gọi hàm với mj đúng và sai để kiểm tra logic

function kiemtraMatKhau(matKhau) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (matKhau === "Neko@123")
                resolve("Login successfully. Hello admin")
            else reject("Wrong password")
        }, 1500)
    })

}

kiemtraMatKhau("Neko@123").then(data => console.log(data)).catch(error => console.log(error))

kiemtraMatKhau("Neko123").then(data => console.log(data)).catch(error => console.log(error))

//fetch() gọi api - promise có sẵn dùng rât nhiều

//fetch() là 1 vi sduj hàm gọi xong là nhận đc primise -> ta cko cần định nghĩa new promise(_)

fetch("https://api-neko-coffee.autoneko.com/public/test/echo?any_param=")
    .then((response) => response.json())
    .then((data) => {
        console.log("data", data);

        console.log("message", data.message);
        console.log("message", data.timestamp);
    })
    .catch((loi) => console.log(loi));


function goiEchoApi() {
    return fetch(
        "https://api-neko-coffee.autoneko.com/public/test/echo?any_param=",
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error("HTTP ERROR" + response.status);
            }
            return response.json();
        })
        .then((data) => {
            if (!data.message || !data.timestamp) {
                throw new Error("Api tra ve sai rule thieu truogn");
            }
            return data;
        })

}

goiEchoApi()
    .then((data) => console.log("echo api tra ve", data.message))
    .catch((loi) => console.log(loi));



function moTrangWeb(url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (url === "nhapsai.com") {
                reject("loi 404: ko tim thay trang");
            } else {
                resolve("Trang + " + url + "Đã tải xong");
            }
        }, 1000);
    });
}

// Đăgg nhập:  cần kết quả từ b1 (mât 1s)
function dangNhap(trangWeb, user, pass) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (pass === "saimatkhau") {
                reject("Sai mat khau");
            } else {
                resolve(" Token " + user.toUpperCase() + "_" + Date.now());
            }
        }, 1000);
    });
}

//function themVao Gio Han

function themVaoGioHang(token, sanPham) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ token: token, sanPham: sanPham, soLuong: 2 });
        }, 1000);
    });
}

function thanhToan(gioHang) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hóa đơn " + gioHang.sanPham + gioHang.soLuong);
        }, 1000);
    });
}

async function muaHang(url) {
    const web = await moTrangWeb(url)
    const login = await dangNhap(web, "Neko", "Neko@123")
    const cart = await themVaoGioHang(login, "Iphone 17")
    const order = await thanhToan(cart)
    console.log(order)
    return order

}

console.log(muaHang("neko.com"));



function xoaTestAccount(tenAccount, thoiGian, xoaDuoc) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (xoaDuoc) {
                resolve(`Đã xóa ${tenAccount}`);
            } else {
                reject(`Không xóa được tên account ${tenAccount}`);
            }
        }, thoiGian);
    });
}

async function donDepTaiKhoan() {
    let ketQua = await Promise.allSettled([
        xoaTestAccount("user_01", 1200, true),
        xoaTestAccount("user_02", 900, false),
        xoaTestAccount("user_03", 1500, true),
    ]);
    // [
    //   { status: "fulfilled", value: "Đã xóa user_01" },
    //   { status: "rejected", reason: "Không xóa được tên account user_02" },
    //   { status: "fulfilled", value: "Đã xóa user_03" },
    // ];
    console.log(ketQua);

    //nhận được 1 cái mảng có format là ['user_01: PASS', 'user_02: FAIL',]
    let baoCao = ketQua.map((item, index) => {
        let username = ['user_01', 'user_02', 'user_03'][index]
        let status = item.status === 'fulfilled' ? 'PASS' : 'FAIL'
        return `${username}: ${status}`
    })
    console.log(baoCao)
}

donDepTaiKhoan();
