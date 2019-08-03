import { Request, Response } from "express";
import express from "express";
import { orderDocument, Order } from '../models/Order';

const router = express.Router();


router.get('/', function (req: Request, res: Response) {

  Order.find({}, function (err, docs) {
    if (err) {
      res.status(500);
      res.json({ error: "unable to find order" });
    }
    res.status(200).json(docs);
  });
});

router.get(`/:id`, function (req: Request, res: Response) {
  const id = req.params.id;
  Order.findById(id, function (err, docs) {
    if (err) {
      res.status(500).json({ error: "unable the get order" });
    }
    res.status(200).json(docs)
  });
})

router.post('/', function (req: Request, res: Response) {
  const orderInfo: orderDocument = req.body;
  const newOrder = new Order(orderInfo);
  newOrder.save(function (err, order) {
    if (err) {
      res.status(500);
      res.json({ error: "uable to insert the order" });
    }
    res.status(200);
    res.json(order);
  });
})

export default router;