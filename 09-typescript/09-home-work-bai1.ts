
// Bai 1
// Union type: sản phẩm chỉ thuộc 1 trong 3 loại
type LoaiSanPham = "ao" | "quan" | "phukien";

// interface mô tả hình dạng 1 sản phẩm
interface SanPham {
    ten: string;
    gia: number; // đơn vị: đồng
    tonKho: number; // số lượng còn trong kho
    loai: LoaiSanPham;
}

const khoSanPham: SanPham[] = [
    { ten: "Áo thun Neko", gia: 150000, tonKho: 12, loai: "ao" },
    { ten: "Quần Jean", gia: 350000, tonKho: 0, loai: "quan" },
    { ten: "Mũ lưỡi trai", gia: 80000, tonKho: 5, loai: "phukien" },
    { ten: "Áo khoác dù", gia: 500000, tonKho: 3, loai: "ao" },
];


function timSanPham(ten: string): SanPham | undefined {
    let cleanName: string = ten.trim().toLowerCase();
    const matched: SanPham | undefined = khoSanPham.find(item => item.ten.toLowerCase().includes(cleanName))
    // let result: SanPham | undefined = matched ? matched : undefined
    // return matched ? matched : undefined
    return matched // matched đã mang ý nghĩa nếu có thì trả về item, nếu k có thì trả về undefined
}

function phanLoaiGia(gia: number): string {
    if (gia >= 400000) return "Đắt"
    else if (gia >= 100000) return "Trung bình"
    else if (gia < 100000 && gia > 0) return "Rẻ"
    else return "Giá không hợp lệ"
}


function tinhTrangKho(sp: SanPham): string {
    let productName = sp.ten
    let product = timSanPham(productName)
    if (product === undefined) return "Không có sản phẩm này"
    let inventory = product?.tonKho
    return inventory > 0 ? `Còn ${inventory} sản phẩm` : `Hết hàng`
}


function tongGiaTriKho(): number {
    let total: number = 0;
    let instock: SanPham[] = [];
    for (let item of khoSanPham) {
        let result = tinhTrangKho(item)
        if (result.includes('Còn')) { instock.push(item) }
    }
    for (let item of instock) {
        total += item.gia * item.tonKho
    }
    return total

}

function inDanhSach(): void {
    khoSanPham.map(item => {

        let type: string = item.loai;
        if (type === 'ao') { type = 'Áo' }
        else if (type === 'quan') { type = "Quần" }
        else { type = "Phụ kiện" }

        console.log(`${item.ten} [${type}] - ${item.gia.toLocaleString('vi-VN')} - ${phanLoaiGia(item.gia)} - ${tinhTrangKho(item)}`)
    })

}

console.log(timSanPham("  áo THUN neko ")?.ten); // Áo thun Neko
console.log(timSanPham("không có")); // undefined

console.log(phanLoaiGia(80000)); // Rẻ
console.log(phanLoaiGia(150000)); // Trung bình
console.log(phanLoaiGia(500000)); // Đắt

inDanhSach();
// Áo thun Neko [Áo] - 150000d - Trung bình - Còn 12 sản phẩm
// Quần Jean [Quần] - 350000d - Trung bình - HẾT HÀNG
// Mũ lưỡi trai [Phụ kiện] - 80000d - Rẻ - Còn 5 sản phẩm
// Áo khoác dù [Áo] - 500000d - Đắt - Còn 3 sản phẩm

console.log("Tổng giá trị kho:", tongGiaTriKho()); // Tổng giá trị kho: 3340000