import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllCacVerifiedEvents,
  getAllEmergencyEvents,
  getAllEvents,
  getAllEventsByRatings,
  getEvent,
  updateEvent,
} from "../controllers/eventController.js";

const router = express.Router();
router
  .route("/alias/:id")
  .get(getAllEventsByRatings, getAllEvents)
  .get(getAllEmergencyEvents, getAllEvents)
  .get(getAllCacVerifiedEvents, getAllEvents);
router.route("/").post(createEvent).get(getAllEvents);
router.route("/:id").get(getEvent).patch(updateEvent).delete(deleteEvent);
export default router;
