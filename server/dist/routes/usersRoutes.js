"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Userrouter = (0, express_1.Router)();
Userrouter.post('/signin');
Userrouter.post('/signup');
exports.default = Userrouter;
