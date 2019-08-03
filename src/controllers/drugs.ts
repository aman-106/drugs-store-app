import { Request, Response } from "express";
import express from "express";
import { Drug, DrugDocument } from '../models/Drug';

const router = express.Router();

router.get("/", function (req: Request, res: Response) {
    Drug.find({}, function (err, docs) {
        if (err) {
            res.status(500);
            res.json({ error: "unalble to get all drugs" });
        }
        res.status(200).json(docs);
    });
});

router.get("/:id", function (req: Request, res: Response) {
    const id = req.params.id;
    Drug.findById(id, function (err, drug) {
        if (err) {
            res.status(500);
            res.json({ error: "unalble to get drug" });
        }
        res.status(200).json(drug);
    });
});

router.post("/", function (req: Request, res: Response) {
    const drugInfo: DrugDocument = req.body;
    const drug = new Drug(drugInfo);
    drug.save(function (err, drug) {
        if (err) {
            res.status(500);
            res.json({ error: "unable to insert new drug" });
        }
        res.status(200).json(drug);
    });
});

router.put("/:id", function (req: Request, res: Response) {
    const { id } = req.params;
    const drugUpdateInfo = req.body;
    if (!drugUpdateInfo) {
        res.status(400);
        res.send({ error: "request is invalid " });
    }
    // if(drugUpdateInfo.name || drugUpdateInfo.quantity  || drugUpdateInfo.sellingPrice  || drugUpdateInfo.costPrice ){
    Drug.findByIdAndUpdate(id, drugUpdateInfo, function (err, drug) {
        if (err) {
            res.status(500);
            res.json({ error: "unable to update drug" });
        }
        res.status(200).json(drug);
    });
    // }else{

    // }

});

export default router;


