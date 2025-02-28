import * as crypto from 'crypto';
import { Wallet } from './Wallet';

export class Transaction {
    fromAddress?: string;
    toAddress: string;
    amount: number;
    signature: string;

    constructor(fromAddress: string | null, toAddress: string, amount: number) {
        this.fromAddress = fromAddress || undefined;
        this.toAddress = toAddress;
        this.amount = amount;
        this.signature = '';
    }

    calculateHash(): string {
        return crypto.createHash('sha256').update((this.fromAddress || '') + this.toAddress + this.amount).digest('hex');
    }

    signTransaction(signingKey: Wallet) {
        if (signingKey.publicKey !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHash();
        this.signature = signingKey.signTransaction(hashTx);
    }

    isValid(): boolean {
        if (!this.fromAddress) return true; // Mining reward transaction'ları için fromAddress olmayabilir.

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }

        try {
            // Public key'i oluştur
            const publicKey = crypto.createPublicKey({
                key: this.fromAddress,
                format: 'pem',
                type: 'spki'
            });

            // İmzayı doğrula
            const isVerified = crypto.verify(
                'sha256',
                Buffer.from(this.calculateHash()),
                publicKey,
                Buffer.from(this.signature, 'hex')
            );

            if (!isVerified) {
                console.error('Transaction signature verification failed');
            }

            return isVerified;
        } catch (error) {
            console.error('Error verifying transaction:', error);
            return false;
        }
    }
}