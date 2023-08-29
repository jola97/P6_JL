// Importations des packages
const { error, log } = require('console');
const Sauce = require('../models/Sauce');
const fs = require('fs');
require('dotenv').config()


// Exportations des routes (La logique metier)
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        _userId: req.auth.userId,
        //imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        imageUrl: `${process.env.DEV}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistré !' })})
    .catch( error => { res.status(400).json( error ) })
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        //imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        imageUrl: `${process.env.DEV}/images/${req.file.filename}`
    } : {
        ...req.body
    };
    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId ) {
                res.status(401).json({ message: 'Non autorisé !'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id:req.params.id})
                    .then(() => res.status(200).json({ message: 'Sauce mofidiée !'}))
                    .catch((error) => res.status(400).json({ error }))
            }
        })
        .catch((error) => res.status(400).json({ error })) 
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then( sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé'})
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id})
                        .then(() => res.status(200).json({ message: 'Sauce suprimée !'}))
                        .catch((error) => res.status(401).json({ error }))
                });
            }
        })
        .catch((error) => {res.status(500).json({ error })})
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

exports.likeAndDislikeSauce = (req, res, next) => {
    // Maj de la sauce dans la BDD
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

    switch (req.body.like) {
        
        case 1:
            // Condition >> Si l'userId n'est pas ds le Array usersLiked et si like === 1 on ajoute le userId ds le Array usersLiked
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Un like ajouté (+1) !" }))
                    .catch((error) => res.status(400).json({ error }))
            }             
            break;

        case -1:    
            // Condition >> Si l'userId n'est pas ds le Array usersDisliked et si dislike === 1 on ajoute le userId ds le Array usersDisliked
            if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Un dislike ajouté (+1) !" }))
                    .catch((error) => res.status(400).json({ error }))

            }
            break;

        case 0: 
            // Condition >> Si l'userId est ds le Array usersLiked et si like === 0 on enlève le userId ds le Array usersLiked
            if (sauce.usersLiked.includes(req.body.userId)) {
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Un like supprimé (0) !" }))
                    .catch((error) => res.status(400).json({ error }))

            // Condition >> Si l'userId est ds le Array usersDisliked et si dislike === 0 on enlève le userId ds le Array usersDisliked
            } else if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) 
            {
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Un dislike supprimé (0) !" }))
                    .catch((error) => res.status(400).json({ error }))
            }
            break;
    }   
        }) 
        .catch((error) => res.status(404).json({ error }))
}