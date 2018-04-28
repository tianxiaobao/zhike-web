<style scoped lang="scss" type="text/scss">
    @mixin normal-flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @mixin normal-transition {
        transition: all .2s;
    }

    $border-style: 1px solid #eee;
    .photo-gallery-container {
        display: flex;
        flex-direction: column;

        .slider-item {
            &:hover {
                cursor: pointer;
                background-color: #eee;
            }
            min-height: 40px;
            display: flex;
            color: #444;
            box-sizing: border-box;
            border-bottom: $border-style;
            @include normal-transition;

            &.slide-placeholder {
                width: 100%;
                position: absolute;
                opacity: .1;
            }

            &.is-dragging:hover {
                cursor: default;
                background-color: #fff;
            }

            &.frozen-row {
                border-color: #aaa;
                .block-item {
                    border-right: none !important;

                    &:hover {
                        cursor: default !important;
                    }
                }
            }

            .block-item {
                font-size: 13px;
                overflow: hidden;

                span {
                    font-size: 13px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                &:not(:last-child) {
                    box-sizing: border-box;
                    border-right: $border-style;
                }
            }

            .block-item:nth-child(1) {
                width: 100px;
                @include normal-flex-center;
            }
            .block-item:nth-child(3),
            .block-item:nth-child(4),
            .block-item:nth-child(5) {
                width: 50px;
                @include normal-flex-center;
            }
            .block-item.delete-item {
                .icon {
                    font-size: 12px;
                    color: #999;
                    @include normal-transition;
                }
                &:hover {
                    cursor: pointer;
                    .icon {
                        color: #e00;
                    }
                }
            }
            .block-item:nth-child(2) {
                flex: 1;
                overflow: hidden;
                box-sizing: border-box;
                padding: 0 20px;
                @include normal-flex-center;
            }
        }

        .slider-container {
            flex: 1;
            overflow: auto;
            position: relative;

            &::-webkit-scrollbar {
                width: 2px;
                height: 2px;
            }
            &::-webkit-scrollbar-thumb {
                border-radius: 10px;
                background: rgba(133, 144, 166, .5);
            }
        }
    }
</style>

<template>
    <div class="photo-gallery-container">
        <!--固定栏-->
        <div class="frozen-row slider-item">
            <div class="block-item">
                <span class="zhike-global-ellipsis">大小</span>
            </div>
            <div class="block-item">
                <span class="zhike-global-ellipsis">照片名称</span>
            </div>
            <div class="block-item">序号</div>
            <div class="block-item delete-item">删除</div>
            <div class="block-item">
                调节
            </div>
        </div>

        <!--可滑动栏-->
        <div class="slider-container" ref="sliderContainer" @scroll="onscroll">
            <!--拖拽时的站位格-->
            <div class="slider-item slide-placeholder" v-if="willDragAtIndex !== -1"
                 :style="{
                    'top': 39 * willDragAtIndex + 'px'
                 }"
            >
                <div class="block-item">
                    <span>{{ draggingPhotoObj.humanizedSize }}</span>
                </div>
                <div class="block-item">
                    <span>{{ draggingPhotoObj.name }}</span>
                </div>
                <div class="block-item"> -</div>
                <div class="block-item delete-item">
                    -
                </div>
                <div class="block-item">
                    -
                </div>
            </div>
            <!--其他格-->
            <div class="slider-item"
                 :class="{'will-be-drag': dragFromIndex === index, 'is-dragging': isDragging}"
                 :style="{
                    'margin-top': willDragAtIndex === index ? '39px' : '-1px',
                    'margin-bottom': willDragAtIndex === photoListCopy.length && index === photoListCopy.length - 1 ? '39px' : '0px'
                 }"
                 :draggable="photoListCopy.length <= 1 ? false : true"
                 @dragover="ondragover" @dragstart="ondragstart" @dragend="ondragend"
                 v-for="(photo, index) in photoListCopy">
                <div class="block-item">
                    <span>{{ photo.humanizedSize }}</span>
                </div>
                <div class="block-item">
                    <span>{{ photo.name }}</span>
                </div>
                <div class="block-item">{{ willDragAtIndex >= 0 && index >= willDragAtIndex ? index + 2 : index + 1 }}
                </div>
                <div class="block-item delete-item" @click.stop="deleteItem(index)">
                    <i class="icon">&#xe602;</i>
                </div>
                <div class="block-item">
                    <i class="icon">&#xe618;</i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import throttle from '../../../throttle';

    export default {
        name: '',
        props: {
            scrollTop: 0
        },
        data () {
            return {
                // photoListCopy: [],
                sliderAnchorTop: null,
                dragFromIndex: -1,
                willDragAtIndex: -1,
                draggingPhotoObj: {},
                ondragover: throttle(this.ondragoverMethod, 0, 200),
                onscroll: throttle(this.onscrollMethod, 0, 50),
                isDragging: false
            };
        },
        computed: {
            photoListCopy () {
                return this.$store.state.vision.photoStorage;
            }
        },
        watch: {
            scrollTop (val) {
                this.$refs.sliderContainer.scrollTop = val;
            }
        },
        mounted () {
            this.sliderAnchorTop = getAbsoluteTop(this.$refs.sliderContainer);
        },
        methods: {
            ondragstart (e) {
                const pointTop = e.clientY;
                const anchorScrollTop = this.$refs.sliderContainer.scrollTop;
                const index = calcWillDragAtIndex(pointTop + anchorScrollTop, this.sliderAnchorTop);
                this.dragFromIndex = index;
                this.draggingPhotoObj = this.photoListCopy[index];
                setTimeout(() => {
                    this.$store.commit('vision/splicePhotoStorage', {
                        index: index,
                        willDelete: 1
                    });
                }, 50);
                this.isDragging = true;
            },
            ondragoverMethod (e) {
                const pointTop = e.clientY;
                const anchorScrollTop = this.$refs.sliderContainer.scrollTop;
                const index = calcWillDragAtIndex(pointTop + anchorScrollTop, this.sliderAnchorTop);
                // const fromIndex = this.dragFromIndex;
                if (index === this.photoListCopy.length) {
                    this.willDragAtIndex = this.photoListCopy.length;
                    return;
                }
                this.willDragAtIndex = index;
            },
            ondragend () {
                const index = this.willDragAtIndex;
                if (index === -1 || this.dragFromIndex === -1) {
                    this.dragFromIndex = -1;
                    this.willDragAtIndex = -1;
                    return;
                }
                this.$store.commit('vision/splicePhotoStorage', {
                    index: index,
                    willDelete: 0,
                    willInsert: this.draggingPhotoObj
                });
                this.dragFromIndex = -1;
                this.willDragAtIndex = -1;
                this.isDragging = false;
            },
            deleteItem (index) {
                this.$store.commit('vision/splicePhotoStorage', {
                    index: index,
                    willDelete: 1
                });
            },
            onscrollMethod () {
                this.$emit('scrolling', this.$refs.sliderContainer.scrollTop);
            }
        }
    };

    function calcWillDragAtIndex (top, anchorTop) {
        const index = Math.abs(+((top - anchorTop - 39 / 2) / 39).toFixed(0));
        return index;
    }

    function getAbsoluteTop (e) {
        let offset = e.offsetTop;
        if (e.offsetParent != null) {
            offset += getAbsoluteTop(e.offsetParent);
        }
        return offset;
    }
</script>