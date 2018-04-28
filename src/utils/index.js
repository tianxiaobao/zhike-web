export function throttle (func, wait) {
    let _context, _args, _timeout;
    function run () {
        _timeout = null;
        const result = func.apply(_context, _args);
        _context = _args = null;
        return result;
    }
    return function (...args) {
        _context = this;
        _args = args;
        if (!_timeout) {
            _timeout = setTimeout(run, wait);
        }
    };
}

export function debounce (func, wait) {
    let _context, _args, _timeout;
    function run () {
        _timeout = null;
        const result = func.apply(_context, _args);
        _context = _args = null;
        return result;
    }
    return function (...args) {
        if (_timeout) {
            clearTimeout(_timeout);
        }
        _context = this;
        _args = args;
        _timeout = setTimeout(run, wait);
    };
}

export function merge (target, src) {
    if(!isObject(target) || !isObject(src)) {
        return src;
    }
    Object.keys(src).forEach(key => {
        const targetProp = target[key];
        const srcProp = src[key];
        if(isObject(targetProp)
        && isObject(srcProp)
        && !Array.isArray(targetProp)
        && !Array.isArray(srcProp)) {
            target[key] = merge(targetProp, srcProp);
        } else if (srcProp !== undefined) {
            target[key] = srcProp;
        }
    });
    return target;
}

export function isObject (value) {
    const type = typeof value;
    return !!value && type == 'object';
}

export function timeFormatter (date) {
    if(!date) {
        return '';
    }
    if(!(date instanceof Date)) {
        date = new Date(date);
    }
    const Y = date.getFullYear();
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

export function dateFormatter (date) {
    if(!date) {
        return '';
    }
    if(!(date instanceof Date)) {
        date = new Date(date);
    }
    const Y = date.getFullYear();
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return `${Y}-${M}-${D}`;
}

export function stringToBase64 (str) {
    return global.btoa(unescape(encodeURIComponent(str)));
}