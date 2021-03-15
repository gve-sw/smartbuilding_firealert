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

const request = require('request-promise');
const constants = require('./constants');
const jsxapi = require('jsxapi');
require('dotenv').config();

async function getDeviceIDs() {
    const options = {
        method: "GET",
        uri: constants.URL_WEBEX_GET_DEVICES,
        json: true,
        auth: {
            'bearer': process.env.ACCESS_TOKEN
        }
    };

    let resp = await request(options);
    return resp.items.map(device => device.id);
}

async function xCommand(command, deviceID, arguments) {
    const options = {
        method: "POST",
        uri: constants.URL_WEBEX_XCOMMAND + command,
        json: true,
        auth: {
            'bearer': process.env.ACCESS_TOKEN
        },
        body: {
            deviceId: deviceID,
            arguments: {...arguments}
        }
    };

    return request(options);
}

async function xStatus(status, deviceID) {
    const options = {
        method: "GET",
        uri: constants.URL_WEBEX_XSTATUS,
        json: true,
        auth: {
            'bearer': process.env.ACCESS_TOKEN
        },
        qs: {
            deviceId: deviceID,
            name: status
        }
    };

    return request(options);
}

async function alertDisplay(deviceIDs = undefined, duration = 15, title = "FIRE ALERT", text = `The meeting will be terminated in ${duration} seconds.`) {
    if (process.env.ROOM_KIT_CONN == "JSXAPI") {
        const xapi = jsxapi.connect(`ssh://${process.env.ROOM_KIT_IP}`, {
            username: process.env.ROOM_KIT_USERNAME,
            password: process.env.ROOM_KIT_PASSWORD,
        });

        await new Promise((resolve, reject) => {
            xapi.command(constants.xCommand.UI_MESSAGE_ALERT_DISPLAY, {
                "Title": title,
                "Text": text,
                "Duration": duration
            });
            resolve();
        });

        await new Promise((resolve, reject) => {
            xapi.command(constants.xCommand.UI_MESSAGE_TEXTLINE_DISPLAY, {
                Text: text + " Please stand by for evacuation map.",
                X:50,
                Y:50,
                Duration: duration
            });
            resolve();
        });

        return "Success";
    } else {
        if (deviceIDs === undefined) {
            deviceIDs = await getDeviceIDs();
        }

        await Promise.all(deviceIDs.map(id => {
            return xCommand(constants.xCommand.UI_MESSAGE_ALERT_DISPLAY, id, {
                "Title": title,
                "Text": text,
                "Duration": duration
            })
        }));

        await Promise.all(deviceIDs.map(id => {
            return xCommand(constants.xCommand.UI_MESSAGE_TEXTLINE_DISPLAY, id, {
                "Text": text + " Please stand by for evacuation map.",
                "Duration": duration,
                "X": 50,
                "Y": 50
            })
        }));

        return deviceIDs;
    }
}

// NOTE: need to enable Digital signage in the admin page
async function uiWebviewDisplay(deviceIDs = undefined) {
    if (process.env.ROOM_KIT_CONN == "JSXAPI") {
        const xapi = jsxapi.connect(`ssh://${process.env.ROOM_KIT_IP}`, {
            username: process.env.ROOM_KIT_USERNAME,
            password: process.env.ROOM_KIT_PASSWORD,
        });

        await new Promise((resolve, reject) => {
            xapi.command(constants.xCommand.UI_WEBVIEW_DISPLAY, {
                Title: "FIRE ALERT",
                Url: "http://m.qpic.cn/psb?/655e8747-72e8-4791-a6df-0ea996ebf856/YN3opK8XivvE1o93eglC960k.6srtA84*64eR3hhCxM!/b/dL8AAAAAAAAA&bo=gAc4BIAHOAQRCT4!&rf=viewer_4"
            });
            resolve();
        });

        return "Success";
    } else {
        if (deviceIDs === undefined) {
            deviceIDs = await getDeviceIDs();
        }

        await Promise.all(deviceIDs.map(id => {
            return xCommand(constants.xCommand.UI_WEBVIEW_DISPLAY, id, {
                Title: "FIRE ALERT",
                Url: "http://m.qpic.cn/psb?/655e8747-72e8-4791-a6df-0ea996ebf856/YN3opK8XivvE1o93eglC960k.6srtA84*64eR3hhCxM!/b/dL8AAAAAAAAA&bo=gAc4BIAHOAQRCT4!&rf=viewer_4"
            })
        }));

        return deviceIDs;
    }
}

async function uiWebviewClear(deviceIDs = undefined) {
    if (process.env.ROOM_KIT_CONN == "JSXAPI") {
        const xapi = jsxapi.connect(`ssh://${process.env.ROOM_KIT_IP}`, {
            username: process.env.ROOM_KIT_USERNAME,
            password: process.env.ROOM_KIT_PASSWORD,
        });

        await new Promise((resolve, reject) => {
            xapi.command(constants.xCommand.UI_WEBVIEW_CLEAR, {});
            resolve();
        });

        return "Success";
    } else {
        deviceIDs = await getDeviceIDs();

        await Promise.all(deviceIDs.map(id => {
                return xCommand(constants.xCommand.UI_WEBVIEW_CLEAR, id, {})
            })
        );

        return deviceIDs;
    }
}

async function disconnectCall(deviceIDs) {
    if (process.env.ROOM_KIT_CONN == "JSXAPI") {
        const xapi = jsxapi.connect(`ssh://${process.env.ROOM_KIT_IP}`, {
            username: process.env.ROOM_KIT_USERNAME,
            password: process.env.ROOM_KIT_PASSWORD,
        });

        await new Promise((resolve, reject) => {
            xapi.command(constants.xCommand.CALL_DISCONNECT, {});
            resolve();
        });

        return "Success";
    } else {
        if (deviceIDs === undefined) {
            deviceIDs = await getDeviceIDs();
        }

        await Promise.all(deviceIDs.map(async deviceID => {
            return xCommand(constants.xCommand.CALL_DISCONNECT, deviceID, {})
        }));

        return deviceIDs;
    }
}

module.exports = {
    getDeviceIDs,
    disconnectCall,
    uiWebviewDisplay,
    uiWebviewClear,
    alertDisplay
};
