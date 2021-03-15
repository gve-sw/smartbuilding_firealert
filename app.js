/*
Copyright (c) 2020 Cisco and/or its affiliates.

This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at

               https://developer.cisco.com/docs/licenses

All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
*/

const webex = require('./webex');
const events = require("events");
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const singlewire = require('./singlewire')

const emitter = new events.EventEmitter();

// When fire happens:
emitter.addListener("fire_alert", async () => {
    try {
        // display alert
        let ids = await webex.alertDisplay();
        setTimeout(() => {
            emitter.emit("start_emergency_action", ids);
        }, 15000);
    } catch (e) {
        console.error("fire_alert event error: " + e);
    }

    // Singlewire send notifications
    try {
        // update single wire distribution list
        // await singlewire.updateTenants();
        // broadcast notifications
        await singlewire.broadcastNotification();
    } catch (e) {
        console.error(e)
    }
});

emitter.addListener("start_emergency_action", async function (ids) {
    try {
        // disconnect all the ongoing meetings
        await webex.disconnectCall(ids);
    } catch (e) {
        console.error("disconnectCall: " + e)
    }

    try {
        // display evacuation map
        // unblock the setTimeout function if uiWebView does not show up
        // setTimeout(async () => {
        await webex.uiWebviewDisplay(ids);
        // }, 1000);
    } catch (e) {
        console.error("uiWebviewDisplay: " + e)
    }
});

// When fire threat is resolved
emitter.addListener("alert_cleared", async () => {
    try {
        let ids = webex.getDeviceIDs()
        // stop display evacuation map
        await webex.uiWebviewClear(ids);
    } catch (e) {
        console.error("uiWebviewClear: " + e)
    }
});


http.createServer(function (req, res) {
    let pathname = url.parse(req.url, true).pathname;
    if (req.method === "GET") {
        if (pathname === '/') {
            pathname = '/index.html';
        }
        // path for static directory
        let staticPath = path.resolve(__dirname, 'static');
        // path for static files
        let filePath = path.join(staticPath, pathname);
        fs.readFile(filePath, function (err, data) {
            if (err) {
                console.log(err);
                // display an error page if files are not found
                let errPath = path.join(staticPath, '/404.html');
                fs.readFile(errPath, (err, data404) => {
                    if (err) {
                        res.write('404 Not Found');
                        return res.end();
                    } else {
                        res.writeHead(404, {"Content-Type": "text/html;charset='utf-8'"});
                        res.write(data404);
                        return res.end();
                    }
                })
            } else {
                res.write(data);
                return res.end();
            }
        });
    } else if (req.method === "POST") {
        if (pathname === '/fire') {
            emitter.emit('fire_alert');
            res.write('success');
            return res.end();
        } else if (pathname === '/resolved') {
            emitter.emit('alert_cleared');
            res.write('success');
            return res.end();
        }
    }
}).listen(80);
