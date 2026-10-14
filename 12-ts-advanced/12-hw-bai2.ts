const ORDER_STATUS = {
    pending: "pending",
    paid: "paid",
    cancelled: "cancelled",
    refunded: "refunded",
} as const;

type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
type SortDirection = "asc" | "desc";

interface OrderInfo {
    id: string;
    customer: string;
    total: number;
    status: OrderStatus;
    createdAt: string;
    tags: string[];
};

const orders: OrderInfo[] = [
    {
        id: "o1",
        customer: "An",
        total: 450000,
        status: "paid",
        createdAt: "2026-06-01",
        tags: ["smoke", "vip"],
    },
    {
        id: "o2",
        customer: "Bình",
        total: 120000,
        status: "pending",
        createdAt: "2026-06-03",
        tags: ["new"],
    },
    {
        id: "o3",
        customer: "Cường",
        total: 800000,
        status: "paid",
        createdAt: "2026-06-02",
        tags: ["vip"],
    },
    {
        id: "o4",
        customer: "Dung",
        total: 0,
        status: "cancelled",
        createdAt: "2026-06-04",
        tags: [],
    }
]

function getField<T, K extends keyof T>(item: T, key: K): T[K] {
    return item[key]
}

function pickFields<T, K extends keyof T>(item: T, keys: K[]): Pick<T, K> {

    const result = {} as Pick<T, K>

    for (let key of keys) {
        result[key] = item[key]
    }
    return result
}

function updateField<T, K extends keyof T>(item: T, key: K, value: T[K]): T {

    const result: T = {
        ...item,
        [key]: value
    }
    return result
}

function sortBy<T, K extends keyof T>(items: T[], key: K, direction: SortDirection = 'asc'): T[] {

    const multifier = direction === 'asc' ? 1 : -1
    return [...items].sort((a, b) => {
        const valueA = a[key]
        const valueB = b[key]

        if (typeof valueA === 'string' && typeof valueB === 'string') { return valueA.localeCompare(valueB) * multifier }
        if (typeof valueA === 'number' && typeof valueB === 'number') { return (valueA - valueB) * multifier }

        throw new TypeError(`${String(key)} must contains type of string or number`)
    })
}

function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> {

    const result = Object.groupBy(items, item => String(item[key])) as Record<string, T[]>
    return result
}

function createIndex<T, K extends keyof T>(items: T[], key: K): Record<string, T> {
    return items.reduce<Record<string, T>>((result, item) => {
        const indexKey = String(item[key]);
        result[indexKey] = item
        return result
    }, {})
}

function summarizeByStatus(orders: OrderInfo[]): Record<OrderStatus, { count: number; total: number }> {
    let initObj: Record<OrderStatus, { count: number; total: number }> = {
        pending: { count: 0, total: 0 },
        paid: { count: 0, total: 0 },
        cancelled: { count: 0, total: 0 },
        refunded: { count: 0, total: 0 }
    }

    return orders.reduce<Record<OrderStatus, { count: number; total: number }>>((result, item) => {
        result[item.status].count++;
        result[item.status].total += item.total;

        return result
    }, initObj)

}

console.log(getField(orders[0], "customer"));
// An

console.log(pickFields(orders[0], ["id", "total"]));
// { id: "o1", total: 450000 }

console.log(updateField(orders[0], "status", ORDER_STATUS.refunded).status);
// refunded

console.log(sortBy(orders, "total", "desc").map((order) => order.id));
// ["o3", "o1", "o2", "o4"]

console.log(Object.keys(groupBy(orders, "status")));
// ["paid", "pending", "cancelled"]

console.log(createIndex(orders, "id").o2.customer);
// Bình

const summary1 = summarizeByStatus(orders);
console.log(summary1.paid);
// { count: 2, total: 1250000 }

console.log(summary1.refunded);
// { count: 0, total: 0 }

// Các dòng sau nếu mở comment thì TypeScript phải báo lỗi:
// getField(orders[0], "notExist");
// updateField(orders[0], "total", "100000");
// sortBy(orders, "abc");

