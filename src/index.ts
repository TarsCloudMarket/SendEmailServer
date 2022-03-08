import * as Tars from "@tars/rpc";
import path from "path";
// TODO:write .tars file in protocol directory，and use tars2node to parse it to typescript server side code
import { Base } from "./SendEmailImp";

const svr = new Tars.server() // eslint-disable-line
const impMap: any = {
    "SendEmailObj": Base.SendEmailImp,
};
svr.initialize(process.env.TARS_CONFIG || path.resolve(__dirname, "../dev.config.conf"), (server: any) => {
    const servantName = `SendEmailObj`;
    server.addServant(impMap[servantName], `${server.Application}.${server.ServerName}.${servantName}`);
});
svr.start();
console.log("tars server started");