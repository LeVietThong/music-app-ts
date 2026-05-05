"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const index = (req, res) => {
    res.render("client/pages/dashboard/index", {
        pageTitle: "Dashboard",
    });
};
exports.index = index;
