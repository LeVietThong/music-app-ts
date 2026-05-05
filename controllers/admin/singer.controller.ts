import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/system";
import { convertToSlug } from "../../helpers/convertToSlug";

// [GET] /admin/singers/
export const index = async (req: Request, res: Response) => {
  const singers = await Singer.find({
    deleted: false,
  });

  res.render("admin/pages/singers/index", {
    pageTitle: "Quản lý ca sĩ",
    singers: singers,
  });
};

// [GET] /admin/singers/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/singers/create", {
    pageTitle: "Thêm mới ca sĩ",
  });
};

// [POST] /admin/singers/create
export const createPost = async (req: Request, res: Response) => {
  const dataSinger = {
    fullName: req.body.fullName,
    avatar: req.body.avatar,
    status: req.body.status,
    slug: convertToSlug(req.body.fullName),
  };

  const singer = new Singer(dataSinger);
  await singer.save();

  res.redirect(`/${systemConfig.prefixAdmin}/singers`);
};

// [GET] /admin/singers/edit/:id
export const edit = async (req: Request, res: Response) => {
  const id = req.params.id;

  const singer = await Singer.findOne({
    _id: id,
    deleted: false,
  });

  res.render("admin/pages/singers/edit", {
    pageTitle: "Chỉnh sửa ca sĩ",
    singer: singer,
  });
};

// [PATCH] /admin/singers/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  const id = req.params.id;

  const dataSinger: {
    fullName: any;
    status: any;
    slug: string;
    avatar?: any;
  } = {
    fullName: req.body.fullName,
    status: req.body.status,
    slug: convertToSlug(req.body.fullName),
  };

  if (req.body.avatar) {
    dataSinger.avatar = req.body.avatar;
  }

  await Singer.updateOne(
    {
      _id: id,
      deleted: false,
    },
    dataSinger
  );

  res.redirect(`/${systemConfig.prefixAdmin}/singers`);
};

// [DELETE] /admin/singers/delete/:id
export const deleteSinger = async (req: Request, res: Response) => {
  const id = req.params.id;

  await Singer.updateOne(
    {
      _id: id,
      deleted: false,
    },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );

  res.json({
    code: 200,
    message: "Xóa ca sĩ thành công",
  });
};
