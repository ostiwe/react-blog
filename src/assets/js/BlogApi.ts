import {notification} from "antd";

enum HttpMethods {'get' = 'GET', 'post' = 'POST', 'put' = 'PUT'}

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
        return this.sendRequest('/auth/register', HttpMethods.post,
            formData, [['Content-type', 'application/json']])
    }

    login(formData: object) {
        return this.sendRequest('/auth/login', HttpMethods.post,
            formData, [['Content-type', 'application/json']])
    }

    getPosts(page: number, params: object = {}) {
        return this.sendRequest('/posts', HttpMethods.get,
            {page: page, ...params}, [['Content-type', 'application/json']])
    }

    getPostsByCategory(tag: number, page: number) {
        return this.sendRequest(`/tag/${tag}`, HttpMethods.get,
            {page: page}, [['Content-type', 'application/json']])
    }

    getTags() {
        return this.sendRequest('/tags', HttpMethods.get)
    }

    getUserInfo() {
        return this.sendRequest('/auth/info', HttpMethods.post,
            {access_token: this.accessToken}, [['Content-type', 'application/json']])
    }

    getPostById(postId: number) {
        return this.sendRequest(`/post/${postId}`, HttpMethods.get)
    }

    getComments(postId: number) {
        return this.sendRequest(`/comments/${postId}`, HttpMethods.get)
    }

    getUsersCount() {
        return this.sendRequest('/users/count', HttpMethods.get)
    }

    getPostsCount() {
        return this.sendRequest('/posts/count', HttpMethods.get)
    }

    createComment(postID: number, content: string) {
        return this.sendRequest(`/comments/${postID}`, HttpMethods.post, {
            text: content,
        }, [['Content-type', 'application/json'], ['Token', `${this.accessToken}`]])
    }

    private serialiseObject(obj: any): string {
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

    sendRequest(url: string, method: HttpMethods, data: object = {}, headers?: Array<[string, string]>) {
        return new Promise((resolve, reject) => {
            let xr = new XMLHttpRequest();
            if (method === HttpMethods.get && Object.keys(data).length > 0) {
                let query = this.serialiseObject(data);
                xr.open(method, this.host + url + `?${query}`)
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