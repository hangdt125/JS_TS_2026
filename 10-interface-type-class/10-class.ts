class BasePage {
  constructor(
    public url: string,
    private secret: string = "xxx",
    protected baseUrl = "http:neko.com",
  ) { }

  protected getFullUrl(): string {
    return `${this.baseUrl}${this.url}`;
  }

  protected checkSecret(): string {
    return `${this.secret}`
  }
}

class LoginPage3 extends BasePage {
  constructor() {
    super("/login");
  }

  goto() {
    const fullUrl = this.getFullUrl();
    console.log(`Truy cap den trang web ${fullUrl}`);

    console.log(`Base URl: ${this.baseUrl}`);
  }

  getPrivateKey() {
    const secret = this.checkSecret()
    console.log(secret)
  }

}
const loginPage3 = new LoginPage3();

loginPage3.goto();
console.log(loginPage3.url);
loginPage3.getPrivateKey();







