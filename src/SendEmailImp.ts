
// **********************************************************************
// Parsed By TarsParser(3.0.2), Generated By tools(20200627)
// TarsParser Maintained By <TARS> and tools Maintained By <superzheng>
// Generated from "User.tars" by Imp Mode
// **********************************************************************

import * as TarsStream from "@tars/stream";
import * as base from "./protocol/SendEmail";
import TarsLogs from "@tars/logs";
import webConf from './webConf';
import TarsConfig from "@tars/config";
import nodemailer from "nodemailer";
import { marked } from "marked";
export namespace Base {
    export class SendEmailImp extends base.Base.SendEmailImp {

        protected _logger = new TarsLogs("TarsRotate");
        protected _dayLogger = new TarsLogs("TarsDate");

        protected _css: any = {};

        protected _tarsConfig = new TarsConfig();

        private _transporter: any;

        async initialize() {

            try {
                if (process.env.TARS_CONFIG) {

                    const conf = await this._tarsConfig.loadConfig(`config.json`, { format: this._tarsConfig.FORMAT.JSON });

                    webConf.config = conf;

                    this._logger.debug("initialize, in webConfig: ", webConf);

                    await this.checkCSS('github.css');
                }

                marked.setOptions({
                    renderer: new marked.Renderer(),
                    // langPrefix: "hljs language-",
                    pedantic: false,
                    gfm: true,
                    breaks: false,
                    sanitize: false,
                    smartLists: true,
                    smartypants: false,
                    xhtml: false,
                });
            } catch (e) {
                this._logger.error("initialize error: ", e);
                process.exit(-1);
            }
        }

        public async sendEmail(current: base.Base.SendEmailImp.sendEmailCurrent, send: base.Base.SendInfo, info: base.Base.ContentInfo) {
            try {
                await this.checkTransporter();

                const rst = await this._transporter.sendMail({
                    from: webConf.config.email.smtp.auth.user,
                    to: send.to.toObject(),
                    cc: send.cc.toObject() || [],
                    bcc: send.bcc.toObject() || [],
                    subject: send.subject,
                    text: info.text,
                    html: info.html,
                });

                this._logger.debug("Message sent: ", send.to.toObject(), send.subject, rst);
                this._dayLogger.debug(`sendEmail|${send.to.toObject()}|${send.subject}`);

                current.sendResponse(base.Base.SendEmailRet.SM_SUCC);
            } catch (e) {
                this._logger.error("sendEmail error:", e);
                current.sendResponse(base.Base.SendEmailRet.SM_SYSTEM_ERROR);
            }
        }


        public async sendEmailMarkdown(current: base.Base.SendEmailImp.sendEmailCurrent, send: base.Base.SendInfo, info: base.Base.MarkdownInfo) {

            try {
                await this.checkTransporter();

                let css = info.css || 'github.css';

                await this.checkCSS(css);

                let html = `<html><style>${this.getCSS(css)}</style></html>`;
                html += marked.parse(info.markdown);

                const rst = await this._transporter.sendMail({
                    from: webConf.config.email.smtp.auth.user,
                    to: send.to.toObject(),
                    cc: send.cc.toObject() || [],
                    bcc: send.bcc.toObject() || [],
                    subject: send.subject,
                    text: info.markdown,
                    html: html,
                });

                this._logger.debug("Message sent: ", send.to.toObject(), send.subject, rst);
                this._dayLogger.debug(`sendEmail|${send.to.toObject()}|${send.subject}`);

                current.sendResponse(base.Base.SendEmailRet.SM_SUCC);
            } catch (e) {
                this._logger.error("sendEmailMarkdown error:", e);
                current.sendResponse(base.Base.SendEmailRet.SM_SYSTEM_ERROR);
            }
        }

        protected async checkTransporter() {
            if (!this._transporter) {
                this._transporter = await nodemailer.createTransport(webConf.config.email.smtp);

                const info = await this._transporter.verify();

                this._logger.debug('sendmail verify:', info);
            }
        }

        protected async checkCSS(css: string) {
            if (!this._css[css]) {

                const file = await this._tarsConfig.loadConfig(css, { format: this._tarsConfig.FORMAT.TEXT });

                this._css[css] = file;

                this._logger.debug('check CSS:', css);
            }
        }

        protected getCSS(css: string) {
            return this._css[css] || this._css["github.css"] || "";
        }
    }
}
