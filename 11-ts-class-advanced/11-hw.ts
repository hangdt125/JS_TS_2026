class MemoryLogger implements ILogger {

    private logs: string[] = []

    log(message: string): void {
        this.logs.push(message)
    }

    getLogs(): string[] {
        const logs: string[] = [...this.logs]
        return logs
    }

}

abstract class PaymentGateway {
    constructor(protected providerName: string) { }

    name(): string {
        return this.providerName
    }

    abstract supports(channel: PaymentChannel): boolean
    abstract calculateFee(amount: number): number

    pay(request: IPaymentRequest): IPaymentResult {
        if (request.amount <= 0) { throw new Error("Số tiền phải lớn hơn 0") }
        if (!this.supports(request.channel)) { throw new Error("Gateway không hỗ trợ kênh thanh toán") }
        let fee: number = this.calculateFee(request.amount)
        return {
            id: request.id,
            provider: this.providerName,
            status: "paid",
            fee: fee,
            totalCharged: request.amount + fee,
            message: `Thanh toán thành công cho ${request.customer}`
        }
    }
}

class CardGateway extends PaymentGateway {
    constructor() {
        super("Neko Card")
    }

    supports(channel: PaymentChannel): boolean {
        if (channel === 'card') return true
        else return false
    }

    calculateFee(amount: number): number {
        let fee: number = amount * 0.02;
        if (fee <= 5000) { fee = 5000 }
        return fee
    }
}

class BankGateway extends PaymentGateway {
    constructor() {
        super("Neko Bank")
    }

    supports(channel: PaymentChannel): boolean {
        if (channel === 'bank') return true
        else return false
    }

    calculateFee(amount: number): number {
        let fee: number = 10000
        if (amount >= 10000000) { fee = 0 }
        return fee
    }
}

class WalletGateway extends PaymentGateway {

    constructor() {
        super("Neko Wallet")
    }

    supports(channel: PaymentChannel): boolean {
        if (channel === 'wallet') return true
        else return false
    }

    calculateFee(amount: number): number {
        let fee: number = amount * 0.01;
        if (fee >= 20000) { fee = 20000 }
        return fee
    }
}


class PaymentProcessor {
    constructor(private gateways: PaymentGateway[], private logger: ILogger) { }

    process(request: IPaymentRequest): IPaymentResult {

        const matched = this.gateways.find(item => item.supports(request.channel) === true)
        if (!matched) {
            return {
                id: request.id,
                provider: "",
                status: "failed",
                fee: 0,
                totalCharged: 0,
                message: "Không tìm thấy gateway phù hợp"
            }
        }

        try {
            const result = matched.pay(request);
            logger.log(`[PAID] ${request.id} by ${result.provider}`)
            return result
        }
        catch (error) {
            if (error instanceof Error) {
                logger.log(`[FAILED] ${request.id}: ${error.message}`)
                return {
                    id: request.id,
                    provider: "",
                    status: "failed",
                    fee: 0,
                    totalCharged: 0,
                    message: `${error.message}`
                }
            }

            else {
                logger.log(`[FAILED] ${request.id}: Lỗi không xác định`)
                return {
                    id: request.id,
                    provider: "",
                    status: "failed",
                    fee: 0,
                    totalCharged: 0,
                    message: "Lỗi không xác định"
                }
            }
        }
    }

    processMany(requests: IPaymentRequest[]): IPaymentResult[] {

        //let process = new PaymentProcessor(this.gateways, this.logger)
        const outcomes: IPaymentResult[] = []

        for (let item of requests) {
            const result = this.process(item)
            outcomes.push(result)
        }
        return outcomes
    }

    getPaidTotal(results: IPaymentResult[]): number {
        const paid = results.filter(item => item.status === 'paid')
        let totalCharged = paid.reduce((sum, item) => sum += item.totalCharged, 0)
        return totalCharged
    }

    getFailedMessages(results: IPaymentResult[]): string[] {
        const fail = results.filter(item => item.status === 'failed')
        if (fail.length === 0) { console.log('Không có payment fail') }
        const failMsg = fail.map(item => `id: ${item.id}, message: ${item.message}`)
        return failMsg
    }
}


type PaymentChannel = "card" | "bank" | "wallet";
type PaymentStatus = "paid" | "failed";

interface IPaymentRequest {
    id: string;
    customer: string;
    amount: number;
    channel: PaymentChannel;
}

interface IPaymentResult {
    id: string;
    provider: string;
    status: PaymentStatus;
    fee: number;
    totalCharged: number;
    message: string;
}

interface ILogger {
    log(message: string): void;
}



const logger = new MemoryLogger();
const processor = new PaymentProcessor(
    [new CardGateway(), new BankGateway(), new WalletGateway()],
    logger,
);

const requests: IPaymentRequest[] = [
    { id: "o1", customer: "An", amount: 500000, channel: "card" },
    { id: "o2", customer: "Bình", amount: 12000000, channel: "bank" },
    { id: "o3", customer: "Cường", amount: 2500000, channel: "wallet" },
    { id: "o4", customer: "Dung", amount: -100000, channel: "card" },
];

const results = processor.processMany(requests);

console.log(
    results.map(
        (r) => `${r.id}:${r.provider}:${r.status}:${r.fee}:${r.totalCharged}`,
    ),
);
// [
//   "o1:Neko Card:paid:10000:510000",
//   "o2:Neko Bank:paid:0:12000000",
//   "o3:Neko Wallet:paid:20000:2520000",
//   "o4:Neko Card:failed:0:0"
// ]

console.log(processor.getPaidTotal(results));
// 15030000

console.log(processor.getFailedMessages(results));
// ["o4: Số tiền phải lớn hơn 0"]

console.log(logger.getLogs().length);
// 4