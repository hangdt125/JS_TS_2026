// Bai 1

class ProductStore {
    #products = [];

    constructor() {
        this.#products = []
    };

    addProduct(product) {

        //Clean input data
        let { id, name, category, price, inStock } = product
        const cleanId = id.trim().toLowerCase();
        const cleanName = name.trim().toLowerCase();
        const cleanCategory = category.trim().toLowerCase();

        console.log(`Add product: ${cleanName} to cart`)

        const isDuplicatedId = this.#products.find(({ id }) => {
            if (id === cleanId) { return true }
            return false
        })

        if (isDuplicatedId) {
            return {
                success: false,
                message: "This ID is already taken"
            }
        }

        if (!cleanName) {
            return {
                success: false,
                message: "Name is required field"
            }
        }

        if (!cleanCategory) {
            return {
                success: false,
                message: "Category is required field"
            }
        }

        if (typeof (price) !== 'number') {
            return {
                success: false,
                message: "Price must be number"
            }
        }

        if ((price) <= 0) {
            return {
                success: false,
                message: "Price must be greater than 0"
            }
        }

        if (typeof (inStock) !== 'boolean') {
            return {
                success: false,
                message: "Type of inStock must be boolean"
            }
        }

        this.#products.push({
            id: cleanId,
            name: cleanName,
            category: cleanCategory,
            price: price,
            inStock: inStock
        });

        console.log(`Current product list`)
        for (let item of this.#products) {
            console.log(item)
        }

        return {
            success: true,
            message: "Thêm sản phẩm thành công"
        }
    }

    findByName(keyword) {
        keyword = keyword.trim().toLowerCase();
        const productName = this.#products.filter((product) =>
            product.name.includes(keyword) === true)
        if (productName.length === 0) {
            console.log(`There is no available product for keyword ${keyword}`);
        }
        return productName

    }

    filterByCategory(category) {
        category = category.trim().toLowerCase();
        const catName = this.#products.map((product) =>
            product.category
        )
        if (!catName.includes(category)) {
            console.log(`There is no category with name ${category}`);
            return -1
        }

        const filterByCat = this.#products.filter((product) =>
            product.category === category
        )

        if (filterByCat.length === 0) { return console.log(`There is no available product for category ${category}`) }
        return filterByCat
    }
    getAvailableProducts() {
        const availableProd = this.#products.filter(product =>
            product.inStock === true
        )
        if (availableProd.length === 0) {
            console.log.apply(`There is no instock product`);
            return 0
        }
        return availableProd
    }

    getTotalInventoryValue() {
        let total = 0;
        const availableProd = this.getAvailableProducts();

        if (availableProd === 0) { return 0 }

        const totalProductAvailable = availableProd.map((product) =>
            total += product.price
        )
        return total
    }
}

class DiscountProductStore extends ProductStore {
    discountRate = 0;
    //#products = [];
    constructor(discountRate) {
        super()
        this.discountRate = discountRate
    }
    getTotalInventoryValue() {

        const total = super.getTotalInventoryValue();
        const discountAmount = total * this.discountRate;
        const finalPrice = total - discountAmount
        return {
            total,
            discountAmount,
            finalPrice
        }
    }

    getDiscountInfo() {
        const totalInventory = this.getTotalInventoryValue()
        return {
            originalTotal: totalInventory.total,
            discountRate: this.discountRate,
            discountAmount: totalInventory.discountAmount,
            finalTotal: totalInventory.finalPrice
        }
    }
}

const store = new DiscountProductStore(0.1);

const result1 = store.addProduct({
    id: "p01",
    name: "  iPhone 15 Pro  ",
    category: "phone",
    price: 29990000,
    inStock: true,
});
console.log("Result: ", result1)
console.log(`---`)

const result2 = store.addProduct({
    id: "p02",
    name: "MacBook Air",
    category: "laptop",
    price: 24990000,
    inStock: true,
});
console.log("Result: ", result2)
console.log(`---`)

const result3 = store.addProduct({
    id: "p03",
    name: "AirPods Pro",
    category: "audio",
    price: 5990000,
    inStock: false,
});
console.log("Result: ", result3)
console.log(`---`)

//Duplicate
const result4 = store.addProduct({
    id: "p01",
    name: "Duplicate",
    category: "phone",
    price: 1000,
    inStock: true,
});
console.log("Result: ", result4)
console.log(`---`)

// name is empty
const result5 = store.addProduct({ id: "p04", name: "   ", category: "phone", price: 1000, inStock: true })
console.log("Result: ", result5)
console.log(`---`)

//category is empty
const result6 = store.addProduct({ id: "p05", name: "Test", category: "   ", price: 1000, inStock: true })
console.log("Result: ", result6)
console.log(`---`)

//price <= 0
const result7 = store.addProduct({ id: "p06", name: "Test", category: "phone", price: 0, inStock: true })
console.log("Result: ", result7)
console.log(`---`)

// inStock has type !== boolean
const result8 = store.addProduct({ id: "p07", name: "Test", category: "phone", price: 1000, inStock: "yes" })
console.log("Result: ", result8)
console.log(`---`)

// Price is not a number
const result9 = store.addProduct({ id: "p07", name: "Test", category: "phone", price: true, inStock: "yes" })
console.log("Result: ", result9)
console.log(`---`)

const findResult = store.findByName("iphone");
console.log("Matching products for keyword are: ", findResult);
const filterCat = store.filterByCategory(" PHONE ");
console.log("Products for filtered category are: ", findResult);
const availableProd = store.getAvailableProducts();
console.log("Available products are", availableProd)
const discountInfo = store.getDiscountInfo();
console.log("Discount: ", discountInfo)


// Bai 2
class Cart {
    #items = [];
    discountPercentage = 0

    constructor() {
        this.#items = []
        this.discountPercentage = 0
    }

    addItem(item) {
        const { name, price, quantity } = item
        let cleanName = name.trim().toLowerCase();

        if (item.name.trim() === "") {
            return {
                success: false,
                message: "Name must be required field"
            }
        }
        if (typeof (item.price) !== 'number') {
            return {
                success: false,
                message: "Type of item price must be number"
            }
        }
        if (typeof (item.quantity) !== 'number') {
            return {
                success: false,
                message: "Type of item quantity must be number"
            }
        }
        if (item.quantity <= 0) {
            return {
                success: false,
                message: "Item quantity must be greater than 0"
            }
        }
        if (item.price <= 0) {
            return {
                success: false,
                message: "Item price must be greater than 0"
            }
        }

        const existItem = this.#items.find(item => item.name === cleanName)
        if (existItem) {

            existItem.quantity += quantity
            return {
                success: true,
                message: "Thêm vào giỏ hàng thành công"
            }
        }
        else {
            this.#items.push({
                name: cleanName,
                price: price,
                quantity: quantity
            })

            return {
                success: true,
                message: "Thêm vào giỏ hàng thành công"
            }
        }
    }

    removeItem(name) {
        name = name.trim().toLowerCase();
        const newItems = this.#items.filter(item => item.name !== name)
        return newItems
    }

    getSubtotal() {
        let subTotal = 0;
        for (let item of this.#items) {
            let itemPrice = item.quantity * item.price
            subTotal += itemPrice
        }
        return subTotal
    }

    applyCoupon(code) {

        if (typeof code !== 'string') {
            this.discountPercentage = 0
            return false
        }
        const cleanCode = code.trim();
        if (cleanCode === "") {
            this.discountPercentage = 0
            return false
        }

        const groups = cleanCode.match(/\d+/g);

        if (!groups) {
            this.discountPercentage = 0
            return false
        }

        if (groups.length > 1) {
            this.discountPercentage = 0
            return false
        }

        const discount = Number(groups[0]);

        if (discount > 100) {
            this.discountPercentage = 0
            return false
        }

        if (discount === 0) {
            this.discountPercentage = 0
            return false
        }
        this.discountPercentage = discount
        return true
    }


    checkout() {
        const subTotal = this.getSubtotal();
        let discountAmount = 0;
        discountAmount = (subTotal * this.discountPercentage) / 100

        return { items: this.#items, subtotal: subTotal, discount: discountAmount, total: subTotal - discountAmount }
    }
}

class VipCart extends Cart {
    memberName = ""
    constructor(memberName) {
        super()
        this.memberName = memberName
    }

    applyCoupon(code) {
        const discount = super.applyCoupon(code);
        if (discount !== true) {
            code = "VIP30"
        }
        return super.applyCoupon(code)
    }

    checkout() {
        const checkout = super.checkout();
        checkout.cartType = "VIP"
        checkout.memberName = this.memberName
        return checkout;
    }
}

const cart = new VipCart("Neko");

const item1 = cart.addItem({
    name: "Trà sữa trân châu",
    price: 30000,
    quantity: 2,
});

const item2 = cart.addItem({
    name: "  trà SỮA trân châu  ",
    price: 30000,
    quantity: 1,
});

const item3 = cart.addItem({
    name: "Trà đào",
    price: 25000,
    quantity: 1,
});

const item4 = cart.addItem({
    name: "Trà đào",
    price: 0,
    quantity: 1,
});

const item5 = cart.addItem({
    name: "Trà đào",
    price: 25000,
    quantity: 0,
});

const item6 = cart.addItem({
    name: "   ",
    price: 25000,
    quantity: 1,
});

console.log(item1)
console.log(item2)
console.log(item3)
console.log(item4)
console.log(item5)
console.log(item6)

console.log(cart.applyCoupon(" vip30 "));
console.log(cart.checkout());
console.log(cart.removeItem(" trà ĐàO "));