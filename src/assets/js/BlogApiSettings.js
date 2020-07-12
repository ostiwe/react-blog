import BlogApi from './BlogApi';

const APIHOST = 'http://api.symf.loc';

let apiBlog = new BlogApi(APIHOST);

export { apiBlog, APIHOST };
