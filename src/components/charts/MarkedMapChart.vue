<template>
    <div id="marked-map-container" class="marked-map-chart">
    </div>
</template>

<script>
import centerIcon from '@/assets/map_poi.png';
export default {
    props: ['data', 'distance', 'center'],
    data () {
        return {
            map: null,
            centerPoint: null,
            infoWindow: null
        };
    },
    mounted () {
        const center = this.center, distance = this.distance;
        const map = this.map = new BMap.Map("marked-map-container");
        const point = this.centerPoint = new BMap.Point(center.lng, center.lat);
        this.infoWindow = new BMap.InfoWindow('', {
            width: 0,
            offset: new BMap.Size(0, -5),
            enableMessage: false
        });
        if (distance > 3) {
            map.centerAndZoom(point, 13);
        } else {
            map.centerAndZoom(point, 14);
        }
        map.enableScrollWheelZoom();
        this.setData();
    },
    watch: {
        data () {
            this.setData();
        },
        distance () {
            this.setData();
        }
    },
    methods: {
        setData () {
            const map = this.map,
                centerPoint = this.centerPoint,
                distance = this.distance,
                data = this.data;
            if (!map) {
                return;
            }
            map.clearOverlays();
            if (distance && centerPoint) {
                // console.log(icon);
                const icon = new BMap.Icon(centerIcon, new BMap.Size(28, 76));
                const centerMarker = new BMap.Marker(centerPoint, { icon });
                const circle = new BMap.Circle(centerPoint, distance * 1000, { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 0.5 });
                map.addOverlay(centerMarker);
                map.addOverlay(circle);
            }
            // console.log(new Date().valueOf());
            if (data) {
                const points = data.map(item => {
                    if (item.lng && item.lat) {
                        const point = new BMap.Point(item.lng, item.lat);
                        point.item = item;
                        return point;
                    }
                    return null;
                }).filter(point => point !== null);
                const pointCollection = new BMap.PointCollection(points, {
                    shape: BMAP_POINT_SHAPE_WATERDROP
                });
                pointCollection.addEventListener('click', e => {
                    this.showInfoWindow(e.point.item);
                });
                map.addOverlay(pointCollection);
            }
            // console.log(new Date().valueOf());
        },
        showInfoWindow (item) {
            const infoWindow = this.infoWindow;
            const map = this.map;
            if (!map || !infoWindow) {
                return;
            }
            infoWindow.setTitle(item.name);
            infoWindow.setContent(this.getInfoWindowContent(item));
            const point = new BMap.Point(item.lng, item.lat);
            map.openInfoWindow(infoWindow, point);
        },
        getInfoWindowContent (item) {
            const f = new Function('address', 'distance', 'return `地址:${address}</br>距离:${distance}米`');
            return f(item.address, item.distance);
        },
        scrollToMe () {
            // console.log(this.$el);
            const delay = 300;
            const fps = 60;

            let from = document.body.scrollTop || document.documentElement.scrollTop;
            const to = this.$el.offsetTop - 70;
            
            if(from <= to) {
                return;
            }
            
            const stepTime = Math.floor(1000 / fps);
            const diff = Math.floor((to - from) * stepTime / delay);
            function stepFunc () {
                setTimeout(function () {
                    if (Math.abs(to - from) > Math.abs(diff)) {
                        from += diff;
                        scrollTo(0, from);
                        stepFunc();
                    } else {
                        from = to;
                        scrollTo(0, from);
                    }
                }, stepTime);
            }
            stepFunc();
            // scrollTo(0, top);
        }
    }
};
</script>

<style>
.marked-map-chart {
    height: 318px;
}
</style>