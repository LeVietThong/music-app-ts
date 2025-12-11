const fs = require("fs-extra");

const listFolderCopy = [
  {
    sourceDirectory: "views",
    targetDirectory: "dist/views",
  },
  {
    sourceDirectory: "public",
    targetDirectory: "dist/public",
  },
];

listFolderCopy.forEach((folder) => {
  fs.copy(folder.sourceDirectory, folder.targetDirectory, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `Copied ${folder.sourceDirectory} to ${folder.targetDirectory}`
      );
    }
  });
});
