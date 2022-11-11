- [nginx 限流](#nginx-限流)
- [nginx 配合 redis 实现 ip 自动封禁](#nginx-配合-redis-实现-ip-自动封禁)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.csdn.net](https://blog.csdn.net/baidu_39340547/article/details/121234454)

### nginx 限流

在 http 设置中添加限流的设置，20r/s 每个 ip 每秒允许 20 次访问。
设置完成后再需要限流的接口中调用该设置。

```conf
http {
  limit_req_zone $uri zone=api_read:20m rate=20r/s;
}
server {
  location /test/api {
    limit_req zone=api_read burst=5 nodelay;
}
```

### nginx 配合 redis 实现 ip 自动封禁

前提：nginx 加载了 lua 模块 实现 lua 的 docker 镜像（nignx 加强）：openresty
过程：动态管理 redis 的一个集合中的黑名单列表，nginx 接口加载 lua 脚本，由 lua 读取 redis 中的 ip 黑名单列表。

```lua
local redis = require("resty.redis")
local ngx_log = ngx.log
local ngx_ERR = ngx.ERR
local ngx_INFO = ngx.INFO
local ngx_exit = ngx.exit
local ngx_var = ngx.var

-- 黑名单缓存60秒
local cache_idle = 10
local forbidden_list = ngx.shared.forbidden_list

local function close_redis(red)
  if not red then
    return
  end
  -- 释放连接(连接池实现)
  local pool_max_idle_time = 10000 -- 毫秒
  local pool_size = 100  -- 连接池大小
  local ok, err = red:set_keepalive(pool_max_idle_time, pool_size)

  if not ok then
    ngx_log(ngx_ERR, "set redis keepalive error : ", err)
  end
end

-- 从redis获取ip黑名单列表
local function get_forbidden_list()
  local red = redis:new()
  red:set_timeout(1000)
  local ip = "xxx.xxx.xxx.xxx"
  local port = 6379

  local ok, err = red:connect(ip, port)
  if not ok then
    ngx_log(ngx_ERR, "connect to redis error : ", err,ip)
    ngx_log(ngx_ERR, "redisIP : ",ip)
    close_redis(red)
    return
  end

  local resp, err = red:smembers("forbidden_list")
  if not resp then
    ngx_log(ngx_ERR, "get redis connect error : ", err)
    close_redis(red)
    return
  end
  -- 得到的数据为空处理
  if resp == ngx.null then
    resp = nil
  end
  close_redis(red)

  return resp
end

-- 刷新黑名单
local function reflush_forbidden_list()
  local current_time = ngx.now()
  local last_update_time = forbidden_list:get("last_update_time");

  if last_update_time == nil or last_update_time < (current_time - cache_idle) then
    local new_forbidden_list = get_forbidden_list();
    if not new_forbidden_list then
      return
    end

    forbidden_list:flush_all()
    for i, forbidden_ip in ipairs(new_forbidden_list) do
      forbidden_list:set(forbidden_ip, true);
    end
    forbidden_list:set("last_update_time", current_time);
  end
end

reflush_forbidden_list()
local ip = ngx_var.remote_addr
if forbidden_list:get(ip) then
  ngx_log(ngx_ERR, "forbidden ip refused access : ", ip)
  return ngx_exit(ngx.HTTP_FORBIDDEN)
end
```

nginx 接口加载脚本

```conf
server{
    access_by_lua_file /usr/local/openresty/nginx/conf/conf.d/lua/forbidden_list.lua;
}
```

lua 连接 redis 成功后，即可通过服务 server 实现 crud、定时任务检测等灵活操作
