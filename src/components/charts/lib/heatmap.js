/* eslint-disable */
/**
 * @fileoverview 百度地图的热力图功能,对外开放。
 * 主要基于http://www.patrick-wied.at/static/heatmapjs/index.html 修改而得


/*==============================以下部分为heatmap.js的核心代码,只负责热力图的展现, 代码来自第三方====================================*/

/*
 * heatmap.js 1.0 -    JavaScript Heatmap Library
 *
 * Copyright (c) 2011, Patrick Wied (http://www.patrick-wied.at)
 * Dual-licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and the Beerware (http://en.wikipedia.org/wiki/Beerware) license.
 */

(function (w) {
    // the heatmapFactory creates heatmap instances
    const heatmapFactory = (function () {
    // store object constructor
    // a heatmap contains a store
    // the store has to know about the heatmap in order to trigger heatmap updates when datapoints get added
        const store = function store (hmap) {
            const _ = {
            // data is a two dimensional array
            // a datapoint gets saved as data[point-x-value][point-y-value]
            // the value at [point-x-value][point-y-value] is the occurrence of the datapoint
                data: [],
            // tight coupling of the heatmap object
                heatmap: hmap
            };
        // the max occurrence - the heatmaps radial gradient alpha transition is based on it
            this.max = 1;

            this.get = function (key) {
                return _[key];
            };
            this.set = function (key, value) {
                _[key] = value;
            };
        };

        store.prototype = {
        // function for adding datapoints to the store
        // datapoints are usually defined by x and y but could also contain a third parameter which represents the occurrence
            addDataPoint: function (x, y) {
                if(x < 0 || y < 0)
                    return;

                let me = this,
                    heatmap = me.get("heatmap"),
                    data = me.get("data");

                if(!data[x])
                    data[x] = [];

                if(!data[x][y])
                    data[x][y] = 0;

            // if count parameter is set increment by count otherwise by 1
                data[x][y]+=(arguments.length<3)?1:arguments[2];
            
                me.set("data", data);
            // do we have a new maximum?
                if(me.max < data[x][y]) {
                // max changed, we need to redraw all existing(lower) datapoints
                    heatmap.get("actx").clearRect(0,0,heatmap.get("width"),heatmap.get("height"));
                    me.setDataSet({ max: data[x][y], data: data }, true);
                    return;
                }
                heatmap.drawAlpha(x, y, data[x][y], true);
            },
            setDataSet: function (obj, internal) {
                let me = this,
                    heatmap = me.get("heatmap"),
                    data = [],
                    d = obj.data,
                    dlen = d.length;
            // clear the heatmap before the data set gets drawn
                heatmap.clear();
                this.max = obj.max;
            // if a legend is set, update it
                heatmap.get("legend") && heatmap.get("legend").update(obj.max);
            
                if(internal != null && internal) {
                    for(const one in d) {
                    // jump over undefined indexes
                        if(one === undefined)
                            continue;
                        for(const two in d[one]) {
                            if(two === undefined)
                                continue;
                        // if both indexes are defined, push the values into the array
                            heatmap.drawAlpha(one, two, d[one][two], false);   
                        }
                    }
                }else{
                    while(dlen--) {
                        const point = d[dlen];
                        heatmap.drawAlpha(point.x, point.y, point.count, false);
                        if(!data[point.x])
                            data[point.x] = [];

                        if(!data[point.x][point.y])
                            data[point.x][point.y] = 0;

                        data[point.x][point.y] = point.count;
                    }
                }
                heatmap.colorize();
                this.set("data", d);
            },
            exportDataSet: function () {
                let me = this,
                    data = me.get("data"),
                    exportData = [];

                for(const one in data) {
                // jump over undefined indexes
                    if(one === undefined)
                        continue;
                    for(const two in data[one]) {
                        if(two === undefined)
                            continue;
                    // if both indexes are defined, push the values into the array
                        exportData.push({x: parseInt(one, 10), y: parseInt(two, 10), count: data[one][two]});
                    }
                }

                return { max: me.max, data: exportData };
            },
            generateRandomDataSet: function (points) {
                let heatmap = this.get("heatmap"),
                    w = heatmap.get("width"),
                    h = heatmap.get("height");
                let randomset = {},
                    max = Math.floor(Math.random()*1000+1);
                randomset.max = max;
                const data = [];
                while(points--) {
                    data.push({x: Math.floor(Math.random()*w+1), y: Math.floor(Math.random()*h+1), count: Math.floor(Math.random()*max+1)});
                }
                randomset.data = data;
                this.setDataSet(randomset);
            }
        };

        const legend = function legend (config) {
            this.config = config;

            const _ = {
                element: null,
                labelsEl: null,
                gradientCfg: null,
                ctx: null
            };
            this.get = function (key) {
                return _[key];
            };
            this.set = function (key, value) {
                _[key] = value;
            };
            this.init();
        };
        legend.prototype = {
            init: function () {
                let me = this,
                    config = me.config,
                    title = config.title || "",
                    container = config.element,
                    position = config.position,
                    offset = config.offset || 10,
                    gconfig = config.gradient,
                    ticks = config.ticks || 5,
                    labelsEl = document.createElement("ul"),
                    labelsHtml = "",
                    grad, element, gradient, gradientCv, positionCss = "";

                me.set('ticks', ticks);
                me.processGradientObject();
            
            // Positioning

            // top or bottom
                if(position.indexOf('t') > -1) {
                    positionCss += 'top:'+offset+'px;';
                }else{
                    positionCss += 'bottom:'+offset+'px;';
                }

            // left or right
                if(position.indexOf('l') > -1) {
                    positionCss += 'left:'+offset+'px;';
                }else{
                    positionCss += 'right:'+offset+'px;';
                }

                element = document.createElement("div");
                element.style.cssText = "border-radius:5px;position:absolute;"+positionCss+"font-family:Helvetica; width:256px;z-index:10000000000; background:rgba(255,255,255,1);padding:10px;border:1px solid black;margin:0;";
                element.innerHTML = "<h3 style='padding:0;margin:0;text-align:center;font-size:16px;'>"+title+"</h3>";
            // create gradient in canvas
                labelsEl.style.cssText = "position:relative;font-size:12px;display:block;list-style:none;list-style-type:none;margin:0;height:15px;";
            

            // create gradient element
                gradientCv = me.createGradientImage();
                
                gradient = document.createElement("div");
                gradient.style.cssText = ["position:relative;display:block;width:256px;height:15px;border-bottom:1px solid black; background-image:url(",gradientCv.toDataURL(),");"].join("");

                element.appendChild(labelsEl);
                element.appendChild(gradient);
            
                me.set("element", element);
                me.set("labelsEl", labelsEl);
                me.set("gradientCt", gradient);
                me.set("gradientCv", gradientCv);


                if(container) {
                    container.appendChild(element);
                    me.set("container", container);
                }
                me.update(1);
            },
            processGradientObject: function () {
            // create array and sort it
                let me = this,
                    gradientConfig = this.config.gradient,
                    gradient = {};

                for(const key in gradientConfig) {
                    if(gradientConfig.hasOwnProperty(key)) {
                        gradient[key] = gradientConfig[key];
                    }
                }
                if(!gradient[0]) {
                    gradient[0] = 'rgba(0,0,0,0)';
                }

                me.set("gradient", gradient);
            },
            createGradientImage: function () {
                let me = this,
                    gradient = me.get("gradient"),
                    canvas = document.createElement("canvas"),
                    ctx = canvas.getContext("2d"),
                    grad;
            // the gradient in the legend including the ticks will be 256x15px
                canvas.width = "256";
                canvas.height = "15";

                grad = ctx.createLinearGradient(0,5,256,10);

                for(const stop in gradient) {
                    grad.addColorStop(stop, gradient[stop]);
                }

                ctx.fillStyle = grad;
                ctx.fillRect(0,5,256,10);
                ctx.strokeStyle = "black";
                ctx.beginPath();
 
                
                // ctx.moveTo(255.5, 5);
                // ctx.lineTo(255.5, 15);
                ctx.moveTo(255.5, 4.5);
                ctx.lineTo(0, 4.5);
            
                ctx.stroke();

            // we re-use the context for measuring the legends label widths
                me.set("ctx", ctx);

                return canvas;
            },
            getElement: function () {
                return this.get("element");
            },
            hasContainer: function () {
                return this.get("container") !== undefined;
            },
            update: function (max) {
                let me = this,
                    gradient = me.get("gradient"),
                    ticks = me.get("ticks"),
                    ctx = me.get("ctx"),
                    gradientCt = me.get("gradientCt"),
                    gradientCv = me.get("gradientCv"),
                    labels = me.get("labelsEl"),
                    labelText, labelsHtml = "", offset, length;

                ctx.clearRect(1, 0, 255, 4.5);
                length = max+1 < ticks?max+1:ticks;

                for(let i = 0; i < length; i++) {
                    ctx.moveTo(((1/(length-1)*i*256) >> 0)+.5, 0);
                    ctx.lineTo(((1/(length-1)*i*256) >> 0)+.5, (i==0)?15:5);
                    labelText = (max * i / (length - 1)) >> 0;
                    // console.log(labelText);
                    offset = (ctx.measureText(labelText).width/2) >> 0;

                    if(i == 0) {
                        offset = 0;
                    }
                    if(i == gradient.length-1) {
                        offset *= 2;
                    }
                    labelsHtml += '<li style="position:absolute;left:'+(((((1/(length-1)*i*256) || 0)) >> 0)-offset+.5)+'px">'+labelText+'</li>';
                }
                ctx.moveTo(255.5, 0);
                ctx.lineTo(255.5, 15);
                ctx.stroke();
                gradientCt.style.cssText = ["position:relative;display:block;width:256px;height:15px;border-bottom:1px solid black; background-image:url(",gradientCv.toDataURL(),");"].join("");
                labels.innerHTML = labelsHtml;
            }
        };

    // heatmap object constructor
        const heatmap = function heatmap (config) {
        // private variables
            const _ = {
                radius : 40,
                element : {},
                canvas : {},
                acanvas: {},
                ctx : {},
                actx : {},
                legend: null,
                visible : true,
                width : 0,
                height : 0,
                max : false,
                gradient : false,
                opacity: 180,
                minOpacity: 0,
                premultiplyAlpha: false,
                bounds: {
                    l: 1000,
                    r: 0,
                    t: 1000,
                    b: 0
                },
                debug: false
            };
        // heatmap store containing the datapoints and information about the maximum
        // accessible via instance.store
            this.store = new store(this);

            this.get = function (key) {
                return _[key];
            };
            this.set = function (key, value) {
                _[key] = value;
            };
        // configure the heatmap when an instance gets created
            this.configure(config);
        // and initialize it
            this.init();
        };

    // public functions
        heatmap.prototype = {
            configure: function (config) {
                let me = this,
                    rout, rin;

                me.set("radius", config["radius"] || 40);
                me.set("element", (config.element instanceof Object)?config.element:document.getElementById(config.element));
                me.set("visible", (config.visible != null)?config.visible:true);
                me.set("max", config.max || false);
                me.set("gradient", config.gradient || { 0.45: "rgb(0,0,255)", 0.55: "rgb(0,255,255)", 0.65: "rgb(0,255,0)", 0.95: "yellow", 1.0: "rgb(255,0,0)"});    // default is the common blue to red gradient
                me.set("opacity", parseInt(255*config.opacity, 10) || 180);
                me.set("minOpacity", parseInt(255*config.minOpacity, 10) || 0);
                me.set("width", config.width || 0);
                me.set("height", config.height || 0);
                me.set("debug", config.debug);
                
                if(config.legend) {
                    const legendCfg = config.legend;
                    legendCfg.gradient = me.get("gradient");
                    me.set("legend", new legend(legendCfg));
                }
            },
            resize: function () {
                let me = this,
                    element = me.get("element"),
                    canvas = me.get("canvas"),
                    acanvas = me.get("acanvas");
                canvas.width = acanvas.width = me.get("width") || element.style.width.replace(/px/, "") || me.getWidth(element);
                this.set("width", canvas.width);
                canvas.height = acanvas.height = me.get("height") || element.style.height.replace(/px/, "") || me.getHeight(element);
                this.set("height", canvas.height);
            },

            init: function () {
                let me = this,
                    canvas = document.createElement("canvas"),
                    acanvas = document.createElement("canvas"),
                    ctx = canvas.getContext("2d"),
                    actx = acanvas.getContext("2d"),
                    element = me.get("element");

                
                me.initColorPalette();

                me.set("canvas", canvas);
                me.set("ctx", ctx);
                me.set("acanvas", acanvas);
                me.set("actx", actx);

                me.resize();
                canvas.style.cssText = acanvas.style.cssText = "position:absolute;top:0;left:0;z-index:10000000;";
                
                if(!me.get("visible"))
                    canvas.style.display = "none";

                element.appendChild(canvas);
                if(me.get("legend") && !me.get("legend").hasContainer()) {
                    element.appendChild(me.get("legend").getElement());
                }
                
                // debugging purposes only
                if(me.get("debug"))
                    document.body.appendChild(acanvas);
                
                actx.shadowOffsetX = 15000; 
                actx.shadowOffsetY = 15000; 
                actx.shadowBlur = 15; 
            },
            initColorPalette: function () {
                let me = this,
                    canvas = document.createElement("canvas"),
                    gradient = me.get("gradient"),
                    ctx, grad, testData;

                canvas.width = "1";
                canvas.height = "256";
                ctx = canvas.getContext("2d");
                grad = ctx.createLinearGradient(0,0,1,256);

            // Test how the browser renders alpha by setting a partially transparent pixel
            // and reading the result.  A good browser will return a value reasonably close
            // to what was set.  Some browsers (e.g. on Android) will return a ridiculously wrong value.
                testData = ctx.getImageData(0,0,1,1);
                testData.data[0] = testData.data[3] = 64; // 25% red & alpha
                testData.data[1] = testData.data[2] = 0; // 0% blue & green
                ctx.putImageData(testData, 0, 0);
                testData = ctx.getImageData(0,0,1,1);
                me.set("premultiplyAlpha", (testData.data[0] < 60 || testData.data[0] > 70));
            
                for(const x in gradient) {
                    grad.addColorStop(x, gradient[x]);
                }

                ctx.fillStyle = grad;
                ctx.fillRect(0,0,1,256);

                me.set("gradient", ctx.getImageData(0,0,1,256).data);
            },
            getWidth: function (element) {
                let width = element.offsetWidth;
                if(element.style.paddingLeft) {
                    width+=element.style.paddingLeft;
                }
                if(element.style.paddingRight) {
                    width+=element.style.paddingRight;
                }

                return width;
            },
            getHeight: function (element) {
                let height = element.offsetHeight;
                if(element.style.paddingTop) {
                    height+=element.style.paddingTop;
                }
                if(element.style.paddingBottom) {
                    height+=element.style.paddingBottom;
                }

                return height;
            },
            colorize: function (x, y) {
                // get the private variables
                let me = this,
                    width = me.get("width"),
                    radius = me.get("radius"),
                    height = me.get("height"),
                    actx = me.get("actx"),
                    ctx = me.get("ctx"),
                    x2 = radius * 3,
                    premultiplyAlpha = me.get("premultiplyAlpha"),
                    palette = me.get("gradient"),
                    opacity = me.get("opacity"),
                    bounds = me.get("bounds"),
                    left, top, bottom, right, 
                    image, imageData, length, alpha, offset, finalAlpha;
                
                if(x != null && y != null) {
                    if(x+x2>width) {
                        x=width-x2;
                    }
                    if(x<0) {
                        x=0;
                    }
                    if(y<0) {
                        y=0;
                    }
                    if(y+x2>height) {
                        y=height-x2;
                    }
                    left = x;
                    top = y;
                    right = x + x2;
                    bottom = y + x2;
                }else{
                    if(bounds['l'] < 0) {
                        left = 0;
                    }else{
                        left = bounds['l'];
                    }
                    if(bounds['r'] > width) {
                        right = width;
                    }else{
                        right = bounds['r'];
                    }
                    if(bounds['t'] < 0) {
                        top = 0;
                    }else{
                        top = bounds['t'];
                    }
                    if(bounds['b'] > height) {
                        bottom = height;
                    }else{
                        bottom = bounds['b'];
                    }    
                }

                image = actx.getImageData(left, top, right-left, bottom-top);
                imageData = image.data;
                length = imageData.length;
                // loop thru the area
                for(let i=3; i < length; i+=4) {
                    // [0] -> r, [1] -> g, [2] -> b, [3] -> alpha
                    alpha = imageData[i],
                    offset = alpha*4;

                    if(!offset)
                        continue;

                    // we ve started with i=3
                    // set the new r, g and b values
                    finalAlpha = (alpha < opacity)?alpha:opacity;
                    imageData[i-3]=palette[offset];
                    imageData[i-2]=palette[offset+1];
                    imageData[i-1]=palette[offset+2];
                    
                    if (premultiplyAlpha) {
                    	// To fix browsers that premultiply incorrectly, we'll pass in a value scaled
                    	// appropriately so when the multiplication happens the correct value will result.
                    	imageData[i-3] *= finalAlpha/255;
                    	imageData[i-2] *= finalAlpha/255;
                    	imageData[i-1] *= finalAlpha/255;
                    }
                    
                    // we want the heatmap to have a gradient from transparent to the colors
                    // as long as alpha is lower than the defined opacity (maximum), we'll use the alpha value
                    imageData[i] = finalAlpha;
                }
                // the rgb data manipulation didn't affect the ImageData object(defined on the top)
                // after the manipulation process we have to set the manipulated data to the ImageData object
                // image.data = imageData;
                ctx.putImageData(image, left, top);
            },
            drawAlpha: function (x, y, count, colorize) {
                // storing the variables because they will be often used
                let me = this,
                    radius = me.get("radius"),
                    ctx = me.get("actx"),
                    max = me.get("max"),
                    minOpacity = me.get("minOpacity"),
                    bounds = me.get("bounds"),
                    xb = x - (1.5 * radius) >> 0, yb = y - (1.5 * radius) >> 0,
                    xc = x + (1.5 * radius) >> 0, yc = y + (1.5 * radius) >> 0;

                ctx.shadowColor = ('rgba(0,0,0,'+((count)?Math.max(minOpacity/255, count/me.store.max):'0.1')+')');

                ctx.shadowOffsetX = 15000; 
                ctx.shadowOffsetY = 15000; 
                ctx.shadowBlur = 15; 

                ctx.beginPath();
                ctx.arc(x - 15000, y - 15000, radius, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
                if(colorize) {
                    // finally colorize the area
                    me.colorize(xb,yb);
                }else{
                    // or update the boundaries for the area that then should be colorized
                    if(xb < bounds["l"]) {
                        bounds["l"] = xb;
                    }
                    if(yb < bounds["t"]) {
                        bounds["t"] = yb;
                    }
                    if(xc > bounds['r']) {
                        bounds['r'] = xc;
                    }
                    if(yc > bounds['b']) {
                        bounds['b'] = yc;
                    }
                }
            },
            toggleDisplay: function () {
                let me = this,
                    visible = me.get("visible"),
                    canvas = me.get("canvas");

                if(!visible)
                    canvas.style.display = "block";
                else
                    canvas.style.display = "none";

                me.set("visible", !visible);
            },
        // dataURL export
            getImageData: function () {
                return this.get("canvas").toDataURL();
            },
            clear: function () {
                let me = this,
                    w = me.get("width"),
                    h = me.get("height");

                me.store.set("data",[]);
            // @TODO: reset stores max to 1
            // me.store.max = 1;
                me.get("ctx").clearRect(0,0,w,h);
                me.get("actx").clearRect(0,0,w,h);
            },
            cleanup: function () {
                const me = this;
                me.get("element").removeChild(me.get("canvas"));
            }
        };

        return {
            create: function (config) {
                return new heatmap(config);
            }, 
            util: {
                mousePosition: function (ev) {
                    // this doesn't work right
                    // rather use
                    /*
                        // this = element to observe
                        var x = ev.pageX - this.offsetLeft;
                        var y = ev.pageY - this.offsetTop;

                    */
                    let x, y;

                    if (ev.layerX) { // Firefox
                        x = ev.layerX;
                        y = ev.layerY;
                    } else if (ev.offsetX) { // Opera
                        x = ev.offsetX;
                        y = ev.offsetY;
                    }
                    if(typeof(x)=='undefined')
                        return;

                    return [x,y];
                }
            }
        };
    })();
    w.h337 = w.heatmapFactory = heatmapFactory;
})(window);


/* ==============================以上部分为heatmap.js的核心代码,只负责热力图的展现====================================*/


/* ==============================以下部分为专为百度地图打造的覆盖物===================================================*/
/**
 * @fileoverview 百度地图的热力图功能,对外开放。
 * 主要基于http://www.patrick-wied.at/static/heatmapjs/index.html 修改而得
 
 * 主入口类是<a href="symbols/BMapLib.Heatmap.html">Heatmap</a>，
 * 基于Baidu Map API 2.0。
 *
 * @author Baidu Map Api Group
 * @version 1.0
 */

/**
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = window.BMapLib = BMapLib || {};


(function () {
    /** 
     * @exports HeatmapOverlay as BMapLib.HeatmapOverlay 
     */
    const HeatmapOverlay = 
    /**
     * 热力图的覆盖物
     * @class 热力图的覆盖物
     * 实例化该类后，使用map.addOverlay即可以添加势力图
     * 
     * @constructor
     * @param {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：<br />
     * {"<b>radius</b>" : {String} 热力图的半径,
     * <br />"<b>visible</b>" : {Number} 热力图是否显示,
     * <br />"<b>gradient</b>" : {JSON} 热力图的渐变区间,
     * <br />"<b>opacity</b>" : {Number} 势力的透明度,
     *
     * @example <b>参考示例：</b><br />
     * var map = new BMap.Map("container");<br />map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);<br />var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":10, "visible":true, "opacity":70});<br />heatmapOverlay.setDataSet(data);//data是热力图的详细数据
     */

    BMapLib.HeatmapOverlay = function (opts) {
        this.conf = opts;
        this.heatmap = null;
        this.latlngs = [];
        this.bounds = null;
    };

    HeatmapOverlay.prototype = new BMap.Overlay();

    HeatmapOverlay.prototype.initialize = function (map) {
        this._map = map;
        const el = document.createElement("div");
        el.style.position = "absolute";
        el.style.top = 0;
        el.style.left = 0;
        el.style.border = 0;
        el.style.width = this._map.getSize().width + "px";
        el.style.height = this._map.getSize().height + "px";
        this.conf.element = el;
        map.getPanes().mapPane.appendChild(el);
        this.heatmap = h337.create(this.conf);
        this._div = el;
        return el;
    };

    HeatmapOverlay.prototype.draw = function () {
        const currentBounds = this._map.getBounds();

        if (currentBounds.equals(this.bounds)) {
            return;
        }
        this.bounds = currentBounds;

        let ne = this._map.pointToOverlayPixel(currentBounds.getNorthEast()),
            sw = this._map.pointToOverlayPixel(currentBounds.getSouthWest()),
            topY = ne.y,
            leftX = sw.x,
            h = sw.y - ne.y,
            w = ne.x - sw.x;

        this.conf.element.style.left = leftX + 'px';
        this.conf.element.style.top = topY + 'px';
        this.conf.element.style.width = w + 'px';
        this.conf.element.style.height = h + 'px';
        this.heatmap.store.get("heatmap").resize();

        if (this.latlngs.length > 0) {
            this.heatmap.clear();

            let len = this.latlngs.length;
            const d = {
                max: this.heatmap.store.max,
                data: []
            };

            while (len--) {
                const latlng = this.latlngs[len].latlng;

                if (!currentBounds.containsPoint(latlng)) {
                    continue;
                }

                let divPixel = this._map.pointToOverlayPixel(latlng),
                    screenPixel = new BMap.Pixel(divPixel.x - leftX, divPixel.y - topY);
                const roundedPoint = this.pixelTransform(screenPixel);
                d.data.push({
                    x: roundedPoint.x,
                    y: roundedPoint.y,
                    count: this.latlngs[len].c
                });
            }
            this.heatmap.store.setDataSet(d);
        }
    };


    // 内部使用的坐标转化
    HeatmapOverlay.prototype.pixelTransform = function (p) {
        let w = this.heatmap.get("width"),
            h = this.heatmap.get("height");

        while (p.x < 0) {
            p.x += w;
        }

        while (p.x > w) {
            p.x -= w;
        }

        while (p.y < 0) {
            p.y += h;
        }

        while (p.y > h) {
            p.y -= h;
        }

        p.x = (p.x >> 0);
        p.y = (p.y >> 0);

        return p;
    };

    /**
     * 设置热力图展现的详细数据, 实现之后,即可以立刻展现 
     * @param {Json Object } data
     * {"<b>max</b>" : {Number} 权重的最大值,
     * <br />"<b>data</b>" : {Array} 坐标详细数据,格式如下 <br/>
     * {"lng":116.421969,"lat":39.913527,"count":3}, 其中<br/>
     * lng lat分别为经纬度, count权重值
     */
    HeatmapOverlay.prototype.setDataSet = function (data) {
        const currentBounds = this._map.getBounds();
        const mapdata = {
            max: data.max,
            data: []
        };
        let d = data.data,
            dlen = d.length;


        this.latlngs = [];

        while (dlen--) {
            const latlng = new BMap.Point(d[dlen].lng, d[dlen].lat);
            
            this.latlngs.push({
                latlng: latlng,
                c: d[dlen].count
            });

            if (!currentBounds.containsPoint(latlng)) {
                continue;
            }
            let divPixel = this._map.pointToOverlayPixel(latlng),
                leftX = this._map.pointToOverlayPixel(currentBounds.getSouthWest()).x,
                topY = this._map.pointToOverlayPixel(currentBounds.getNorthEast()).y,
                screenPixel = new BMap.Pixel(divPixel.x - leftX, divPixel.y - topY);
            const point = this.pixelTransform(screenPixel);

            mapdata.data.push({
                x: point.x,
                y: point.y,
                count: d[dlen].count
            });
        }
        this.heatmap.clear();
        this.heatmap.store.setDataSet(mapdata);
    };

    /**
     * 添加势力图的详细坐标点
     * @param {Number} lng 经度坐标
     * @param {Number} lat 经度坐标
     * @param {Number} count 经度坐标
     */
    HeatmapOverlay.prototype.addDataPoint = function (lng, lat, count) {
        let latlng = new BMap.Point(lng, lat),
            point = this.pixelTransform(this._map.pointToOverlayPixel(latlng));

        this.heatmap.store.addDataPoint(point.x, point.y, count);
        this.latlngs.push({
            latlng: latlng,
            c: count
        });
    };

    /**
     * 更改势力图的展现或者关闭
     */
    HeatmapOverlay.prototype.toggle = function () {
        this.heatmap.toggleDisplay();
    };

    BMapLib.HeatmapOverlay = HeatmapOverlay; // 向命名空间注册.
})();
