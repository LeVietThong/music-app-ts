import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import { systemConfig } from "../../config/system";
import { convertToSlug } from "../../helpers/convertToSlug";

// [GET] /admin/topics/
export const index = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false
  });

  res.render("admin/pages/topics/index", {
    pageTitle: "Quản lý chủ đề",
    topics: topics
  });
};

// [GET] /admin/topics/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/topics/create", {
    pageTitle: "Thêm mới chủ đề",
  });
};

// [POST] /admin/topics/create
export const createPost = async (req: Request, res: Response) => {
  const dataTopic = {
    title: req.body.title,
    avatar: req.body.avatar,
    status: req.body.status,
    slug: convertToSlug(req.body.title),
  };

  const topic = new Topic(dataTopic);
  await topic.save();

  res.redirect(`/${systemConfig.prefixAdmin}/topics`);
};

// [GET] /admin/topics/edit/:id
export const edit = async (req: Request, res: Response) => {
  const id = req.params.id;

  const topic = await Topic.findOne({
    _id: id,
    deleted: false,
  });

  res.render("admin/pages/topics/edit", {
    pageTitle: "Chỉnh sửa chủ đề",
    topic: topic,
  });
};

// [PATCH] /admin/topics/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  const id = req.params.id;

  const dataTopic: {
    title: any;
    status: any;
    slug: string;
    avatar?: any;
  } = {
    title: req.body.title,
    status: req.body.status,
    slug: convertToSlug(req.body.title),
  };

  if (req.body.avatar) {
    dataTopic.avatar = req.body.avatar;
  }

  await Topic.updateOne(
    {
      _id: id,
      deleted: false,
    },
    dataTopic
  );

  res.redirect(`/${systemConfig.prefixAdmin}/topics`);
};

// [DELETE] /admin/topics/delete/:id
export const deleteTopic = async (req: Request, res: Response) => {
  const id = req.params.id;

  await Topic.updateOne(
    {
      _id: id,
      deleted: false,
    },
    {
      deleted: true,
      deleteAt: new Date(),
    }
  );

  res.json({
    code: 200,
    message: "Xóa chủ đề thành công",
  });
};
