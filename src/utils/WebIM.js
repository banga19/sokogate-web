import config from './WebIMConfig';
import websdk from "easemob-websdk";

var WebIM = window.WebIM = websdk
let conn = {};
WebIM.config = config;
conn = WebIM.conn = new WebIM.connection({
	appKey: WebIM.config.appkey,
	isHttpDNS: WebIM.config.isHttpDNS,
	isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
	HTTPS: WebIM.config.HTTPS,
	url: WebIM.config.socketServer,
	apiUrl: WebIM.config.restServer,
	isAutoLogin: WebIM.config.isAutoLogin,
	autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
	autoReconnectInterval: WebIM.config.autoReconnectInterval,
	delivery: WebIM.config.delivery,
	useOwnUploadFun: WebIM.config.useOwnUploadFun
})
// WebIM.config 为之前集成里介绍的WebIMConfig.js

conn.listen({
	onOpened: function () {
		console.log("Login successful");
	},                  //connectionSuccesscallback 
	onClosed: function () {
		console.log("Logout successful");
	},                  //Connection closed callback
	onTextMessage: function () {
		console.log("收到文本message");
	},    //收到文本Message
	onEmojiMessage: function () { },   //收到emojiMessage
	onPictureMessage: function () { }, //收到image/pictureMessage
	onCmdMessage: function () { },     //收到commandMessage
	onAudioMessage: function () { },   //收到audioMessage
	onLocationMessage: function () { },//收到locationMessage
	onFileMessage: function () { },    //收到fileMessage
	onCustomMessage: function () { },  //收到customMessage
	onVideoMessage: function (message) {
		var node = document.getElementById('privateVideo');
		var option = {
			url: message.url,
			headers: {
				'Accept': 'audio/mp4'
			},
			onFileDownloadComplete: function (response) {
				var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
				node.src = objectURL;
			},
			onFileDownloadError: function () {
				console.log('File down load error.')
			}
		};
		WebIM.utils.download.call(conn, option);
	},   //收到videoMessage
	onPresence: function () { },       //处理"broadcast"或"pub-sub"Message, 如contactsubscriptionrequest, 处理group, chatroom被kickeddisbanded等Message
	onRoster: function () { },         //Handle friend requests
	onInviteMessage: function () { },  //Handle group invitations
	onOnline: function () { },                  //本机networkconnectionSuccess
	onOffline: function () { },                 //Local network disconnected
	onError: function () { },          //failedcallback
	onBlacklistUpdate: function (list) {       //blacklist变动
		// Queryblacklist, 将friend拉黑, 将friend从blacklist移除都会callback这个函数, list则是blacklist现有的所有friend信息
		console.log(list);
	},
	onRecallMessage: function () { },      //收到recallMessagecallback
	onReceivedMessage: function () { },    //收到Message送达服务器receipt
	onDeliveredMessage: function () { },   //收到Message送达clientreceipt
	onReadMessage: function () { },        //收到Messagereadreceipt
	onCreateGroup: function () { },        //creategroupSuccessreceipt (需调用createGroupNew) 
	onMutedMessage: function () { },       //如果用户在Agroup被muted, 在Agroup messageMessage会走这个callback并且Message不会传递给群其它成员
	onChannelMessage: function () { }      //收到整个会话read的receipt, 在对方sendchannel ack时会在这个callback里收到Message
});

export { conn };
