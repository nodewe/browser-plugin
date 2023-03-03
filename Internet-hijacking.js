// ==UserScript==
// @name         xhr
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @match        https://www.baidu.com/
// @match       https://life.douyin.com/p/goods/*
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @grant        none
// ==/UserScript==

//这是 关于 浏览器劫持网络请求的一个脚本 通过重写 xhr send函数,对发送的网络包进行劫持 修改
(function () {
    "use strict";
    // // 声明一个断点状态  如果为true 就开始断点劫持请求
    // var deb = false;
    //劫持函数
    function addXMLRequestCallback(callback) {
        // oldSend 旧函数 i 循环
        var oldSend, i;
        //判断是否有callbacks变量
        if (XMLHttpRequest.callbacks) {
            //判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
            XMLHttpRequest.callbacks.push(callback);
        } else {
            //如果不存在则在xmlhttprequest函数下创建一个回调列表/callback数组
            XMLHttpRequest.callbacks = [callback];
            // 保存 XMLHttpRequest 的send函数
            oldSend = XMLHttpRequest.prototype.send;
            //获取旧xml的send函数，并对其进行劫持（替换）  function()则为替换的函数
            //以下function函数是一个替换的例子
            XMLHttpRequest.prototype.send = function () {
                // 把callback列表上的所有函数取出来
                for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                    // 把this传入进去
                    XMLHttpRequest.callbacks[i](this);
                }
                // console.log(this,"this")
                //循环回调xml内的回调函数
                // 调用旧的send函数 并传入this 和 参数
                // const urls = [
                //     "life/goods/product/draft/save",
                //     "life/goods/product/draft/save_cache"
                // ];

                // const res = urls.filter(url => this._url.indexOf(url) > -1)
                // if (res.length) {
                //     const data = JSON.parse(arguments[0])
                //     data.product_detail.product.category_id = "5005000"
                //     arguments[0] = JSON.stringify(data)
                // }
                // while (!deb) {

                // }
                oldSend.apply(this, arguments);
                //由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
            };
        }
    }

    // e.g.
    //传入回调 接收xhr变量
    addXMLRequestCallback(function (xhr) {
        //调用劫持函数，填入一个function的回调函数
        //回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
        xhr.addEventListener("load", function () {
            // 输入xhr所有相关信息
            //console.log(xhr);
            if (xhr.readyState == 4 && xhr.status == 200) {
                //  如果xhr请求成功 则返回请求路径
                // console.log("函数1", xhr.responseURL);
            }
        });
    });

    // Your code here...
})();