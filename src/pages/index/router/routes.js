import * as types from './route_types';
import * as auths from '@/pages/index/auth_types';

import notFound from '@/components/404/Main';

const routes = [
    {
        path: '/',
        redirect: {
            name: types.CUSTOMER_FLOW_OVERVIEW
        }
    },
    {
        name: types.NOT_FOUND,
        path: '/404',
        component: notFound
    },
    {
        // 流量总览
        name: types.CUSTOMER_FLOW_OVERVIEW,
        path: '/customer-flow/overview',
        component: () => import('@/components/customer-flow/Main'),
        meta: {
            auth: [auths.AUTH_TRAFFICOVERVIEW]
        }
    },
    {
        // 商圈分析
        name: types.BUSINESS_AREA_ANALYSIS,
        path: '/customer-flow/district',
        component: () => import('@/components/district/Main'),
        meta: {
            auth: [auths.AUTH_REGIONANALYSIS],
            sideHidden: true
        }
    },
    // {
    //     // 我的画像
    //     name: types.PERSONAL_PERSONA,
    //     path: '/persona/personal',
    //     component: () => import('@/components/persona/myPortrait/Main'),
    //     meta: {
    //         auth: [auths.AUTH_DEVADMIN],
    //         sideHidden: true
    //     }
    // },
    // {
    //     // 我的画像结果
    //     name: types.PERSONAL_PERSONA_RESULT,
    //     path: '/persona/personal/result',
    //     component: () => import('@/components/persona/myPortrait/Result'),
    //     meta: {
    //         auth: [auths.AUTH_DEVADMIN],
    //         sideHidden: true
    //     }
    // },
    {
        // 客流画像
        name: types.CUSTOMER_FLOW_PERSONA,
        path: '/persona/customer-flow',
        component: () => import('@/components/persona/customer-flow/Main'),
        meta: {
            auth: [auths.AUTH_CUSTOMERPROFILE]
        }
    },
    // {
    //     // 会员画像
    //     name: types.VIP_PERSONA,
    //     path: '/persona/vip',
    //     component: () => import('@/components/persona/vip/Main'),
    //     meta: {
    //         auth: [auths.AUTH_DEVADMIN]
    //     }
    // },
    {
        // 定制画像
        name: types.CUSTOM_PERSONA,
        path: '/persona/custom',
        component: () => import('@/components/persona/userDefined/Main'),
        meta: {
            auth: [auths.AUTH_CUSTOMIZEPROFILE]
        }
    },
    {
        // 定制画像结果
        name: types.CUSTOM_PERSONA_DETAIL,
        path: '/persona/custom-detail/:taskId',
        component: () => import('@/components/persona/custom/Main'),
        props: (route) => ({taskId: route.params.taskId}),
        meta: {
            auth: [auths.AUTH_CUSTOMIZEPROFILE],
            sideHidden: true
        }
    },
    // {
    //     // 画像人群包
    //     name: types.PERSONA_CROWD_PACKAGE,
    //     path: '/persona/crowd',
    //     component: () => import('@/components/persona/crowd/Main'),
    //     meta: {
    //         auth: [auths.AUTH_USERPACKAGE]
    //     }
    // },
    {
        // 人群包管理
        name: types.CROWD_MANAGE,
        path: '/digital-marketing/crowd',
        component: () => import('@/components/digital-marketing/crowd/Main'),
        meta: {
            auth: [auths.AUTH_PACKAGEMANAGEMENT]
        }
    },
    {
        // DSP营销
        name: types.DSP,
        path: '/digital-marketing/dsp',
        component: () => import('@/components/digital-marketing/dsp/Main'),
        meta: {
            auth: [auths.AUTH_DSPMARKET],
            sideHidden: true
        }
    },
    {
        // 短信营销
        path: '/digital-marketing/sms',
        component: () => import('@/components/digital-marketing/sms/Main'),
        children: [
            {
                // 短信任务
                name: types.SMS,
                path: '',
                component: () => import('@/components/digital-marketing/sms/components/MessageList')
            },
            {
                // 短信效果对比
                path: 'contrast',
                name: types.SMS_CONTRAST,
                component: () => import('@/components/digital-marketing/sms/components/Contrast'),
                meta: {
                    sideHidden: true
                }
            }
        ],
        meta: {
            auth: [auths.AUTH_SMSMARKET]
        }
    },
    {
        // 商圈分析报告
        name: types.BUSINESS_AREA_ANALYSIS_REPORT,
        path: '/report/:region',
        component: () => import('@/components/repo/Main'),
        meta: {
            auth: [auths.AUTH_REGIONANALYSIS],
            sideHidden: true
        }
    },
    {
        name: types.SHOP_MANAGEMENT,
        path: '/shop-management',
        component: () => import('@/components/shop-management/Main'),
        meta: {
            auth: [auths.AUTH_ADMIN]
        }
    },
    {
        // 人脸识别
        name: types.VISION,
        path: '/vision',
        component: () => import('@/components/vision'),
        children: [
            {
                name: types.VISION_FACE_ENTRY,
                path: 'face-entry',
                component: () => import('../../../components/vision/sub-pages/face-entry'),
                children: [
                    {
                        path: 'single',
                        name: types.FACE_SINGLE_ENTRY,
                        component: () => import('../../../components/vision/sub-pages/face-entry/sub-pages/single-entry')
                    },
                    {
                        path: 'multiple',
                        name: types.FACE_MULTIPLE_ENTRY,
                        component: () => import('../../../components/vision/sub-pages/face-entry/sub-pages/multiple-entry')
                    },
                    {
                        path: 'group-management',
                        name: types.FACE_GROUP_MANAGEMENT,
                        component: () => import('../../../components/vision/sub-pages/face-entry/sub-pages/group-management')
                    }
                ],
                meta: {
                    auth: [auths.AUTH_FACERECORD]
                }
            },
            {
                name: types.VISION_VIP_RECOGNITION,
                path: 'vip-recognition',
                component: () => import('../../../components/vision/sub-pages/vip-recognition'),
                meta: {
                    auth: [auths.AUTH_VIPRECOGNIZE]
                }
            },
            {
                name: types.VISION_SEARCH,
                path: 'search',
                component: () => import('../../../components/vision/sub-pages/search'),
                children: [
                    {
                        path: 'by-time-line',
                        name: types.VISION_SEARCH_BY_TIME_LINE,
                        component: () => import('../../../components/vision/sub-pages/search/sub-pages/search-by-time-line')
                    },
                    {
                        path: 'by-camera',
                        name: types.VISION_SEARCH_BY_CAMERA,
                        component: () => import('../../../components/vision/sub-pages/search/sub-pages/search-by-camera')
                    }
                ],
                meta: {
                    auth: [auths.AUTH_HISTORYSEARCH]
                }
            },
            {
                name: types.VISION_STATISTIC,
                path: 'statistic',
                component: () => import('../../../components/vision/sub-pages/statistic'),
                meta: {
                    auth: [auths.AUTH_STATISTICPANEL]
                }
            }
        ]
    }
];
export default routes;