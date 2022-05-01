var express = require('express');
var router = express.Router();


var Contact = require('../models/contact');

router.get('/', function(req, res, next) {
    Contact.find(
        (err, contacts) => {
            res.render(
                'form.twig', {
                    title: "Contact list",
                    cont: contacts
                }
            );
        }
    );
})

router.get('/delete/:id', function(req, res, next) {
    Contact.findByIdAndRemove(req.params.id, function(err, docs) {
        if (err)
            console.log(err);
        res.redirect('/contact');

    })
});


router.get('/delete2/:id', function(req, res, next) {
    Contact.findById({ _id: req.params.id }, function(err, docs) {
        if (err)
            console.log(err);
        doc.remove(function(err, Contact) {
            res.redirect('/contact');

        })
    })
});

router.post('/', function(req, res, next) {
    new Contact({
            FullName: req.body.FullName,
            Phone: req.body.Phone
        })
        .save(
            (err, newcontact) => {
                if (err)
                    console.log("error message :" + err);
                else {
                    console.log(newcontact);
                    //  res.json(" : Contact :" + newcontact._id +" added");
                    res.redirect('/contact');

                }
            }
        );
})


module.exports = router;