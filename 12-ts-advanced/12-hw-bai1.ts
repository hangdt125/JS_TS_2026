const APP_CONFIG = {
    env: {
        dev: "https://dev.neko.vn",
        staging: "https://staging.neko.vn",
        prod: "https://neko.vn",
    },
    selectors: {
        loginButton: "#login",
        cartBadge: "[data-test='cart-badge']",
        checkoutButton: "#checkout",
    },
    timeouts: {
        short: 1000,
        medium: 5000,
        long: 15000,
    },
    roles: {
        admin: "ADMIN",
        member: "MEMBER",
        guest: "GUEST",
    },
} as const;


type AppConfigType = typeof APP_CONFIG;
type ConfigSection = keyof AppConfigType;
type SelectorKey = keyof typeof APP_CONFIG.selectors;
type TimeoutKey = keyof typeof APP_CONFIG.timeouts;
type Role = typeof APP_CONFIG.roles[keyof typeof APP_CONFIG.roles];

// Đối với 1 object cụ thể, cần chuyển đổi thành type position (typeof) để nhận biết type của các key trong object đó, sau đó dùng keyof để lấy ra các key đó
// Đối với type hay interface, bản chất đã nhận diện được type trong đó rồi nên có thể sử dụng trực tiếp keyof để lấy ra các key cyar type hay interface đó


function getConfigValue<N extends ConfigSection, K extends keyof AppConfigType[N]>(section: N, key: K) {
    return APP_CONFIG[section][key]
}

function getSelector(key: SelectorKey): string {
    return APP_CONFIG.selectors[key]

}

function getTimeout(key: TimeoutKey): number {
    return APP_CONFIG.timeouts[key]
}

function createRoleRecord<V>(defaultValue: V): Record<Role, V> {
    const newRecord: Record<Role, V> = {
        "ADMIN": defaultValue,
        "GUEST": defaultValue,
        "MEMBER": defaultValue
    }
    return newRecord
}

function isRole(value: string): value is Role {
    const ROLE_SET: Record<Role, true> = {
        "ADMIN": true,
        "GUEST": true,
        "MEMBER": true
    }
    return Object.hasOwn(ROLE_SET, value);
}


console.log(getConfigValue("env", "dev"));
// https://dev.neko.vn

console.log(getConfigValue("timeouts", "long"));
// 15000

console.log(getSelector("checkoutButton"));
// #checkout

console.log(getTimeout("medium"));
// 5000

const permissions = createRoleRecord(false);
console.log(permissions.ADMIN);
console.log(permissions.MEMBER);
console.log(permissions.GUEST);
// false
// false
// false

console.log(isRole("ADMIN"));
console.log(isRole("SUPER_ADMIN"));
// true
// false

// Các dòng sau nếu mở comment thì TypeScript phải báo lỗi:
// getConfigValue("env", "loginButton");
// getSelector("dev");
// permissions.SUPER_ADMIN;
