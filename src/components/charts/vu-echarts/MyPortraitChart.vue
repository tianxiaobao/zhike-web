<script>
import BaseChart from './BaseChart';
import female from '@/assets/female.png';
import male from '@/assets/male.png';
import unknown from '@/assets/unknown.png';

export default {
    name: 'MyPortraitChart',
    mixins: [ BaseChart ],
    data () {
        const userInfo = this.$store.getters.profile;
        const userSex = userInfo.cpp_base_sex;
        const sexImg = userSex=='未知'?unknown:(userSex=="男"? male:female);
        return {
            initOption: {
                title: {
                    text: "我的画像",
                    top: "top",
                    left: "center"
                },
                tooltip: {
                    formatter: function (params) {
                        return params.name;
                    }
                },
                animationDuration: 3000,
                animationEasingUpdate: 'quinticInOut',
                series: [{
                    name: '我的画像',
                    type: 'graph',
                    layout: 'force',
                    force: {
                        repulsion: 2300
                    },
                    edgeLabel: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize: 10
                            },
                            formatter: "{c}"
                        }
                    },
                    data: [{
                        "name": "我的画像",
                        "symbol": 'image://'+sexImg,
                        "symbolSize": 100,
                        "draggable" : "true"
                    }, {
                        "name": "性别",
                        "symbolSize": 20,
                        "category": "性别",
                        "draggable": "true"
                    }, {
                        "name": "年龄",
                        "symbolSize": 20,
                        "category": "年龄",
                        "draggable": "true"
                    }, {
                        "name": "婚姻状态",
                        "symbolSize": 20,
                        "category": "婚姻状态",
                        "draggable": "true"
                    }, {
                        "name": "孩子年龄",
                        "symbolSize": 20,
                        "category": "孩子年龄",
                        "draggable": "true"
                    }, {
                        "name": "是否有孩子",
                        "symbolSize": 20,
                        "category": "是否有孩子",
                        "draggable": "true"
                    }, {
                        "name": "职业",
                        "symbolSize": 20,
                        "category": "职业",
                        "draggable": "true"
                    }, {
                        "name": "购买力",
                        "symbolSize": 20,
                        "category": "购买力",
                        "draggable": "true"
                    }, {
                        "name": "促销敏感度",
                        "symbolSize": 20,
                        "category": "促销敏感度",
                        "draggable": "true"
                    }, {
                        "name": "客户价值",
                        "symbolSize": 20,
                        "category": "客户价值",
                        "draggable": "true"
                    }],
                    links: [{
                        "source": "我的画像",
                        "target": "性别",
                        "value":userInfo.cpp_base_sex
                    }, {
                        "source": "我的画像",
                        "target": "年龄",
                        "value":userInfo.cpp_base_age
                    },{
                        "source": "我的画像",
                        "target": "婚姻状态",
                        "value":userInfo.cpp_base_marriage
                    },{
                        "source": "我的画像",
                        "target": "孩子年龄",
                        "value":userInfo.cpp_seni_childage
                    },{
                        "source": "我的画像",
                        "target": "是否有孩子",
                        "value":userInfo.cpp_seni_haschild
                    }, {
                        "source": "我的画像",
                        "target": "职业",
                        "value":userInfo.cpp_base_profession
                    }, {
                        "source": "我的画像",
                        "target": "购买力",
                        "value":userInfo.cgp_cust_purchpower
                    }, {
                        "source": "我的画像",
                        "target": "促销敏感度",
                        "value":userInfo.cfv_sens_promotion
                    }, {
                        "source": "我的画像",
                        "target": "客户价值",
                        "value":userInfo.cvl_rfm_all_group
                    }],
                    categories: [{
                        'name': '性别'
                    }, {
                        'name': '年龄'
                    }, {
                        'name': '婚姻状态'
                    }, {
                        'name': '孩子年龄'
                    }, {
                        'name': '是否有孩子'
                    }, {
                        'name': '职业'
                    }, {
                        'name': '购买力'
                    }, {
                        'name': '促销敏感度'
                    }, {
                        'name': '客户价值'
                    }],
                    focusNodeAdjacency: true,
                    roam: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: 'source',
                            curveness: 0,
                            type: "solid"
                        }
                    }
                }]
            }
        };
    }
};
</script>
