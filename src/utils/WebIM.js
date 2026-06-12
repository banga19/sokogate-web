import config from './WebIMConfig';
import websdk from "easemob-websdk";

var WebIM = window.WebIM = websdk
let conn = {};
WebIM.config = config;
conn = WebIM.conn = new WebIM.connection({
	appKey: WebIM.config.appkey,
	isHttpDNS: WebIM.config.isHttpDNS,
	isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
	https: WebIM.config.https,
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
		console.log("登录成功");
	},                  //连接成功回调 
	onClosed: function () {
		console.log("退出成功");
	},                  //连接关闭回调
	onTextMessage: function () {
		console.log("收到文本消息");
	},    //收到文本消息
	onEmojiMessage: function () { },   //收到表情消息
	onPictureMessage: function () { }, //收到图片消息
	onCmdMessage: function () { },     //收到命令消息
	onAudioMessage: function () { },   //收到音频消息
	onLocationMessage: function () { },//收到位置消息
	onFileMessage: function () { },    //收到文件消息
	onCustomMessage: function () { },  //收到自定义消息
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
	},   //收到视频消息
	onPresence: function () { },       //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
	onRoster: function () { },         //处理好友申请
	onInviteMessage: function () { },  //处理群组邀请
	onOnline: function () { },                  //本机网络连接成功
	onOffline: function () { },                 //本机网络掉线
	onError: function () { },          //失败回调
	onBlacklistUpdate: function (list) {       //黑名单变动
		// 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
		console.log(list);
	},
	onRecallMessage: function () { },      //收到撤回消息回调
	onReceivedMessage: function () { },    //收到消息送达服务器回执
	onDeliveredMessage: function () { },   //收到消息送达客户端回执
	onReadMessage: function () { },        //收到消息已读回执
	onCreateGroup: function () { },        //创建群组成功回执（需调用createGroupNew）
	onMutedMessage: function () { },       //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
	onChannelMessage: function () { }      //收到整个会话已读的回执，在对方发送channel ack时会在这个回调里收到消息
});

export { conn };
