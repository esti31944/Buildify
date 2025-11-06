const indexR = require("./index");
const usersR = require("./userRoutes");
// const paymentsR = require("./payments");
// const issuesR = require("./issues");
// const roomsR = require("./rooms");
// const reservationsR = require("./reservations");
// const noticesR = require("./notices");
// const notificationsR = require("./notifications");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
//   app.use("/payments", paymentsR);
//   app.use("/issues", issuesR);
//   app.use("/rooms", roomsR);
//   app.use("/reservations", reservationsR);
//   app.use("/notices", noticesR);
//   app.use("/notifications", notificationsR);
};
