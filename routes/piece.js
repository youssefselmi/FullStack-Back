var express = require('express');
var router = express.Router();
var Piece = require('../models/piece');
var Composant = require('../models/composant');
const app = express();
app.use(express);



let cors = require("cors");
router.use(cors());



router.get('/', function(req, res, next) {
    Piece.find(
        (err, pieces) => {
            console.log(pieces)

            res.render(
                'piece.twig', {
                    title: "Piece list",
                    cont: pieces
                }
            );
        }
    );
})




router.get("/readpieces", async(req, res) => {
    Piece.find({}, (err, result) => {

        if (err) {
            res.send(err)
        }
        res.send(result)
    })
})









router.post('/addPiece', async function(req, res, next) {

   /* const pieceList = await Promise.all(
        req.body.composants.map(comp => {
            console.log(comp);
            return Composant.findById(comp._id);
        })
    )*/

    new Piece({
        NamePiece: req.body.NamePiece,
        Image: req.body.Image,
        Prix: req.body.Prix,
        Gategorie: req.body.Gategorie,
        Description: req.body.Description,
        Livraison: req.body.Livraison,
        DateFabricaion: req.body.DateFabricaion,
        Marque: req.body.Marque,
       // composants: pieceList
    })

    .save(
        (err, newpiece) => {
            if (err)
                console.log("error message :" + err);
            else {
                console.log(newpiece);
                res.redirect('/piece');
            }
        }
    );
})









router.delete('/delete/:id', async(req, res) => {

    const id = req.params.id;
    await Piece.findByIdAndRemove(id).exec();
    res.send("deleted");
    //if (err)
    //  console.log(err);
    //  res.redirect('/composant');

});







router.get("/getpiece/:id", async(req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;

        const userindividual = await Piece.findById({ _id: id });
        console.log(userindividual);
        res.status(201).json(userindividual)

    } catch (error) {
        res.status(422).json(error);
    }
});





router.put("/updatepiece/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const updatecomposant = await Piece.findByIdAndUpdate(id, req.body, {
            new: true
        });

        console.log(updatecomposant);
        res.status(201).json(updatecomposant);

    } catch (error) {
        res.status(422).json(error);
    }
})









module.exports = router;