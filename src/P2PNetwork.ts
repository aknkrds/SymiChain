import WebSocket from 'ws';

export class P2PNetwork {
    peers: WebSocket[];

    constructor() {
        this.peers = [];
    }

    connectToPeer(peer: string) {
        const ws = new WebSocket(peer);
        ws.on('open', () => this.initConnection(ws));
    }

    initConnection(ws: WebSocket) {
        this.peers.push(ws);
        this.initMessageHandler(ws);
        this.initErrorHandler(ws);
    }

    initMessageHandler(ws: WebSocket) {
        ws.on('message', (data: string) => {
            const message = JSON.parse(data);
            // Mesaj işleme mantığı
        });
    }

    initErrorHandler(ws: WebSocket) {
        const closeConnection = (ws: WebSocket) => {
            console.log('connection failed to peer: ' + ws.url);
            this.peers.splice(this.peers.indexOf(ws), 1);
        };
        ws.on('close', () => closeConnection(ws));
        ws.on('error', () => closeConnection(ws));
    }
}