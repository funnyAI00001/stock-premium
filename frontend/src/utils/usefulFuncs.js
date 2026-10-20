const imageUrlFromPlayerName = (name) => {
  if (name === "Juan Manuel Cerundolo") {
    return "/images/players/Juan-Manuel_Cerundolo.jpg";
  } else if (name === "Santiago_Gonzalez") {
    return "/images/players/Santiago_Gonzalez.jpg";
  } else {
    const lastname = name.split(" ");
    return "/images/players/" + lastname[lastname.length - 1] + ".jpg";
  }
};
export default imageUrlFromPlayerName;

export const getInitials = (name = "") =>
  name
    .replace(/\s+/, " ")
    .split(" ")
    .slice(0, 2)
    .map((v) => v && v[0].toUpperCase())
    .join("");

export const offsetInHours = () => {
  const date = new Date();
  const offsetInMinutes = date.getTimezoneOffset();
  const offsetInHours = offsetInMinutes / 60;

  return offsetInHours;
};

export const formatNumber = (num) => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + "B";
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "M";
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + "K";
  }
  
  return num.toString();
};

export const formatDate = (inputDate) => {
  // Split the input date string by "/"
  const parts = inputDate.split("/");

  // Create a new Date object with the parsed parts
  const date = new Date(parts[2], parts[0] - 1, parts[1]);

  // Format the date to 'YYYY-MM-DD' format
  const formattedDate =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");

  return formattedDate;
};