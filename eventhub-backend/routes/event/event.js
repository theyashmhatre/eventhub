const router = require("express").Router();
const mysqlConnection = require("../../config/dbConnection");
const passport = require("passport");
const { generatePaginationValues } = require("../../utils/utils");
const jwt = require("jsonwebtoken");

// creates new event
router.post("/create", (req, res) => {
  try {
    let {
      name,
      description,
      startDate,
      endDate,
      categoryId,
      city,
      location,
      maxparticipants,
      price,
      owners: owners,
      ticketSold,
      tagline,
    } = req.body;
    let userToken = req.headers.authorization;

    const newEvent = {
      name: name,
      description: description,
      start: startDate,
      end: endDate,
      category: categoryId,
      city: city,
      location: location,
      maxparticipants: maxparticipants,
      price: price,
      ticket_sold: ticketSold,
      tagline: tagline,
    };

    const { id: ownerId } = jwt.verify(userToken, process.env.secretOrKey);

    console.log(jwt.verify(userToken, process.env.secretOrKey));

    mysqlConnection.query(
      "INSERT INTO event SET ?",
      newEvent,
      (sqlErr, result, fields) => {
        if (sqlErr) {
          return res.status(500).json({
            main: "Something went wrong. Please try again.",
            devError: sqlErr,
            devMsg: "Error occured while adding event into db",
          });
        }
      }
    );

    mysqlConnection.query(
      "SELECT Max(id) from event ",
      (sqlErr, result, fields) => {
        if (sqlErr) {
          return res.status(500).json({
            main: "Something went wrong. Please try again.",
            devError: sqlErr,
            devMsg: "Error occured while getting max id",
          });
        } else {
          let currEventId = result[0]["Max(id)"];
          mysqlConnection.query(
            `INSERT INTO eventhub.event_owner (event_id, owner_id, isAdmin) VALUES (${currEventId},${ownerId}, 1);`
          );

          const convertedArray = owners.map((owner) => ({
            event_id: currEventId,
            owner_id: owner,
          }));

          const values = convertedArray
            .map((owner) => {
              return `(${owner.event_id},${owner.owner_id},0)`;
            })
            .join(",");

          mysqlConnection.query(
            `INSERT INTO event_owner (event_id, owner_id,isAdmin) VALUES ${values}`,
            (err, result) => {
              if (!err) {
                return res
                  .status(201)
                  .json({ devMsg: "New challenge created successfully" });
              } else {
                console.log(err);
                res.status(400);
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      main: "Something went wrong. Please try again.",
      devError: error,
      devMsg: "Error occured while creating event",
    });
  }
});

// update challenge
router.post(
  "/edit/:eventId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      let eventId = req.params.eventId;

      let {
        name,
        description,
        startDate,
        endDate,
        categoryId,
        city,
        location,
        maxparticipants,
        price,
      } = req.body;

      const newEvent = {
        name: name,
        description: description,
        start: startDate,
        end: endDate,
        category: categoryId,
        city: city,
        location: location,
        maxparticipants: maxparticipants,
        price: price,
      };

      //query to find if the challenge exists
      mysqlConnection.query(
        `SELECT * from event where id = ${eventId}`,
        (sqlErr, result, fields) => {
          if (sqlErr) {
            return res.status(500).json({
              main: "Something went wrong. Please try again.",
              devError: sqlErr,
              devMsg: "Error occured while fetching event from db",
            });
          } else if (!result.length) {
            //if no challenge found
            return res.status(200).json({
              main: "No such event exists",
              devMsg: "Event ID is invalid",
            });
          } else {
            /*            // Confirm that user is either super admin or the admin who created this challenge
            if (result[0].user_id != res.req.user.user_id) {
              if (res.req.user.role != roles["super_admin"]) {
                return res.status(200).json({
                  main: "You don't have rights to update",
                  devMsg:
                    "User is niether super admin nor the challenge creator",
                });
              }
            }
*/
            //Storing updated challenge into db
            mysqlConnection.query(
              `UPDATE event SET ? WHERE id = ?`,
              [newEvent, eventId],
              (sqlErr, result, fields) => {
                if (sqlErr) {
                  console.log(sqlErr);
                  return res.status(500).json({
                    main: "Something went wrong. Please try again.",
                    devError: sqlErr,
                    devMsg: "Error occured while updating challenge in db",
                  });
                } else {
                  res
                    .status(200)
                    .json({ main: "Challenge updated Successfully." });
                }
              }
            );
          }
        }
      );
    } catch (error) {
      return res.status(500).json({
        main: "Something went wrong. Please try again.",
        devError: error,
        devMsg: "Error occured while updating challenge",
      });
    }
  }
);

//fetches all the event details
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    mysqlConnection.query("SELECT * from event", (err, rows, fields) => {
      if (!err) {
        res.status(200).send(rows);
      } else {
        console.log(err);
        res.status(400);
      }
    });
  }
);

//fetches all the event if category not passed or request by category if category passed
router.get("/events/:location/:pageNum/:limit", (req, res) => {
  const { location } = req.params;
  const category = req.query.categoryId;

  let { limit, pageNum, offset } = generatePaginationValues(req);

  if (!location || pageNum == null || limit == null)
    return res
      .status(400)
      .json({ main: "Invalid Request", devMsg: "Invalid input parameter" });

  if (category) {
    const query = `SELECT a.id,a.name as eventname,a.tagline,a.description,a.start,a.ticket_sold, a.end,a.city,a.location,a.maxparticipants,a.price,b.name as category FROM event a, event_type b where a.category=b.id & b.id=? and a.city=? limit ${limit} offset ${offset};`;
    mysqlConnection.query(query, [category, location], (err, rows, fields) => {
      if (!err) {
        res.status(200).send(rows);
      } else {
        console.log(err);
        res.status(400);
      }
    });
  } else {
    const query = `SELECT a.id,a.name as eventname,a.tagline,a.description,,a.ticket_sold, a.start,a.end,a.city,a.location,a.maxparticipants,a.price,b.name as category FROM event a, event_type b where a.category=b.id and a.city=? limit ${limit} offset ${offset};`;
    mysqlConnection.query(query, location, (err, rows, fields) => {
      if (!err) {
        res.status(200).send(rows);
      } else {
        console.log(err);
        res.status(400);
      }
    });
  }
});

//fetches details of the requested event
router.get("/eventDetail/:eventId", (req, res) => {
  const { eventId } = req.params;

  if (!eventId)
    return res
      .status(400)
      .json({ main: "Invalid Request", devMsg: "No event id found" });

  const queryForEvent =

    "SELECT a.id,a.name as eventname,a.description,a.tagline,a.start,a.end,a.city,a.location,a.maxparticipants,a.price,b.name FROM `event` a,  `event_type` b where a.category=b.id  and a.id=? ;";


  const queryForOwner =
    "SELECT a.email,a.name,a.contact,a.address,a.city,b.isAdmin FROM `user` a, `event_owner` b where a.id=b.owner_id and b.event_id=?";

  //query to find if the event exists
  mysqlConnection.query(
    queryForEvent,
    eventId,
    (sqlErr, eventResult, fields) => {
      if (sqlErr) {
        return res.status(500).json({
          main: "Something went wrong. Please try again.",
          devError: sqlErr,
          devMsg: "Error occured while fetching challenge from db",
        });
      } else if (!eventResult.length) {
        //if no challenge found
        return res.status(200).json({
          main: "No such event exists",
          devMsg: "Event Id is invalid",
        });
      } else {
        //Nested query to fetch owners
        mysqlConnection.query(
          queryForOwner,
          eventId,
          (sqlErr, ownerResult, fields) => {
            if (sqlErr) {
              return res.status(500).json({
                main: "Something went wrong. Please try again.",
                devError: sqlErr,
                devMsg: "Error occured while fetching owners from db",
              });
            } else if (!ownerResult.length) {
              //if no challenge found
              return res.status(200).json({
                main: "No owners exists",
                devMsg: "Event Id is invalid",
              });
            } else {
              let data = {
                event_detail: eventResult,
                owner_count: ownerResult.length,
                owner_detail: ownerResult,
              };
              res.status(200).json(data);
            }
          }
        );
      }
    }
  );
});

//fetches all the categories.
router.get("/types", (req, res) => {
  mysqlConnection.query(
    "SELECT * from event_type",
    (sqlErr, result, fields) => {
      if (sqlErr) {
        console.log(sqlErr);
        res.status(500).json({
          main: "Something went wrong. Please try again.",
          devError: sqlErr,
          devMsg: "Error occured while fetching from db",
        });
      } else {
        return res.status(200).json(result);
      }
    }
  );
});

//returns search query
router.get("/search/:queryString/:pageNum/:limit", (req, res) => {
  try {
    const { queryString } = req.params;

    let { limit, pageNum, offset } = generatePaginationValues(req);

    if (!queryString)
      return res.status(400).json({
        main: "Invalid Request",
        devMsg: "No query string id found",
      });

    if (!pageNum)
      return res.status(400).json({
        main: "Invalid Request",
        devMsg: "No page number found in the request",
      });

    //query to search for event using a query string
    //checks if the queried string in present in either title or description of any of the event and returns a list of challenge objects as challege_list
    mysqlConnection.query(
      `SELECT * from event where description LIKE '%${queryString}%' OR name LIKE '%${queryString}%' OR tagline LIKE '%${queryString}%' ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset],
      (sqlErr, result, fields) => {
        if (sqlErr) {
          console.log(sqlErr);
          return res.status(500).json({
            main: "Something went wrong. Please try again.",
            devError: sqlErr,
            devMsg: "Error occured while searching event using a query string",
          });
        } else if (!result.length) {
          return res
            .status(200)
            .json({ event_count: result.length, main: "No event found" });
        } else {
          let data = {
            event_count: result.length,
            event_list: result,
          };

          res.status(200).json(data);
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      main: "Something went wrong. Please try again.",
      devError: error,
      devMsg: "Error occured while searching for challenges",
    });
  }
});


module.exports = router;
