import { Blockchain } from './Blockchain';
import { Wallet } from './Wallet';
import { Transaction } from './Transaction';

// Ağ ücretlerini toplayacak cüzdanı oluştur
const feeWallet = new Wallet(); // Bu cüzdanın özel anahtarını sadece siz bileceksiniz
console.log('Fee Wallet Private Key:', feeWallet.privateKey); // Özel anahtarı konsola yazdır
console.log('Fee Wallet Public Key:', feeWallet.publicKey); // Genel anahtarı konsola yazdır

// Blockchain oluştur ve feeWallet'ı bağla
const myCoin = new Blockchain(feeWallet);

// Kullanıcı cüzdanları oluştur
const myWallet = new Wallet();
const recipientWallet = new Wallet();

// İlk transaction'ı oluştur ve imzala
const tx1 = new Transaction(myWallet.publicKey, recipientWallet.publicKey, 10);
tx1.signTransaction(myWallet);
console.log('Is transaction valid?', tx1.isValid()); // İmza doğrulamasını kontrol et
myCoin.addTransaction(tx1);

console.log('Starting the miner...');
myCoin.minePendingTransactions(myWallet.publicKey);

console.log('Balance of myWallet is', myCoin.getBalanceOfAddress(myWallet.publicKey));
console.log('Balance of feeWallet is', myCoin.getBalanceOfAddress(feeWallet.publicKey));

// İkinci transaction'ı oluştur ve imzala
const tx2 = new Transaction(myWallet.publicKey, recipientWallet.publicKey, 20);
tx2.signTransaction(myWallet);
console.log('Is transaction valid?', tx2.isValid()); // İmza doğrulamasını kontrol et
myCoin.addTransaction(tx2);

console.log('Starting the miner again...');
myCoin.minePendingTransactions(myWallet.publicKey);

console.log('Balance of myWallet is', myCoin.getBalanceOfAddress(myWallet.publicKey));
console.log('Balance of feeWallet is', myCoin.getBalanceOfAddress(feeWallet.publicKey));