import { Request, Response } from "express";
import express from "express";
const router = express.Router();


router.get('/', function (req: Request, res: Response) {
  res.json([{
    id: 1,
    quantity: 2,
    drugs: [{ id: 1, qt: 1 },]
  }])
});

router.get(`/:id`, function (req: Request, res: Response) {
  res.json({
    id: 1,
    quantity: 2,
    drugs: [{ id: 1, qt: 2 },]
  })
})

router.post('/:id', function (req: Request, res: Response) {
  console.log(req.body);
})

export default router;