var config = {
     // socketServer: '//im-api-v2,easemob.com/ws',    // socket Serveraddress

     // restServer: '//a1,easemob.com',               // rest Serveraddress

     appkey: '1101220606096669#demo',        // App key

     HTTPS: false,                            // Whether to use HTTPS

     isHttpDNS: true,                          // 3.0 SDKsupport, 防止DNShijacking从server获取XMPPUrl, restUrl

     isMultiLoginSessions: false,              // whetherenablemulti-pagesync收Message, 注意, 需要先contactbusiness teamenable此feature

     isDebug: false,                           // 打开debug, 会自动printlog, 在控制台的console中查看log

     autoReconnectNumMax: 2,                   // Maximum auto-reconnect attempts

     heartBeatWait: 30000,                     // heartbeatinterval (只在mini-program中使用) 

     delivery: false,                           // Whether to send read receipts

     useOwnUploadFun: false,         // whether使用自己的uploadmethod (如将image/picturefile等upload到自己的服务器, 构建Message时只传url) 

     deviceId: 'webim'               // deviceID, default可optional, 如果传一个fixed value, 在没enablemulti-terminallogin的情况下同一个账号会互kicked
};
export default config;
