function loadWebSocketIO() {
    // var uid = $api.getStorage('uid');
    // if (uid == 0 || uid == undefined) {
    //     return false;
    // }
    ws = new ReconnectingWebSocket('ws://ese.yumaoyou.cn:4250');
    ws.debug = false; // 此实例是否应该记录调试消息
    ws.binaryType = 'arraybuffer';  // 二进制
    ws.automaticOpen = true;  // websocket是否应在实例化后立即尝试连接。
    ws.reconnectDecay = 3.0;  // 重新连接延迟的增加速率。
    ws.timeoutInterval = 3000;   // 关闭并重试之前等待连接成功的最长时间
    ws.timeoutInterval = 5400;  // 尝试重新连接之前要延迟的毫秒数。
    ws.maxReconnectAttempts = 10;  // 放弃之前将进行的最大重新连接尝试次数
    ws.maxReconnectInterval = 10000;  // 延迟重新连接尝试的最大毫秒数。

    ws.onopen = function (event) {
        // console.log(JSON.stringify(event));
        // console.log(ws.readyState);
        if (ws.readyState == 1) {  // 连接成功建立，可以进行通信
            ws.send('a_' + uid + '_');
            timer = setInterval('sendHeart(' + uid + ')', 50000);
        } else if (ws.readyState == 2) {   // 连接正在进行关闭握手，即将关闭
            // console.log(ws.readyState);
            // clearInterval(heart);
        } else if (ws.readyState == 3) {   // 连接已经关闭或者根本没有建立
            // console.log(ws.readyState);
            // clearInterval(heart);
        } else {
            console.log('socket？？？？');
        }
    }
    ws.onmessage = function (event) {
        var data = JSON.parse(event.data);
        // console.log(JSON.stringify(data));
    }
    ws.onerror = function (event) {
        console.log(JSON.stringify(event));
        if (event.isTrusted == false) {
            clearInterval(timer);
        }
    }
    ws.onclose = function (event) {
        console.log(JSON.stringify(event));
        if (event.isTrusted == true) {
            clearInterval(timer);
        }
    }
}
// 检测信息发送
function sendHeart(uid) {
    console.log(uid);
    ws.send('a_' + uid + '_');
}
