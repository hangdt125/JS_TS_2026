"Bài 1
Tình huống: Bạn viết script test tự động kiểm tra API /users/1. Server trả về response, bạn cần kiểm tra toàn bộ dữ liệu: tìm field rỗng, kiểm tra kiểu dữ liệu sai.

Dữ liệu đầu vào:

let apiResponse = {
    userId: 101,
    username: ""neko_tester"",
    email: null,
    isActive: ""true"",  // Bug: phải là boolean, không phải string
    phone: """",
    role: ""admin""
};

Yêu cầu:

Với mỗi key, kiểm tra:
Giá trị có phải null hoặc """" (chuỗi rỗng) không? → In cảnh báo trường rỗng.
Nếu key là ""isActive"", kiểm tra typeof có phải ""boolean"" không? → In cảnh báo sai kiểu.
Đếm tổng số lỗi tìm được.
Trong bài này, 1 lỗi = 1 lần vi phạm 1 quy tắc kiểm tra."

"
Bài 2
Tình huống: Bạn có danh sách URL cần test. Một số URL bị rỗng (bỏ qua), một số trả về status bình thường, nhưng nếu gặp URL trả về lỗi 500 thì dừng ngay vì server đã sập, test tiếp vô nghĩa.

Dữ liệu đầu vào:

let testUrls = [
    { url: ""/api/users"", status: 200 },
    { url: """", status: null },
    { url: ""/api/products"", status: 200 },
    { url: ""/api/orders"", status: 500 },
    { url: ""/api/reviews"", status: 200 }
];
Yêu cầu:

Nếu url rỗng ("""") → dùng continue bỏ qua, in cảnh báo “URL rỗng”.
Nếu status === 500 → in lỗi nghiêm trọng, dùng break dừng ngay.
Nếu bình thường → in kết quả PASS.
Đếm tổng URL đã test được (không tính URL bị bỏ qua)."