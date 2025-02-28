import { Block } from './Block';
import { Transaction } from './Transaction';
import { Wallet } from './Wallet';

export class Blockchain {
    chain: Block[];
    difficulty: number;
    pendingTransactions: Transaction[];
    miningReward: number;
    transactionFee: number; // Transfer ücreti
    feeWallet: Wallet; // Ağ ücretlerini toplayacak cüzdan

    constructor(feeWallet: Wallet) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 0.5; // Madencilik ödülü 0.5 Symicoin
        this.transactionFee = 0.1; // Transfer ücreti 0.1 Symicoin
        this.feeWallet = feeWallet; // Ağ ücretlerini toplayacak cüzdan
    }

    createGenesisBlock(): Block {
        return new Block(0, "01/01/2025", [], "0");
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress: string) {
        // Transfer ücretini feeWallet'a gönder
        const feeTx = new Transaction(null, this.feeWallet.publicKey, this.transactionFee * this.pendingTransactions.length);
        this.pendingTransactions.push(feeTx);

        // Madencilik ödülünü madencinin adresine gönder
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(this.chain.length, Date.now().toString(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Symicoin block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    addTransaction(transaction: Transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }

        if (!transaction.isValid()) {
            console.error('Invalid transaction details:', {
                fromAddress: transaction.fromAddress,
                toAddress: transaction.toAddress,
                amount: transaction.amount,
                signature: transaction.signature
            });
            throw new Error('Cannot add invalid transaction to chain');
        }

        // Transfer ücretini gönderen adresten düş ve feeWallet'a ekle
        const feeTransaction = new Transaction(transaction.fromAddress, this.feeWallet.publicKey, this.transactionFee);
        this.pendingTransactions.push(feeTransaction);

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address: string): number {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}