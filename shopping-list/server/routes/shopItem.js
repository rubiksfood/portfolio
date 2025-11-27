import express from "express";

// This helps to connect to the database
import db from "../db/connection.js";

// This helps to convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// This router is added as middleware and takes control of requests starting with path /item.
const router = express.Router();

// This helps you get a list of all the items. 
router.get("/", async (req, res) => {
  let collection = await db.collection("shopItems");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This helps you get a single item by id.
router.get("/:id", async (req, res) => {
  let collection = await db.collection("shopItems");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This helps you create a new item.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      amount: req.body.amount,
      notes: req.body.notes,
      isChecked: req.body.isChecked,
    };
    let collection = await db.collection("shopItems");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding item");
  }
});

// This helps you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: req.body,
      // This only updates the fields provided in the request body.
    };

    const collection = await db.collection("shopItems");
    const result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      res.status(404).send("Item not found");
      return;
    }

    // Fetch the updated item
    const updatedItem = await collection.findOne(query);
    res.status(200).json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating item");
  }
});

// This helps you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("shopItems");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting item");
  }
});

export default router;