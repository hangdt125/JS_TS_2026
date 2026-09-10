// ----- DANH SÁCH CHI NHÁNH cần lấy báo cáo -----
// thanhCong = false để giả lập chi nhánh mất kết nối.
const CHI_NHANH = [
    { ten: "Hà Nội", doanhThu: 120000000, thoiGian: 1500, thanhCong: true },
    { ten: "Đà Nẵng", doanhThu: 0, thoiGian: 2000, thanhCong: false },
    { ten: "TP.HCM", doanhThu: 250000000, thoiGian: 2500, thanhCong: true },
];

// ----- Hàm giả lập tải doanh thu 1 chi nhánh -----
function taiDoanhThuChiNhanh(ten, doanhThu, thoiGian, thanhCong = true) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (thanhCong) {
                resolve({ chiNhanh: ten, doanhThu });
            } else {
                reject(`Chi nhánh ${ten} mất kết nối!`);
            }
        }, thoiGian);
    });
}

function xepLoai(doanhThu) {
    let rank = ""
    if (doanhThu >= 200000000) { rank = "Xuất sắc" }
    else if (doanhThu >= 100000000) { rank = "Đạt chỉ tiêu" }
    else if (doanhThu >= 0) { rank = "Cần cải thiện" }
    else { rank = "Không có doanh thu" }
    return rank;
}

async function tongHopBaoCao() {
    let result = await Promise.allSettled(CHI_NHANH.map(item => taiDoanhThuChiNhanh(item.ten, item.doanhThu, item.thoiGian, item.thanhCong)))
    let success = result.filter(item => item.status === 'fulfilled').map(item => item.value)
    let failed = result.filter(item => item.status === 'rejected').map(item => item.reason)

    if (failed.length !== 0) { failed.map(item => console.log(`[LỖI]: ${item}`)) }

    if (success.length === 0) { throw Error("Mất kết nối với tất cả các chi nhánh") }

    let revenue = success.map(item => ({ ...item, xepLoai: xepLoai(item.doanhThu) }))

    for (let item of revenue) {
        console.log(`${item.chiNhanh}: ${item.doanhThu.toLocaleString("vi-VN")}đ - ${item.xepLoai}`)
    }

    let total = 0;
    let maxItem = revenue[0]
    for (let item of revenue) {
        total += item.doanhThu
        if (item.doanhThu > maxItem.doanhThu) { maxItem = item }
    }
    console.log(`Tổng doanh thu: ${total.toLocaleString("vi-VN")}đ`)
    console.log(`Chi nhánh dẫn đầu: ${maxItem.chiNhanh} (${maxItem.doanhThu.toLocaleString("vi-VN")}đ)`)

    const rank = revenue.map(item => (`${item.chiNhanh} (${item.xepLoai})`)).join(", ");
    console.log(`Xếp loại: ${rank}`)

    let countChiNhanh = CHI_NHANH.length;
    let countSuccess = success.length;

    if (countSuccess === countChiNhanh) { console.log('Tất cả các chi nhánh đều kết nối thành công') }
    else if (countSuccess < countChiNhanh && countSuccess) { console.log(`${countSuccess}/${countChiNhanh} chi nhánh thành công, ${countChiNhanh - countSuccess} gặp sự cố`) }
    //countSuccess ===0 đã validate bên trên
}


try {
    console.log("Đang tổng hợp báo cáo từ các chi nhánh...")
    await tongHopBaoCao();

}
catch (error) {
    console.log("Đã có lỗi xảy ra. Không thể tổng hợp báo cáo")
}
finally {
    console.log("Hoàn tất tổng hợp báo cáo.")
}