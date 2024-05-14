import fs from "fs";

let albums = [];

function SyncDB() {
  console.log("Sync the db");
  albums = JSON.parse(fs.readFileSync("data/albums.json").toString());
  console.log("Sync albums->", albums.length);
}

function SaveDBToJson(jsonToSave) {
  fs.writeFileSync("data/albums.json", JSON.stringify(jsonToSave, null, 4));
}

SyncDB();

function GetAllAlbums(req, res) {
  res.status(200).json({
    status: "success",
    results: albums.length,
    data: albums,
  });
}

function GetAlbum(req, res) {
  console.log(albums);
  const album = albums.find((x: { id: string }) => x.id == req.params.id);

  if (typeof album != "undefined") {
    res.status(200).json({
      status: "success",
      data: album,
    });
  } else {
    res.status(404).json({ status: "fail", message: "invalid id" });
  }
}

const UpdateAlbum = (req, res) => {
  let album = albums.find((x: { id: string }) => x.id == req.params.id);

  if (typeof album != "undefined") {
    const target_object = req.body;
    const keys_1 = Object.keys(album);

    for (const [key_1, value] of Object.entries(target_object)) {
      keys_1.forEach((key) => {
        if (key == key_1) {
          console.log("modify ", key_1);
          console.log("current_value ", album[key_1]);
          console.log("new_value ", target_object[key]);
          album[key_1] = target_object[key];
        }
      });
    }

    albums[req.params.id] = album;
    SaveDBToJson(albums);
    res.status(200).json({
      status: "success",
      data: album,
    });
  } else {
    res.status(404).json({ status: "fail", message: "invalid id" });
  }
};

const CreatAlbum = (req, res) => {
  const Id = albums[albums.length - 1].id + 1;
  const newAlbum = Object.assign({ id: Id }, req.body);
  albums.push(newAlbum);
  SaveDBToJson(albums);
  SyncDB();
  res.status(201).json({
    status: "success",
    data: newAlbum,
  });
};

const DeleteAlbum = (req, res) => {
  console.log("q albums->", albums.length);
  const result = albums.filter((album) => album.id != req.params.id);
  console.log("q albums->", result.length);

  let album = albums.find((x: { id: string }) => x.id == req.params.id);

  if (typeof album != "undefined") {
    SaveDBToJson(result);
    SyncDB();
    res.status(200).json({
      status: "Ok",
    });
  } else {
    res.status(404).json({ status: "fail", message: "invalid id" });
  }
};

const exp = { GetAllAlbums, DeleteAlbum, CreatAlbum, GetAlbum, UpdateAlbum };
export default exp;