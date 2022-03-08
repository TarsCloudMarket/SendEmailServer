## 服务说明

发送邮件服务. 可以快速调用 tars 接口完成邮件的发送.

## 配置说明

配置文件名为`config.json`, 格式如下:

```json
{
  "email": {
    "smtp": {
      "host": "smtp.exmail.qq.com",
      "port": 465,
      "secure": true,
      "auth": {
        "user": "",
        "pass": ""
      }
    }
  }
}
```

需要配置好 smtp 中字段即可.
