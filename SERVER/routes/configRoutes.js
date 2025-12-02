const indexR = require("./index");
const usersR = require("./userRoutes");
const issuesR = require("./issueRoutes");
const roomsR = require("./roomRoutes");
const reservationsR = require("./reservationRoutes");
const paymentsR = require("./paymentRoutes");
const noticesR = require("./noticeRoutes");
const notificationsR = require("./notificationRoutes");
const express = require("express");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/issues", issuesR);
  app.use("/rooms", roomsR);
  app.use("/reservations", reservationsR);
  app.use("/payments", paymentsR);
  app.use("/notices", noticesR);
  app.use("/notifications", notificationsR);
  app.use("/uploads", express.static("uploads"));
  app.use("/uploads/issueIMG", express.static("uploads/issueIMG"));

};
