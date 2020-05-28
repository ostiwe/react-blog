// @ts-ignore
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

    sendRequest(url: string, method: string, data: object, headers?: [[any, any]]) {
        return new Promise((resolve, reject) => {
            let xr = new XMLHttpRequest();
            xr.open(method, this.host + url)

            xr.onload = function () {
                resolve(JSON.parse(xr.response))
            }
            xr.onerror = function () {
                reject(xr.response)
            }
            if (headers?.length) {
                headers.map(header => xr.setRequestHeader(header[0], header[1]));
            }
            xr.send(JSON.stringify(data));

        })
    }

}

export default BlogApi;