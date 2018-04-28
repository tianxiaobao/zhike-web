import AjaxClient from './ajaxClient';

export default {
    createAjaxGetter (api, options, loopDelay = 0) {
        return new AjaxGetter(api, options, loopDelay);
    },
    createJsonGetter (api, options) {
        return new JsonGetter(api, options);
    }
};

class eventEmitter {
    constructor () {
        this._listeners = {};
    }
    on (eventName, func, ...params) {
        const listener = (data) => {
            func(data, ...params);
        };
        if(this._listeners[eventName]) {
            this._listeners[eventName].push(listener);
        } else {
            this._listeners[eventName] = [listener];
        }
    }
    emit (eventName, param) {
        const listenerQueue = this._listeners[eventName];
        if(!listenerQueue) return;
        setTimeout(() => listenerQueue.forEach(listener => {
            listener(param);
        }), 0);
    }
}

class JsonGetter extends eventEmitter {
    constructor (api, options) {
        super();
        this.api = api;
        this.options = options;
    }
    start () {
        this.api(this.options).then((data) => {
            this.emit('data', data);
        });
    }
    destroy () {}
}

class AjaxGetter extends eventEmitter {
    constructor (api, options, loopDelay) {
        super();
        this.api = api;
        this.options = options;
        this.delay = loopDelay;
        this._token = null;
        this._timer = null;
    }
    start () {
        this._stop();
        this._query();
    }
    destroy () {
        this._stop();
    }
    _stop () {
        if(this._timer !== null) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        if(this._token !== null) {
            this._token.cancel();
            this._token = null;
        }
    }
    _query () {
        this._token = AjaxClient.createCancleToken();
        this.api(Object.assign({ cancelToken: this._token }, this.options)).then((data) => {
            this._token = null;
            this.emit('data', data);
            if(this.delay) {
                this._timer = setTimeout(() => {
                    this._timer = null;
                    this._query();
                }, this.delay);
            }
        }).catch(err => {
            this._token = null;
            if(AjaxClient.isCancel(err)) {
                this.emit('cancel', err);
            } else {
                this.emit('error', err);
                if(this.delay) {
                    this._timer = setTimeout(() => {
                        this._timer = null;
                        this._query();
                    }, this.delay);
                }
            }
        });
    }
}