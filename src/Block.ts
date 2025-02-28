import * as crypto from 'crypto';
import { Transaction } from './Transaction';

export class Block {
    index: number;
    timestamp: string;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;

    constructor(index: number, timestamp: string, transactions: Transaction[], previousHash: string = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(): string {
        return crypto.createHash('sha256').update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
    }

    mineBlock(difficulty: number) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Symicoin block mined: " + this.hash);
    }

    hasValidTransactions(): boolean {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }
}