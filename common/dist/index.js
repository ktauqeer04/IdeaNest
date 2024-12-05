"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogInputs = exports.createBlogInputs = exports.signinInputs = exports.signupInputs = void 0;
const zod_1 = require("zod");
exports.signupInputs = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4),
    name: zod_1.z.string().optional()
});
exports.signinInputs = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4),
});
exports.createBlogInputs = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string().min(10),
});
exports.updateBlogInputs = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string().min(10),
    id: zod_1.z.string()
});
