interface IBook {
  title: string;
  author: string;
  year: number;
  genre: string;
  available: boolean;
}

export {};

type BookFilter = {
  title?: string;
  genre?: string;
  yearFrom?: number;
};


class Library {
  private books: IBook[] = []

  addBook(book: IBook): void {
    let cleanTitle: string = book.title.trim()
    let cleanAuthor: string = book.author.trim()
    let cleanGenre: string = book.genre.trim()
    let year: number = book.year
    let available: boolean = book.available

    for (let item of this.books) {
      if (item.author.toLowerCase() === cleanAuthor.toLowerCase() && item.title.toLowerCase() === cleanTitle.toLowerCase())
        throw Error('Sách đã có trong thư viện')
    }

    const cleanBook: IBook = { title: cleanTitle, author: cleanAuthor, genre: cleanGenre, available: available, year: year }
    this.books.push(cleanBook)
  }

  getAllBooks(): IBook[] {
    const books: IBook[] = [...this.books];
    return books
  }

  findByTitle(keyword: string): IBook[] {
    const matched = this.books.filter(book => book.title.toLowerCase().includes(keyword.trim().toLowerCase()))
    return matched
  }

  filter(filter: BookFilter): IBook[] {

    const filterList = this.books.filter(book => {
      if (filter.title !== undefined && !book.title.toLowerCase().includes(filter.title.trim().toLowerCase())) { return false }
      if (filter.genre !== undefined && filter.genre.trim().toLowerCase() !== book.genre.toLowerCase()) { return false }
      
      if (filter.yearFrom !== undefined && book.year <= filter.yearFrom) { return false }
      return true
    })

    return filterList
  }

  getAvailableBooks(): IBook[] {
    const available = this.books.filter(book => book.available === true)
    if (available.length === 0) console.log('Không có cuốn sách nào đang available')
    return available
  }

  getStats() {
    const genres: string[] = []

    for (let item of this.books) {
      if (!genres.includes(item.genre)) genres.push(item.genre)
    }
    const total = this.books.length;
    const available = this.getAvailableBooks().length;
    const borrowed = total - available
    return {
      total, available, borrowed, genres
    }
  }

  borrowBook(title: string): boolean {
    const matched = this.findByTitle(title)
    if (matched.length === 0) { throw Error('Không có cuốn sách bạn tìm kiếm') }

    const available = matched.find(item => item.available === true)

    if (!available) { throw Error('Không có cuốn sách nào available để mượn') }
    available.available = false
    return true
  }

  returnBook(title: string): boolean {
    const matched = this.findByTitle(title)
    if (matched.length === 0) { throw Error('Không có cuốn sách bạn tìm kiếm') }

    const available = matched.find(item => item.available === false)

    if (!available) { throw Error('Không có cuốn sách nào đã được mượn') }
    available.available = true
    return true

  }
}


const lib = new Library();

lib.addBook({
  title: "Clean Code",
  author: "Robert Martin",
  year: 2008,
  genre: "Programming",
  available: true,
});
lib.addBook({
  title: "Design Patterns",
  author: "GoF",
  year: 1994,
  genre: "Programming",
  available: true,
});
lib.addBook({
  title: "Dế Mèn Phiêu Lưu Ký",
  author: "Tô Hoài",
  year: 1941,
  genre: "Văn học",
  available: false,
});
lib.addBook({
  title: "Refactoring",
  author: "Martin Fowler",
  year: 1999,
  genre: "Programming",
  available: true,
});

console.log(lib.getAllBooks().length); // 4
console.log(lib.findByTitle("clean")); // [{ Clean Code }]
console.log(lib.filter({ genre: "Programming", yearFrom: 2000 })); // [{ Clean Code }]
console.log(lib.getAvailableBooks().length); // 3

const stats = lib.getStats();
console.log(stats.total); // 4
console.log(stats.available); // 3
console.log(stats.borrowed); // 1
console.log(stats.genres); // ["Programming", "Văn học"]

lib.borrowBook("Clean Code");
console.log(lib.getAvailableBooks().length); // 2

lib.returnBook("Clean Code");
console.log(lib.getAvailableBooks().length); // 3

// ---- Bộ test nâng cao: tự kiểm tra xử lý lỗi ----
// Thêm sách trùng title+author -> phải throw Error
try {
  lib.addBook({
    title: "Clean Code",
    author: "Robert Martin",
    year: 2020,
    genre: "Programming",
    available: true,
  });
  console.log("FAIL: trung lap khong bi bat");
} catch (e) {
  console.log("OK");
}
// Mượn sách không tồn tại -> phải throw Error
try {
  lib.borrowBook("Sach Khong Ton Tai");
  console.log("FAIL: sach khong ton tai khong bi bat");
} catch (e) {
  console.log("OK");
}
// Mượn sách đã có người mượn (Dế Mèn đang available: false) -> phải throw Error
try {
  lib.borrowBook("Dế Mèn Phiêu Lưu Ký");
  console.log("FAIL: sach da muon khong bi bat");
} catch (e) {
  console.log("OK");
}
// Trả sách đang có sẵn (Design Patterns đang available: true) -> phải throw Error
try {
  lib.returnBook("Design Patterns");
  console.log("FAIL: sach dang co san khong bi bat");
} catch (e) {
  console.log("OK");
}
// Tìm với keyword rỗng -> không crash, trả về tất cả
console.log(lib.findByTitle("").length); // 4
// Filter yearFrom=0 -> 0 là falsy, phải dùng !== undefined không dùng if(yearFrom)
console.log(lib.filter({ yearFrom: 0 }).length); // 4

