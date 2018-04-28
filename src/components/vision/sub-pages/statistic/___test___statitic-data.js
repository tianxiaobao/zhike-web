/* eslint-disable */

const data = [];
for (let i = 12; i < 24; i++) {
    data.push({
        date: '2018-01-' + i + '',
        customer: +(Math.random() * 1000).toFixed(0) + 3000,
        fist_time_customer: +(Math.random() * 3000).toFixed(0) + 3000,
        repeated_customer: +(Math.random() * 2000).toFixed(0) + 3000,
        // deal_conversion: +(Math.random() * 50).toFixed(0) + 50
        deal_conversion: 0
    });
}

export default data;
