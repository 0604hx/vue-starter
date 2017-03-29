
### 拉取记录 PullResult

拉取记录与任务一一对应（ID值一致），记录配对任务的拉取全过程（每次拉取结果、数据量、耗时等数据）。
其数据项如下：

**PullResult**

| 字段名 | 类型 | 默认值 | 必填 | 说明 |
| ---- |---- |---- |---- |---- |
|_id|String||Y|与任务ID一致|
|failCount|int|0|Y|失败计数，失败包括采集端无响应或者响应超时、拉取接口调用失败，超过一定次数后任务状态自动更改为超时或者失败|
|emptyCount|int|0|Y|空数据计数，如果超过指定次数后该任务自动变成完成状态|
|logs|Array|||拉取记录，字段详见`PullLog`|
|lastDate|Date||上一次拉取时间|
|message|String||拉取任务的最新消息|
|duration|int|0|Y|拉取任务总耗时|

> *提供的对外接口*
> 
> addLog(log:PullLog)   
>   * 增加Log对象

**PullLog**

| 字段名 | 类型 | 默认值 | 必填 | 说明 |
| ---- |---- |---- |---- |---- |
|status|int||状态描述，0=正常，1=采集端拒绝返回数据，2=超时|
|dataSize|int|0||本次拉取数据量|
|stored|int|0||本次拉取成功入库的数据量|
|data|String|||本次拉取回来的原始数据（JSON）|
|duration|int|0|Y|本次拉取耗时|
|addDate|Date||Y|本次拉取开始时间|

> *提供的对外接口*
> 
> isEmpty()   
>   * 本次拉取采集端是否返回空数据（status=0 && dataSize=0）

## 执行流程

1. 拉取工具每隔`2`秒读取配置`PULL_DATE`，一旦此值小于当前时间就会触发拉取进程（故想要下一轮检测马上执行拉取，只需设置`PULL_DATE`便可）
2. 查询未完成的耗时任务列表（condition=[status=已发送|执行中, dataSize>=0]，最大条数=100)
3. 遍历上述任务列表，分别调用采集端进行任务拉取：
    * 根据上一步的拉取结果生成`PullLog`，如果status=0同时data不为空，则需要对原始数据进行解密
    * 解密成功：更新`PullLog`的dataSize，接着对解密出来的数据进行发序列到Bean并入库，最后更新`PullLog`的stored、更新任务的`dataSize`
    * 解密失败：说明拉取工具使用的秘钥与采集端不一致，本次拉取失败
    * 查询与任务对应的`PullResult`，如果没有则自动创建，保存`PullLog`到`PullResult`，并更新后者的`duration`,`lastDate`,`message`等信息
    * 保存上一步得到的`PullResult`，如果`failCount`>3则任务状态变成已失败，如果`emptyCount`>3则任务状态变成已完成
    * 计算任务的总拉取耗时
4. 遍历完成后， 更新`PULL_DATE`为半小时后

说明
> * failCount、emptyCount的次数是可以配置，默认为3
> * 遍历完成后半小时继续拉取是可以配置，默认半小时
> * 每次查询任务条数可以配置，默认100条


