<template>
    <div class="heat-map-chart">
        <div id="heatmap-container" class="heat-map-chart"></div>
        <div id="heatmap-legend" class="heatmap-legend"></div>
    </div>
</template>

<script>
import centerIcon from '@/assets/map_poi.png';
const ak = 'gH2cGjKGK0C5eL9xINOGDEPiTGT5XcLf';
export default {
    props: ['data', 'center', 'radius'],
    data () {
        return {
            init: true,
            map: null,
            heatmapOverlay: null,
            centerMarker: null,
            radiusOverlay: null
        };
    },
    mounted () {
        this.fetchBMap().then(BMap => {
            this.map = new BMap.Map("heatmap-container", {
                minZoom: 5,
                maxZoom: 17
            });
            return this.fetchHeatMap();
        }).then(() => {
            if (this.center) {
                this.setCenter();
            }
        });
    },
    watch: {
        data () {
            this.setData();
        },
        center () {
            this.setCenter();
        },
        radius () {
            this.setRadius();
        }
    },
    methods: {
        setData () {
            // console.log(this.data);
            const map = this.map, data = this.data;
            let heatmapOverlay = this.heatmapOverlay;
            if (this.init || !map || !data) {
                return;
            }
            if (!heatmapOverlay) {
                heatmapOverlay = this.heatmapOverlay = new BMapLib.HeatmapOverlay({
                    radius: 18,
                    minOpacity: 0.1,
                    legend: {
                        title: '',
                        position: 'rb',
                        ticks: 5,
                        element: document.getElementById('heatmap-legend')
                    }
                });
                map.addOverlay(heatmapOverlay);
            }
            const max = Math.max(...data.series.map(p => p.count));
            // const max = 1;
            heatmapOverlay.setDataSet({ data: data.series, max: max });
        },
        setCenter () {
            // console.log(this.center);
            const map = this.map, center = this.center;
            if (!map || !center) {
                return;
            }
            if (this.centerMarker) {
                map.removeOverlay(this.centerMarker);
                this.centerMarker = null;
            }
            const point = new BMap.Point(center.lng, center.lat);
            const icon = new BMap.Icon(centerIcon, new BMap.Size(28, 76));
            const centerMarker = this.centerMarker = new BMap.Marker(point, { icon });

            map.addOverlay(centerMarker);
            // map.centerAndZoom(point, 13);
            map.enableScrollWheelZoom();
            this.setRadius();
            if (this.init) {
                this.init = false;
                this.setData();
            }
        },
        setRadius () {
            // console.log(this.center);
            const map = this.map, center = this.center, radius = this.radius;
            if (!map || !center || !radius) {
                return;
            }
            if (this.radiusOverlay) {
                map.removeOverlay(this.radiusOverlay);
                this.radiusOverlay = null;
            }
            const point = new BMap.Point(center.lng, center.lat);
            const circle = this.radiusOverlay = new BMap.Circle(point, radius * 1000, { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 0.5 });
            map.addOverlay(circle);
            let zoom = 14;
            switch(radius) {
            case(3):
                zoom= 14;
                break;
            case(5):
                zoom= 13;
                break;
            case(20):
                zoom = 11;
                break;
            }
            map.centerAndZoom(point, zoom);
        },
        fetchBMap () {
            if (!global.BMap) {
                const _loader = new Promise(resolve => {
                    global._initBMap = () => {
                        resolve(global.BMap);
                        global._initBMap = null;
                        global.BMap._loader = null;
                    };
                    const script = document.createElement("script");
                    script.src = `https://api.map.baidu.com/api?v=2.0&ak=${ak}&callback=_initBMap`;
                    document.body.appendChild(script);
                });
                global.BMap = {
                    _loader
                };
                return _loader;
            } else if (global.BMap._loader) {
                return global.BMap._loader;
            } else {
                return Promise.resolve(global.BMap);
            }
        },
        fetchHeatMap () {
            return import('./lib/heatmap.js');
        }
    }
};
</script>

<style>
.heat-map-chart {
    height: 500px;
    position: relative;
}

.heatmap-legend {
    position: absolute;
    right: 0;
    bottom: 0;
}
</style>
