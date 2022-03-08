## Service Description

Send mail service You can quickly call the tars interface to send mail.

## Config Description

Config name is `config.json`, format as follow:

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

You need to configure the fields in smtp.
