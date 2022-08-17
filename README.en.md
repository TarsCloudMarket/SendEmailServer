## Service Description

Send mail service You can quickly call the tars interface to send mail.

- Support sending HTML/text format
- Mark will be sent to HTML format automatically, and mark can be sent to HTML format automatically

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

## Use Description

Interface as follow:

```c++


struct SendInfo
{
    1 optional vector<string> to;
    2 optional vector<string> cc;
    3 optional vector<string> bcc;
    4 optional string subject;

};

struct ContentInfo
{
    1 optional string text;
    2 optional string html;
};

struct MarkdownInfo
{
    1 optional string markdown;
    2 optional string css = "github.css";
};

interface SendEmail
{
    int sendEmail(SendInfo send, ContentInfo info);

    int sendEmailMarkdown(SendInfo send, MarkdownInfo info);

};

```

Note:

- Use sendEmail to send mail and fill in text and HTML at the same time. If the other party supports web pages, HTML will be displayed, otherwise text will be displayed
- sendEmailMarkdown is used. The content is in markdown format and will be automatically converted into web pages. The default style is `github.css`, of course, you can also customize the style, add the style file in the service configuration, and specify the file name when sending
