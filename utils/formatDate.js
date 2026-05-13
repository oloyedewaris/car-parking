const convertDate = (date) => {
  const d = date ? new Date(date) : new Date();
  return [
    d.getFullYear(),
    ("0" + (d.getMonth() + 1)).slice(-2),
    ("0" + d.getDate()).slice(-2),
  ].join("-");
};

export default convertDate;

export const formatAMPM = (date) => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

export const formattedDateToUse = (date) =>
  `${new Date(date).toLocaleDateString()} ${formatAMPM(new Date(date))}`;

export function combineDateAndTime(dateA, dateB) {
  const dateObjA = new Date(dateA);
  const dateObjB = new Date(dateB);

  const year = dateObjA.getFullYear();
  const month = dateObjA.getMonth();
  const day = dateObjA.getDate();

  const hours = dateObjB.getHours();
  const minutes = dateObjB.getMinutes();
  const seconds = dateObjB.getSeconds();

  return new Date(year, month, day, hours, minutes, seconds);
}
