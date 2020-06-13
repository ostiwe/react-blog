import {notification} from "antd";

class BlogApi {
    private readonly host: string;
    private accessToken: string | undefined;

    constructor(host: string) {
        this.host = host;
    }

    setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
        return this;
    }

    register(formData: object) {
        return this.sendRequest('/auth/register', 'POST',
            formData, [['Content-type', 'application/json']])
    }

    login(formData: object) {
        return this.sendRequest('/auth/login', 'POST',
            formData, [['Content-type', 'application/json']])
    }

    getPosts(page: number) {
        return this.sendRequest('/posts', 'GET',
            {page: page}, [['Content-type', 'application/json']])
    }

    getUserInfo() {
        return this.sendRequest('/auth/info', 'POST',
            {access_token: this.accessToken}, [['Content-type', 'application/json']])
    }


    serialiseObject(obj: any): string {
        let pairs = [];
        for (let prop in obj) {
            if (!obj.hasOwnProperty(prop)) {
                continue;
            }

            if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                pairs.push(this.serialiseObject(obj[prop]));
                continue;
            }

            pairs.push(prop + '=' + obj[prop]);
        }
        return pairs.join('&');
    }

    sendRequest(url: string, method: string, data: object, headers?: [[any, any]]) {
        return new Promise((resolve, reject) => {
            let xr = new XMLHttpRequest();

            if (method === "GET") {
                xr.open(method, this.host + url + `?${this.serialiseObject(data)}`)
            } else xr.open(method, this.host + url)

            xr.onload = function () {
                resolve(JSON.parse(xr.response))
            }
            xr.onerror = function () {
                notification.error({
                    message: "Ошибка сети",
                    description: "В данный момент невозможно выполнить запрашиваемую операцию, повторите попытку позже."
                });
                reject(xr.response)
            }
            if (headers?.length) {
                headers.map(header => xr.setRequestHeader(header[0], header[1]));
            }

            if (method !== "GET") {
                xr.send(JSON.stringify(data));
            } else xr.send();

        })
    }

}

export default BlogApi;