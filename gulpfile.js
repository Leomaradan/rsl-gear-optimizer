const { src, dest } = require("gulp");

const copyRaidData = () => {
  return src("node_modules/raid-data/images/**/*.png").pipe(
    dest("public/assets/")
  );
};

const copyBackend = () => {
  return src("backend/index.php").pipe(dest("build/"));
};

exports.copyRaidData = copyRaidData;
exports.copyBackend = copyBackend;
