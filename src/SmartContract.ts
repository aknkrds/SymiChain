export class SmartContract {
    code: string;
    state: any;

    constructor(code: string) {
        this.code = code;
        this.state = {};
    }

    execute(transaction: any) {
        // Akıllı sözleşmeyi çalıştır
        this.state[transaction.key] = transaction.value;
    }
}