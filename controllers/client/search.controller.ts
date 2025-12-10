import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";

// [GET] /search/:type
export const result = async (req: Request, res: Response) => {
  const type = req.params.type;
  const keyword: string = `${req.query.keyword}`;
  let newSongs = [];

  if (keyword) {
    const keyWordRegex = new RegExp(keyword, "i");

    //Tạo ra slug không dấu, có thêm dấu - ngăn cách
    const slugRegex = convertToSlug(keyword);
    const stringSlugRegex = new RegExp(slugRegex, "i");

    const songs = await Song.find({
      $or: [{ title: keyWordRegex }, { slug: stringSlugRegex }],
      deleted: false,
      status: "active",
    }).select("avatar title singerId like slug");

    for (const item of songs) {
      const singer = await Singer.findOne({
        _id: item.singerId,
        deleted: false,
      }).select("fullName");

      newSongs.push({
        id: item.id,
        avatar: item.avatar,
        title: item.title,
        like: item.like,
        slug: item.slug,
        singer: {
          fullName: singer.fullName,
        },
      });
    }
  }

  switch (type) {
    case "suggest":
      res.json({
        code: 200,
        message: "Success",
        songs: newSongs,
      });
      break;
    case "result":
      res.render("client/pages/search/result", {
        pageTitle: `Kết quả: ${keyword}`,
        keyword: keyword,
        songs: newSongs,
      });
      break;
    default:
      break;
  }
};
