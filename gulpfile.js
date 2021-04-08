const { src, dest } = require('gulp');

const copyRaidData = () => {
  return src('node_modules/raid-data/images/**/*.png')
    .pipe(dest('public/assets/'));
}

exports.copyRaidData = copyRaidData;