function rebaseFrom(rebaseOption, rebaseToOption) {
  if (undefined !== rebaseToOption) {
    return true;
  } else if (undefined === rebaseOption) {
    return false;
  } else {
    return !!rebaseOption;
  }
}

module.exports = rebaseFrom;
