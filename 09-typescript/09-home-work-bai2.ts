// Bai 2

// Union type: học viên chỉ thuộc 1 trong 4 mức xếp loại
type XepLoai = "Gioi" | "Kha" | "TrungBinh" | "Yeu";

// interface mô tả 1 học viên
interface HocVien {
    readonly id: number; // không cho phép sửa sau khi tạo
    hoTen: string;
    diem: number[]; // điểm các môn
    email?: string; // optional: có thể không có
}

const danhSach: HocVien[] = [
    { id: 1, hoTen: "  nguyễn văn an ", diem: [8, 9, 7], email: "an@neko.vn" },
    { id: 2, hoTen: "Trần thị Bình", diem: [5, 6, 6] },
    { id: 3, hoTen: "LÊ VĂN CƯỜNG", diem: [3, 4, 5], email: "cuong@neko.vn" },
    { id: 4, hoTen: "Phạm Thị Dung", diem: [10, 9, 10] },
];


function chuanHoaTen(ten: string): string {
    let input: string[] = ten.trim().toLowerCase().split(" ")
    let normalizedName: string = input.filter(element => element !== '').map(word => word = word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    return normalizedName
}

function diemTrungBinh(hv: HocVien): number {
    let diem: number[] = hv.diem
    let total: number = 0;
    for (let item of diem) {
        total += item
    }
    let avg = (Number((total / diem.length).toFixed(1)));
    return avg
}

function xepLoai(diemTB: number): XepLoai {
    //Dùng `if/else`: `>= 8.5` là `"Gioi"`; `>= 6.5` là `"Kha"`; `>= 5` là `"TrungBinh"`; còn lại `"Yeu"`.
    let rank: XepLoai;
    if (diemTB >= 8.5 && diemTB <= 10) { return rank = 'Gioi' }
    else if (diemTB >= 6.5) { return rank = 'Kha' }
    else if (diemTB >= 5) { return rank = 'TrungBinh' }
    else { return rank = 'Yeu' }

}

function timTheoEmail(email: string): HocVien | undefined {
    const matched = danhSach.find(hv =>
        hv.email?.toLowerCase() === email.trim().toLowerCase()
    )
    return matched
}

function inBangDiem(): void {

    danhSach.map(hv => {
        let avg: number = diemTrungBinh(hv)
        let rank: string = xepLoai(avg)
        if (rank === 'Gioi') { rank = "Giỏi" }
        else if (rank === 'Kha') { rank = "Khá" }
        else if (rank === 'TrungBinh') { rank = "Trung Bình" }
        else { rank = 'Yếu' }

        console.log(`${chuanHoaTen(hv.hoTen)} - TB: ${avg} - ${rank}`)
    })

}

console.log(chuanHoaTen("  nguyễn văn an ")); // Nguyễn Văn An
console.log(chuanHoaTen("LÊ VĂN CƯỜNG")); // Lê Văn Cường

console.log(diemTrungBinh(danhSach[1])); // 5.7

console.log(xepLoai(8)); // Kha
console.log(xepLoai(4)); // Yeu

console.log(timTheoEmail("  AN@neko.vn ")?.id); // 1
console.log(timTheoEmail("khong@co.vn")); // undefined

inBangDiem();
// Nguyễn Văn An - TB: 8 - Khá
// Trần Thị Bình - TB: 5.7 - Trung bình
// Lê Văn Cường - TB: 4 - Yếu
// Phạm Thị Dung - TB: 9.7 - Giỏi