import { WsClient } from "tsrpc-browser";
import { serviceProto, ServiceType } from "./shared/protocols/serviceProto";
import {enableSession} from "./hook/ClientSession";

export function getClient(): WsClient<ServiceType> {
    let end= new WsClient(serviceProto, {
        server: "ws://127.0.0.1:3000",
        // Remove this to use binary mode (remove from the server too)
        json: true,
        logger: console,
    })
    enableSession(end);
    return end;
}
