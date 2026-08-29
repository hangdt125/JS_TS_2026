Tình huống: Bạn đang viết một bản kiểm tra trước khi release. Hệ thống trả về dữ liệu thô từ UI và config. Bạn cần xử lý thành báo cáo rõ ràng.

Dữ liệu đầu vào:

let rawProjectName = "   Neko CRM   ";
let rawEnvName = "   ";
let rawPassRate = "82";
let rawHasReport = "true";
let rawCriticalMessage = "   ";
let browserUsed = "chrome"; // "chrome", "firefox", "safari", "edge"


Yêu cầu:
Dùng .trim() để làm sạch rawProjectName và rawEnvName.
Nếu rawEnvName sau khi trim() là rỗng -> gán environment = "Development". Nếu không rỗng -> dùng chính giá trị đã làm sạch.
Ép rawPassRate sang Number.
Ép rawHasReport sang Boolean đúng cách.

Tạo hasCriticalBug theo quy tắc:
nếu message là null hoặc undefined -> false
nếu sau trim() là rỗng -> false
ngược lại -> true
Dùng if / else if để xếp hạng:
>= 95 -> "EXCELLENT"
>= 80 -> "GOOD"
>= 60 -> "NEEDS IMPROVEMENT"
còn lại -> "CRITICAL"

Dùng switch/case để gán tên engine cho browserUsed:
chrome -> "Chromium"
edge -> "Chromium"
firefox -> "Gecko"
safari -> "WebKit"
Nếu không khớp -> "Unknown"

Dùng toán tử 3 ngôi để tạo message cho report:
nếu hasReport là true -> "Có report"
ngược lại -> "Chưa có report"

Tạo isReadyToRelease theo quy tắc:
nếu pass rate dưới 80 -> false
nếu có critical bug -> false
nếu chưa có report -> false
còn lại -> true
In báo cáo ra console.

Expected output
Project:         Neko CRM
Environment:     Development
Browser:         chrome
Engine:          Chromium

Pass Rate:       82.00%
Grade:           GOOD
Report:          Có report
Critical Bug:    Không có bug nghiêm trọng

Ready:           YES
