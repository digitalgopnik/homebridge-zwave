import { Logging } from "homebridge";

export class ZwaveClient {
    private readonly baseUrl: string;
    private readonly username: string;
    private readonly password: string;
    private readonly sessionCookie: undefined | string;
    private readonly log: Logging;

    constructor(
        log: Logging,
        baseUrl: string,
        username: string,
        password: string,
    ) {
        this.log = log;
        this.baseUrl = baseUrl;
        this.username = username;
        this.password = password;
        this.sessionCookie = this.login(this.username, this.password);
    }

    login(username: string, password: string): string {
        this.log.debug('Authenticating on zwave server');

        const body = {
            form: true,
            login: username,
            password,
            keepme: false,
            default_ui: 1,
        }

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }

        const response = this.request('ZAutomation/api/v1/login', 'POST', body, headers, )

        return response.data.sid;
    }

    request(path: string, method: 'POST' | 'GET', body?: any, headers?: any): any {
        this.log.debug('Requesting', method, path);

        if (this.sessionCookie !== undefined) {
            headers['Cookie'] = "ZWAYSession=" + this.sessionCookie;
        }

        const url = this.baseUrl + path;
        const options = {
            method: method,
            headers: headers,
            body: body,
        }
        const response = fetch(url, options);

        console.log(response);

        return {};
    }
}