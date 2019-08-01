import { Request, Response } from "express";
import express from "express";
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
const router = express.Router();

var blogSchema = new Schema({
    title: String,
    author: String,
    body: String,
});


var BLog = mongoose.model('BLog', blogSchema);
var blog = BLog({
    title: 'String',
    author: 'String',
    body: 'String',
});

const mockData = {
    drugsList: [
        {
            name: "1235",
            id: 1,
            quantity: 1,
        },
        {
            name: "1233",
            id: 12,
            quantity: 11,
        }
    ],
    selectedDrug: {
        name: "1233",
        id: 12,
        quantity: 11,
    },
};
router.get("/", function (req: Request, res: Response) {

    blog.save(function (err:any, b:any) {
        if (err) return console.error(err);
        console.log('skkdkd'+b);
      });

    res.json(mockData.drugsList);
});

router.get("/:id", function (req: Request, res: Response) {
    res.json(mockData.selectedDrug);
});

router.post("/", function (req: Request, res: Response) {
    console.log(req.body);
});

router.put("/", function (req: Request, res: Response) {
    console.log(req.body);
});

export default router;




