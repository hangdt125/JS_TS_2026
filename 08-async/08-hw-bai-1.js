const KHO_HANG = {
    "Áo Thun": { gia: 150000, tonKho: 10 },
    "Quần Jean": { gia: 350000, tonKho: 5 },
    "Giày Sneaker": { gia: 800000, tonKho: 3 },
    "Mũ": { gia: 90000, tonKho: 0 },
};

// ----- ĐƠN HÀNG khách nhập dạng CHUỖI: "tên sản phẩm xSỐLƯỢNG" -----
// Lưu ý: chữ hoa/thường lộn xộn và có khoảng trắng thừa -> phải xử lý chuỗi.
const donHang1 = ["  áo thun x2 ", "Quần Jean x1", "MŨ x1"]; // hợp lệ, "Mũ" hết hàng
const donHang2 = ["Áo thun x1", "Điện thoại x1"]; // có sản phẩm không tồn tại
const donHang3 = ["Áo thun x8", "Giày Sneaker x4"]
const donHang4 = ["  áo thun x12 ", "Quần Jean x10", "MŨ x1"]
// Hàm cắt khoảng trắng thừa, viết hoa chữ cái đầu mỗi từ 
function chuanHoaTen(ten) {
    const strArr = ten.trim().toLowerCase().split(" ");
    const capitalize = strArr.map(word => {
        let first = word[0].toUpperCase();
        let rest = word.substring(1);
        return first + rest
    })
    let finalStr = capitalize.join(" ")
    return finalStr
}

function phanTichDon(order) {

    const str = chuanHoaTen(order)
    let itemName = str.substring(0, str.indexOf('X')).trim();
    let soLuong = Number(str.substring(str.indexOf('X') + 1));
    let orderObj = { itemName, soLuong }
    return orderObj
}

// ----- Hàm giả lập gọi API lấy giá + tồn kho 1 sản phẩm -----
function layThongTinSanPham(ten) {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const tt = KHO_HANG[ten];
            if (!tt) {
                reject(`Sản phẩm "${ten}" không tồn tại trong hệ thống!`);
            } else {
                resolve({ ten, ...tt });
            }
        }, 800);
    });
}
async function tinhTienGioHang(orders) {

    console.log("Phân tích đơn hàng...")
    const analyzed = orders.map(order => phanTichDon(order))

    console.log("Tải thông tin sản phẩm...")
    let existed = await Promise.all(analyzed.map(item => layThongTinSanPham(item.itemName)))

    let qty = analyzed.map(item => item.soLuong)

    let summarized = existed.map((item, index) => ({
        ...item,
        soLuong: qty[index]
    }))


    let outstock = summarized.filter(item => item.tonKho < item.soLuong)
    let instock = summarized.filter(item => item.tonKho >= item.soLuong)
    if (outstock.length !== 0) {
        for (let item of outstock) { console.log(`Bỏ ${item.ten} - Còn ${item.tonKho}, cần ${item.soLuong}`) }
        console.log("Bỏ qua các sản phẩm không còn đủ hàng...")
    }

    if (instock.length === 0) { throw Error ("Không còn sản phẩm nào còn hàng") }

    let estimated = instock.map(item => ({
        ...item,
        thanhTien: item.gia * item.soLuong

    }))

    

    for (let item of estimated) {
        console.log(`${item.ten} X${item.soLuong} = ${item.thanhTien.toLocaleString("vi-VN")}`)
    }

    let total = 0;
    for (let item of estimated) {
        total += item.thanhTien
    }

    console.log(`Tạm tính: ${total.toLocaleString("vi-VN")}`)

    let discount = 0;
    let condition = 0;
    if (total >= 1000000) {
        discount = 15;
        condition = 1000000
    }
    else if (total >= 500000) { discount = 10, condition = 500000 }
    else if (total >= 200000) { discount = 5, condition = 200000 }
    else { discount = 0, condition = 200000 }

    let discountAmount = total * discount / 100

    console.log(
        discount > 0
            ? `Ưu đãi: giảm ${discount}% (đơn từ ${condition.toLocaleString("vi-VN")}đ): ${discountAmount.toLocaleString("vi-VN")}đ`
            : `Bạn không được giảm giá cho đơn hàng dưới ${condition.toLocaleString("vi-VN")}đ`
    );

    let finalPrice = total - discountAmount
    console.log(`Thành tiền: ${finalPrice.toLocaleString("vi-VN")}`)
}

try {
    console.log("Bắt đầu tính tiền giỏ hàng...")
    await tinhTienGioHang(donHang1) // Lưu ý phải có await cho hàm async, nếu k có await thì finally có thể chạy trc
    console.log('-----')
    await tinhTienGioHang(donHang3)
    console.log('-----')
    await tinhTienGioHang(donHang4)
    console.log('-----')
    await tinhTienGioHang(donHang2)
}
catch (error) {
    console.log("Đã có lỗi xảy ra, không thể tính tiền giỏ hàng")
    console.log("Lỗi: ", error)
}

finally {
    console.log("Kết thúc tính tiền")
}
