class Websocket {
    private socket: WebSocket;
    private accessToken: string;

    constructor(host: string, accessToken: string) {
        this.socket = new WebSocket(host);
        this.accessToken = accessToken;

        // this.socket.onmessage = ev => this.onMessage(ev);
        // this.socket.onclose = ev => this.onSocketClose(ev);
        // this.socket.onopen = ev => this.onSocketOpen(ev);
        // this.socket.onerror = ev => this.onSocketError(ev);
    }


    setOnSocketError(callback: ((ev: Event) => void) | null) {
        this.socket.onerror = callback
    }

    setOnSocketOpen(callback: ((ev: Event) => void) | null) {
        this.socket.onopen = callback
    }

    setOnSocketClose(callback: ((ev: Event) => void) | null) {
        this.socket.onclose = callback
    }

    setOnMessage(callback: ((ev: Event) => void) | null) {
        this.socket.onmessage = callback
    }

}

export default Websocket