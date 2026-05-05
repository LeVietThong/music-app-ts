"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSinger = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const system_1 = require("../../config/system");
const convertToSlug_1 = require("../../helpers/convertToSlug");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const singers = yield singer_model_1.default.find({
        deleted: false,
    });
    res.render("admin/pages/singers/index", {
        pageTitle: "Quản lý ca sĩ",
        singers: singers,
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/singers/create", {
        pageTitle: "Thêm mới ca sĩ",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataSinger = {
        fullName: req.body.fullName,
        avatar: req.body.avatar,
        status: req.body.status,
        slug: (0, convertToSlug_1.convertToSlug)(req.body.fullName),
    };
    const singer = new singer_model_1.default(dataSinger);
    yield singer.save();
    res.redirect(`/${system_1.systemConfig.prefixAdmin}/singers`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const singer = yield singer_model_1.default.findOne({
        _id: id,
        deleted: false,
    });
    res.render("admin/pages/singers/edit", {
        pageTitle: "Chỉnh sửa ca sĩ",
        singer: singer,
    });
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const dataSinger = {
        fullName: req.body.fullName,
        status: req.body.status,
        slug: (0, convertToSlug_1.convertToSlug)(req.body.fullName),
    };
    if (req.body.avatar) {
        dataSinger.avatar = req.body.avatar;
    }
    yield singer_model_1.default.updateOne({
        _id: id,
        deleted: false,
    }, dataSinger);
    res.redirect(`/${system_1.systemConfig.prefixAdmin}/singers`);
});
exports.editPatch = editPatch;
const deleteSinger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield singer_model_1.default.updateOne({
        _id: id,
        deleted: false,
    }, {
        deleted: true,
        deletedAt: new Date(),
    });
    res.json({
        code: 200,
        message: "Xóa ca sĩ thành công",
    });
});
exports.deleteSinger = deleteSinger;
