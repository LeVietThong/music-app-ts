import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";

// [GET] /search/result
export const result = async (req: Request, res: Response) => {
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

      item["singer"] = singer;
    }

    newSongs = songs;
  }

  res.render("client/pages/search/result", {
    pageTitle: `Kết quả: ${keyword}`,
    keyword: keyword,
    songs: newSongs,
  });
};
