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

module.exports = {
    URL_WEBEX_GET_ACCESS_TOKEN: "https://api.ciscospark.com/v1/access_token",
    URL_WEBEX_GET_DEVICES: "https://api.ciscospark.com/v1/devices",
    URL_WEBEX_XCOMMAND: "https://api.ciscospark.com/v1/xapi/command/",
    URL_WEBEX_XSTATUS: "https://api.ciscospark.com/v1/xapi/status/",
    xCommand: {
        AUDIO_SOUND_PLAY: "Audio.Sound.Play",
        AUDIO_SOUND_STOP: "Audio.Sound.Stop",
        AUDIO_VOLUME_SET: "Audio.Volume.Set",
        UI_WEBVIEW_DISPLAY: "UserInterface.WebView.Display",
        UI_WEBVIEW_CLEAR: "UserInterface.WebView.Clear",
        UI_MESSAGE_ALERT_DISPLAY: "UserInterface.Message.Alert.Display",
        UI_MESSAGE_ALERT_CLEAR: "UserInterface.Message.Alert.Clear",
        UI_MESSAGE_TEXTLINE_DISPLAY: "UserInterface.Message.TextLine.Display",
        MESSAGE_TEXTLINE_CLEAR: "UserInterface.Message.TextLine.Clear",
        CALL_DISCONNECT: "Call.Disconnect",
    },
    xStatus: {
        CONFERENCE_PRESENTATION_CALLID: "Conference.Presentation.CallId",
    },
    URL_SINGLEWIRE_NOTIFICATION: "https://api.icmobile.singlewire.com/api/v1/notifications"
};

