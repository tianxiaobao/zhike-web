import * as types from '@/pages/index/router/route_types.js'; 

import * as authTypes from '@/pages/index/auth_types';

const config = [
    {
        title: '客流分析',
        icon: '&#xe70b;',
        children: [
            {
                title: '流量总览',
                routeName: types.CUSTOMER_FLOW_OVERVIEW,
                auth: [ authTypes.AUTH_TRAFFICOVERVIEW ]
            },
            {
                title: '商圈分析',
                routeName: types.BUSINESS_AREA_ANALYSIS,
                auth: [ authTypes.AUTH_REGIONANALYSIS ]
            }
        ]
    },
    {
        title: '人脸识别',
        icon: '&#xe61f;',
        children: [
            {
                title: '人脸录入',
                routeName: types.FACE_SINGLE_ENTRY,
                auth: [ authTypes.AUTH_FACERECORD ]
            },
            {
                title: '会员识别',
                routeName: types.VISION_VIP_RECOGNITION,
                auth: [ authTypes.AUTH_VIPRECOGNIZE ]
            },
            {
                title: '历史检索',
                routeName: types.VISION_SEARCH_BY_TIME_LINE,
                auth: [ authTypes.AUTH_HISTORYSEARCH ]
            },
            {
                title: '统计面板',
                routeName: types.VISION_STATISTIC,
                auth: [ authTypes.AUTH_STATISTICPANEL ]
            }
        ]
    },
    {
        title: '人群画像',
        icon: '&#xe627;',
        children: [
            // {
            //     title: '我的画像',
            //     routeName: types.PERSONAL_PERSONA,
            //     auth: [ authTypes.AUTH_DEVADMIN ]
            // },
            {
                title: '客流画像',
                routeName: types.CUSTOMER_FLOW_PERSONA,
                auth: [ authTypes.AUTH_CUSTOMERPROFILE ]
            },
            // {
            //     title: '会员画像',
            //     routeName: types.VIP_PERSONA,
            //     auth: [ authTypes.AUTH_DEVADMIN ]
            // },
            {
                title: '定制画像',
                routeName: types.CUSTOM_PERSONA,
                auth: [ authTypes.AUTH_CUSTOMIZEPROFILE ]
            }
            // {
            //     title: '画像人群包',
            //     routeName: types.PERSONA_CROWD_PACKAGE,
            //     auth: [ authTypes.AUTH_USERPACKAGE ]
            // }
        ]
    },
    {
        title: '数字营销',
        icon: '&#xe62a;',
        children: [
            {
                title: '人群包管理',
                routeName: types.CROWD_MANAGE,
                auth: [ authTypes.AUTH_PACKAGEMANAGEMENT ]
            },
            {
                title: 'DSP 营销',
                routeName: types.DSP,
                auth: [ authTypes.AUTH_DSPMARKET ]
            },
            {
                title: '短信营销',
                routeName: types.SMS,
                auth: [ authTypes.AUTH_SMSMARKET ]
            }
        ]
    },
    {
        title: '广告评估',
        icon: '&#xe64b;',
        children: [
            {
                title: '广告评估',
                routeName: '',
                auth: [ authTypes.AUTH_ADEVALUATION ]
            }
        ]
    }
];

export default config;
