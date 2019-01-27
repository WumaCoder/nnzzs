import wepy from "wepy";
let host = "https://wmtest.xyz:8000";

/**
 * 
 * @param {string} key 
 * @param {JSON} value 
 */
let setStorageJson = (key, value) => {
    try {
        wx.setStorageSync(key, JSON.stringify(value))
        return true;
    } catch (e) {
        return false;
    }
}
/**
 * 
 * @param {String} key 
 */
let getStorageJson = (key) => {
    try {
        return JSON.parse(wx.getStorageSync(key));
    } catch (error) {
        return false;
    }

}
/**
 * 
 * @param {String} api 接口
 * @param {String} type GET/POST
 * @param {*} data 数据
 */
let request = (api, type, data) => {
    return new Promise((resolve, reject) => {
        wepy.request({
            url: `${host}${api}`, //开发者服务器接口地址",
            data, //请求的参数",
            method: type,
            dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
            success: res => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        });
    });


}

/**
 * 
 * @param {String} username 输入学号生成学期
 */
let gen = (username, py = 0) => {
    let year = 0;
    let years = {};
    if (username.length < 13) {
        year = Math.floor(username.substr(0, 2));
        year += 2000;
    } else {
        year = Math.floor(username.substr(0, 4));
    }

    let now = {
        y: new Date().getFullYear(),
        m: new Date().getMonth() + 1,
        d: new Date().getDate()
    }

    let t = now.y * 100 + now.m;

    if (t >= (now.y + 1) * 100 + 3) {
        years.xq = 1;
        years.xn = now.y;
    } else if (t >= (now.y) * 100 + 9) {
        years.xq = 0;
        years.xn = now.y;
    } else if (t >= (now.y) * 100 + 3) {
        years.xq = 1;
        years.xn = now.y - 1;
    } else {
        years.xq = 0;
        years.xn = now.y - 1;
    }

    let arr = [];
    let t1 = ["大一", "大二", "大三", "大四"];
    let t2 = ["上", "下"];

    for (let i = years.xn; i >= year; i--) {
        for (let j = 1; j >= 0; j--) {
            if (i != years.xn || j <= years.xq || py)
                arr.push({ xn: i, xq: j, show: t1[i - year] + t2[j] });
        }
    }

    return arr;
}
/**
 * 
 * @param {*} xn 学年
 * @param {*} xq 学期
 * @param {*} xnxq 学年学期
 */
let getScore = (xn, xq, xnxq) => {
    wx.showLoading({
        title: "加载成绩单中",
        mask: true
    });
    return new Promise((resolve) => {
        request('/getScore', 'get', { data: { xn, xq, xnxq }, cookies: getStorageJson('Cookie') }).then(res => {
            console.log(res);
            wx.hideLoading();
            let data = res.data;
            resolve(data);
        }).catch(res => {
            wx.hideLoading();
            wx.showToast({
                title: '网络错误',
                icon: 'fail',
                duration: 2000
            })
        })
    })
}

let getTimetable = (xn, xq, xnxq) => {
    wx.showLoading({
        title: "加载课程表中",
        mask: true
    });
    return new Promise((resolve) => {
        request('/getTimetable', 'get', { data: { xn, xq, xnxq }, cookies: getStorageJson('Cookie') }).then(res => {
            console.log(res);
            wx.hideLoading();
            let data = res.data;
            resolve(data);
        }).catch(res => {
            wx.hideLoading();
            wx.showToast({
                title: '网络错误',
                icon: 'fail',
                duration: 2000
            })
        })
    })
}

module.exports = {
    setStorageJson,//保存json类型的缓存
    getStorageJson,//读取json数据
    request,//请求
    host,//请求服务器地址
    wx,//wx api接口
    gen,//生成学期
    getScore,//获取成绩
    getTimetable
}