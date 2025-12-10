import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

//[GET] /favorite-songs
export const index = async (req: Request, res: Response) => {
  const favoriteSongs = await FavoriteSong.find({
    deleted: false,
    userId: "",
  });

  for (const item of favoriteSongs) {
    const song = await Song.findOne({
      _id: item.songId,
      deleted: false,
      status: "active",
    }).select("avatar title slug singerId");

    const singer = await Singer.findOne({
      _id: song.singerId,
      deleted: false,
      status: "active",
    }).select("fullName");

    item["song"] = song;
    item["singer"] = singer;
  }

  res.render("client/pages/favorite-songs/index", {
    pageTitle: "Bài hát yêu thích",
    favoriteSongs: favoriteSongs,
  });
};
