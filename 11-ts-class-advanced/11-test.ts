interface Browser {
  open(): void;
}

// Có implements Browser
class Chrome implements Browser {
  open(): void {
    console.log("Chrome is opened");
  }
}

// Có implements Browser
class Firefox implements Browser {
  open(): void {
    console.log("Firefox is opened");
  }
}

// KHÔNG implements Browser
class C {
  open(): void {
    console.log("C is opened");
  }
}

// TestRunner chỉ yêu cầu một object có cấu trúc của Browser
class TestRunner {
  constructor(private browser: Browser) {}

  run(): void {
    this.browser.open();
  }
}


// ========================
// TEST
// ========================

const chrome = new Chrome();
const firefox = new Firefox();
const test = new C();

const runner1 = new TestRunner(chrome);
const runner2 = new TestRunner(firefox);
const runner3 = new TestRunner(test);

runner1.run();
runner2.run();
runner3.run();