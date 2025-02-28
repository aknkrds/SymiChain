import * as crypto from 'crypto';

export class Wallet {
    publicKey: string;
    privateKey: string;

    constructor(privateKey?: string) {
        if (privateKey) {
            // Özel anahtar verilirse, cüzdanı bu anahtarla oluştur
            this.privateKey = privateKey;
            this.publicKey = this.getPublicKeyFromPrivateKey(privateKey);
        } else {
            // Özel anahtar verilmezse, yeni bir cüzdan oluştur
            const { publicKey, privateKey } = this.generateKeyPair();
            this.publicKey = publicKey;
            this.privateKey = privateKey;
        }
    }

    generateKeyPair() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
        return { publicKey, privateKey };
    }

    getPublicKeyFromPrivateKey(privateKey: string): string {
        const key = crypto.createPrivateKey(privateKey);
        return key.export({
            type: 'spki',
            format: 'pem'
        }).toString();
    }

    signTransaction(transactionHash: string) {
        const sign = crypto.createSign('SHA256');
        sign.update(transactionHash).end();
        const signature = sign.sign(this.privateKey, 'hex');
        return signature;
    }

    verifySignature(transactionHash: string, signature: string) {
        const verify = crypto.createVerify('SHA256');
        verify.update(transactionHash);
        return verify.verify(this.publicKey, signature, 'hex');
    }
}