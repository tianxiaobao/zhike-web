import axios from 'axios';

export default {
    fetch,
    createCancleToken,
    isCancel
};
const config = {
    'json': {
        headers: {
            'Content-Type': 'application/json'
        },
        transformRequest: [(data) => {
            return data && JSON.stringify(data);
        }]
    },
    'form': {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        // transformRequest: [(data) => {
        //     const params = new URLSearchParams();
        //     Object.entries(data).forEach(entry => {
        //         params.append(...entry);
        //     });
        //     return params.toString();
        // }]
    },
    // 'formDataUncode': {
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     transformRequest: [(data) => {
    //         const params = new FormData();
    //         Object.entries(data).forEach(entry => {
    //             params.append(...entry);
    //         });
    //         return params;
    //     }]
    // },
    'formData': {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: [(data) => {
            const params = new URLSearchParams();
            Object.entries(data).forEach(entry => {
                params.append(...entry);
            });
            return params.toString();
        }]
    }
};
function fetch (url, method = 'get', { path = '', params = {}, type = 'json', cancelToken } = {}) {
    return new Promise((resolve, reject) => {
        if (Array.isArray(path)) {
            path = path.join('/');
        }
        if(path) {
            url += url[url.length] === '/'? path: `/${path}`;
        }
        const options = {
            url: url,
            method: method,
            cancelToken: cancelToken && cancelToken.token,
            withCredentials: true,
            headers: config[type].headers
        };

        if (method == 'get') {
            options.params = params;
            options.paramsSerializer = (params) => {
                if(typeof params === 'string') {
                    return params;
                }
                return Object.keys(params).map(key => {
                    if (Array.isArray(params[key])) {
                        return params[key].map(val => {
                            return `${key}=${val}`;
                        }).join('&');
                    } else {
                        return `${key}=${params[key]}`;
                    }
                }).join('&');
            };
        } else {
            options.data = params;
            options.transformRequest = config[type].transformRequest;
        }

        axios(options).then(res => {
            if (res.data.status === 'success')
                resolve(res.data);
            else {
                if(res.data.message && res.data.message.exception !== undefined) {
                    res.data.message = res.data.message.exception;
                }
                reject(res.data);
            }
        }).catch(error => {
            if(error.response === undefined && error.message === 'Network Error' && !isCancel(error)) {
                location.reload(true);
            }
            reject(error);
        });
    });
};

function createCancleToken () {
    return axios.CancelToken.source();
}

function isCancel (error) {
    return axios.isCancel(error);
}