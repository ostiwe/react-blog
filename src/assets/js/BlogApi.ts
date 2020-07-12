import {notification} from "antd";
import lang from "./lang";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

enum HttpMethods {'get' = 'GET', 'post' = 'POST', 'put' = 'PUT', 'delete' = 'DELETE'}

enum Lang {'ru' = 'ru', 'en' = 'en'}

interface Post {
    title: string,
    description: string | null,
    content: string,
    published: number,
    publish_now: boolean | number,
    tags: number[]
}

interface Tag {
    name: string,
    ru_name: string
}

interface RequestItem {
    id: string,
    item: XMLHttpRequest
}

class BlogApi {
    protected accessToken: string | undefined;
    private readonly host: string;
    private lang: Lang = Lang.ru;
    private requestsList: RequestItem[];

    constructor(host: string) {
        this.host = host;
        this.requestsList = [];
    }

    setLang(lang: Lang) {
        this.lang = lang;
        return this;
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

    logout() {
        return this.sendRequest('/auth/logout', HttpMethods.post,
            {}, [['Content-type', 'application/json']])
    }

    getLangList() {
        return Lang;
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

    getTagsStats() {
        return this.sendRequest('/tags/stats', HttpMethods.get)
    }

    getUserSelfInfo() {
        return this.sendRequest('/auth/info', HttpMethods.post,
            {access_token: this.accessToken}, [['Content-type', 'application/json']])
    }

    getUserById(userId: number) {
        return this.sendRequest(`/users/${userId}`, HttpMethods.get)
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

    getCommentsCount() {
        return this.sendRequest('/comments/count', HttpMethods.get)
    }

    getUsers(page: number, query: Object) {
        return this.sendRequest('/users', HttpMethods.get, {page: page, ...query})
    }

    createComment(postID: number, content: string) {
        return this.sendRequest(`/comments/${postID}`, HttpMethods.post, {
            text: content,
        }, [['Content-type', 'application/json']])
    }

    createPost(postObject: Post) {
        return this.sendRequest('/posts', HttpMethods.post, postObject, [['Content-type', 'application/json']])
    }

    createTag(tagObject: Tag) {
        return this.sendRequest('/tags', HttpMethods.post, tagObject, [['Content-type', 'application/json']])
    }

    deletePost(postID: number) {
        return this.sendRequest(`/posts/${postID}`, HttpMethods.delete)
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

    static convertObjectKeysToUpperCase(object: object): object {
        return camelcaseKeys(object, {deep: true});
    }

    static convertObjectKeysToSnakeCase(object: object): object {
        return snakecaseKeys(object, {deep: true});
    }

    private static makeid() {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 30; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    cancelAllRequests() {
        this.requestsList.map(request => {
            request.item.abort();
        })
        this.requestsList = [];
    }

    removeRequest(id: string) {
        this.requestsList = this.requestsList.filter(item => item.id !== id);
    }

    sendRequest(url: string, method: HttpMethods, data: object = {}, headers?: Array<[string, string]>) {
        return new Promise((resolve, reject) => {
            let xr = new XMLHttpRequest();
            const xrID = BlogApi.makeid();
            this.requestsList.push({id: xrID, item: xr})
            if (method === HttpMethods.get && Object.keys(data).length > 0) {
                let query = this.serialiseObject(BlogApi.convertObjectKeysToSnakeCase(data));
                xr.open(method, this.host + url + `?${query}`)
            } else xr.open(method, this.host + url)

            xr.onload = () => {
                const jsonResponse = JSON.parse(xr.response);
                const convertedObject = BlogApi.convertObjectKeysToUpperCase(jsonResponse);
                if (Object.keys(convertedObject).includes('error')) {
                    this.removeRequest(xrID);
                    reject(convertedObject)
                }
                this.removeRequest(xrID);
                resolve(convertedObject)
            }
            xr.onerror = () => {
                notification.error({
                    message: lang.xr_error[this.lang].message,
                    description: lang.xr_error[this.lang].description
                });
                this.removeRequest(xrID);
                reject(xr.response)
            }
            if (headers?.length) {
                headers.map(header => xr.setRequestHeader(header[0], header[1]));
            }

            if (this.accessToken) {
                xr.setRequestHeader('Token', this.accessToken);
            }


            if (method !== HttpMethods.get) {
                const requestData = BlogApi.convertObjectKeysToSnakeCase(data);
                xr.send(JSON.stringify(requestData));
            } else xr.send();

        })
    }

}

export default BlogApi;
