import { HubConnectionBuilder } from '@microsoft/signalr'
import { getToken } from '@/utils/auth'

// 初始化SignalR对象
const connection = new HubConnectionBuilder()
    // .configureLogging(SignalR.LogLevel.Information)
    .withUrl(`${process.env.VUE_APP_BASE_API}hubs/onlineUser?access_token=${getToken()}`)
    .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: () => {
            return 5000 // 每5秒重连一次
        }
    })
    .build()

connection.keepAliveIntervalInMilliseconds = 15 * 1000 // 心跳检测15s
connection.serverTimeoutInMilliseconds = 30 * 60 * 1000 // 超时时间30m

// 启动连接
connection.start().then(() => {
    console.log('启动连接')
})
// 断开连接
connection.onclose(async () => {
    console.log('断开连接')
})
// 重连中
connection.onreconnecting(() => {
    console.log('重连中')
})
// 重连成功
connection.onreconnected(() => {
    console.log('重连成功')
})

// connection.on('OnlineUserList', () => { })

export { connection as signalR }
