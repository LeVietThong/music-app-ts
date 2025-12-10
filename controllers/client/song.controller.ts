import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";

//[GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
  const topic = await Topic.findOne({
    slug: req.params.slugTopic,
    deleted: false,
    status: "active",
  });

  const songs = await Song.find({
    topicId: topic.id,
    deleted: false,
    status: "active",
  }).select("avatar title slug singerId like");

  for (const song of songs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      deleted: false,
      status: "active",
    });
    song["infoSinger"] = infoSinger;
  }

  res.render("client/pages/songs/list", {
    pageTitle: topic.title,
    songs: songs,
  });
};

//[GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
  const slugSong: string = req.params.slugSong;

  const song = await Song.findOne({
    slug: slugSong,
    deleted: false,
    status: "active",
  });

  const singer = await Singer.findOne({
    _id: song.singerId,
    deleted: false,
    status: "active",
  }).select("fullName");

  const topic = await Topic.findOne({
    _id: song.topicId,
    deleted: false,
    status: "active",
  }).select("title");

  const favoriteSong = await FavoriteSong.findOne({
    userId: "",
    songId: song.id
  });

  song["favorite"] = favoriteSong ? true : false;

  res.render("client/pages/songs/detail", {
    pageTitle: song.title,
    song: song,
    singer: singer,
    topic: topic,
  });
};

//[PATCH] /songs/like/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong;

  const typeLike: string = req.params.typeLike;

  const song = await Song.findOne({
    _id: idSong,
    deleted: false,
    status: "active",
  });

  const newLike: number = typeLike === "like" ? song.like + 1 : song.like - 1;

  await Song.updateOne(
    {
      _id: idSong,
    },
    {
      like: newLike,
    }
  );

  res.json({
    code: 200,
    message: "Like successfully",
    like: newLike,
  });
};

// [PATCH] /songs/favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong;
  const typeFavorite: string = req.params.typeFavorite;

  if(typeFavorite == "favorite") {
    const favoriteSong = new FavoriteSong({
      userId: "",
      songId: idSong
    });
    await favoriteSong.save();
  } else {
    await FavoriteSong.deleteOne({
      userId: "",
      songId: idSong
    });
  }

  res.json({
    code: 200,
    message: typeFavorite == "favorite" ? "Đã thêm vào yêu thích" : "Đã xóa yêu thích"
  });
};

// [PATCH] /listen/:songId
export const listenPatch = async (req: Request, res: Response) => {
  const idSong = req.params.idSong;

  const song = await Song.findOne({
    _id: idSong,
  });

  const listenUpdate: number = song.listen + 1;

  await Song.updateOne({
    _id: idSong,
    status: "active",
    deleted: false
  }, {
    listen: listenUpdate
  });

  const songNew = await Song.findOne({
    _id: idSong,
    status: "active",
    deleted: false
  });

  res.json({
    code: 200,
    message: "Đã cập nhật số lượt nghe!",
    listen: songNew.listen
  });
};
