#!/usr/bin/env node
const { runserver } = require('../../endpoint.js');

exports.command = 'runserver';
exports.desc = 'Start endpoint.';
exports.builder = {};

exports.handler = function( argv ){
    runserver();
}