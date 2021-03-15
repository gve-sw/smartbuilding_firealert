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

const request = require("request-promise");
const fs = require('fs');
require('dotenv').config();
constants = require("./constants");


async function broadcastNotification() {
    const option = {
        url: constants.URL_SINGLEWIRE_NOTIFICATION,
        method: "POST",
        json: true,
        headers: {
            'Content-Type': 'application/json'
        },
        auth: {
            'bearer': process.env.SINGLEWIRE_ACCESSTOKEN,
        },
        body: {
            'distributionListIds': [process.env.SINGLEWIRE_DISTRIBUTION_ID],
            'messageTemplateId': process.env.SINGLEWIRE_MESSAGE_TEMPLATE_ID,
        }
    };

    return request(option);
}


async function updateTenants() {
    const option = {
        url: constants.URL_SINGLEWIRE_UPDATETENANT,
        method: 'POST',
        json: true,
        formData: {
            data: {
                value: fs.createReadStream('test.csv'),
                options: {
                    filename: 'data',
                    contentType: 'text/csv'
                }
            }
        },
        headers: {
            'content-type': 'multipart/form-data'
        },
        auth: {
            'bearer': process.env.SINGLEWIRE_ACCESSTOKEN,
        },
    };
    return request(option);
}


module.exports = {
    broadcastNotification,
    updateTenants
};
