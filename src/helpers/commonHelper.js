export const truncate = (text, length) => {
  if (text) {
    if (text.length <= length) {
      return text;
    } else {
      text = text.substr(0, length);
      const lastSpaceIndex = text.lastIndexOf(' ');
      if (lastSpaceIndex === -1) {
        return text + '...';
      } else {
        return text.slice(0, lastSpaceIndex) + '...';
      }
    }
  }
};
