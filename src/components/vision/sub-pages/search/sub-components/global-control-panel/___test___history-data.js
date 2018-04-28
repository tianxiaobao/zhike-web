/* eslint-disable */
import moment from 'moment';

const imgCollection = [
    'http://cms-bucket.nosdn.127.net/7ef5c90240e04b8db2366636b7e3b00a20170904155606.jpeg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdPiZHuCdVgVcJxuON0mJNomb_w5E7imgpWIUOK9axq4nqxZwr',
    'http://p1.ifengimg.com/a/2017_39/b48bce4f233b1e6_size35_w700_h497.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJW1awZhXxex4bgddKJenbL8c-ueSWQstCUFzuPzmxyrgBeGVvnQ',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLhQMyT-0zHj3rTRSbaloLU_HdWFP-bEl-xnA51fzXMbv9ft2aA',
    'http://hkpic.crntt.com/upload/201310/17/102803666.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9BIztmJf7NOBrJDfaUWTt_cU7RcZUBO4uMTTLPPA7XkkKN3JRMw',
    'http://scanews.com/wp-content/uploads/2017/08/1-13.jpg',
    'http://img1.gtimg.com/tech/pics/hv1/236/252/2181/141884021.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv64JDtksak3-fTeB0kM0a__sprch1Gi3UkTQqyB2R8r9HnaFaog',
    'http://china-heatpipe.net/up_files/image/2008-11-12/62587961.jpg'
];
const imgCollectionLength = imgCollection.length;

const cameraCollection = [
    {
        id: 5,
        title: '门店入口机位一号',
        description: '海康威视，部署于南门入口',
    },
    {
        id: 6,
        title: '门店入口机位二号',
        description: '海康威视，部署于北门入口',
    },
    {
        id: 7,
        title: '门店出口机位一号',
        description: '海康威视，部署于南门出口',
    },
    {
        id: 8,
        title: '门店出口机位三号',
        description: '海康威视，部署于北门出口',
    }
];
const cameraCollectionLength = cameraCollection.length;

const start = moment.unix(1484013600);
const end = moment().add(1, 'months');
const data = [];
while (true) {
    const incremental = +(Math.random() * 10).toFixed(0);
    start.add(incremental, 'days');
    if (start.isAfter(end)) break;

    const randomImgIndex = +(Math.random() * (imgCollectionLength - 1)).toFixed(0);
    const randomCameraIndex = +(Math.random() * (cameraCollectionLength - 1)).toFixed(0);

    data.push({
        id: 21207,
        img: imgCollection[randomImgIndex],
        uuid: 'C00004',
        gender: 'male',
        user_name: '',
        mobile: '',
        created_at: start.format('YYYY-MM-DD HH:mm:ss'),
        group_id: 'customer',
        camera: cameraCollection[randomCameraIndex]
    })
}

export default data;
