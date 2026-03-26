const truncateText = (text) => {
  if (!text) return "";
  return text.length > 50 ? text.substring(0, 50) + "..." : text;
};

export default truncateText;