const express = require('express')
const routes = express()
const fs = require('fs')
const Model = require ('../models')


routes.use(express.json())
routes.use(express.urlencoded({extended: true}))


routes.get('/:id/result', (req, res) => {
    console.log("Masuk ke result alcohol ===>", Number(req.params.id), req.query,req.body)
    Model.User.findOne({where: {id: req.params.id}})
    .then ((result) => {
        console.log("Result Masuk ke enrolled student ===>", result.dataValues)
        Model.Alcohol.findAll({
            include: [{
                model: Model.User,
                where: {id : req.params.id}
            }]
        })
        .then((resultAlcohol) => {
            console.log("Result Masuk ke enrolled student findAll Alcohol ===>", resultAlcohol[0].dataValues.Users[0].dataValues.UserAlcohol)
            console.log("Untuk inside Looping ===>", resultAlcohol[0].dataValues)
            // var scoreName = []
            // for(let alcoholList of resultAlcohol) {
            //     for(let subjectList of studentList.dataValues.Subjects) {
            //         scoreName.push(getScoreLetter(subjectList.SubjectStudent.dataValues.score))
            //     }
            // }
            // console.log("Hasil Looping Score Letter", scoreName)
            
            res.render('alcohol', {
                message: 'All Alcohol Data based on User',
                title: 'List Alcohol',
                usersData : result.dataValues,
                alcoholsData : resultAlcohol
            })
        })
    })
    .catch ((err) => {
        console.log("Terjadi error =====>",  err)
        res.send(err)
    })
})


routes.get('/:id/result', (req, res) => {
    console.log("Masuk ke result ===>", req.params)
    Model.Alcohol.findByPk(req.params.id)
    .then ((result) => {
        console.log("Result Masuk ke enrolled student ===>", result.dataValues)
        Model.User.findAll({
            include: [{
                model: Model.Alcohol,
                where: {id : req.params.id}
            }]
        })
        .then((resultUser) => {
            console.log("Result Masuk ke enrolled student findAll Student ===>", resultUser[0].dataValues.Alcohols[0].dataValues.UserAlcohol)
            console.log("Untuk inside Looping ===>", resultUser[0].dataValues)
            // var scoreName = []
            // for(let userList of resultUser) {
            //     for(let alcoholList of userList.dataValues.Alcohols) {
            //         scoreName.push(getScoreLetter(subjectList.SubjectStudent.dataValues.score))
            //     }
            // }
            // console.log("Hasil Looping Score Letter", scoreName)
            
            res.render('alcohol', {
                message: 'Rekomendasi untuk Anda',
                title: 'Rekomendasi',
                alcoholsData : result.dataValues,
                usersData : resultUser
            })
        })
    })
    .catch ((err) => {
        console.log("Terjadi error =====>")
        res.send(err)
    })
})

routes.get('/:id/result', (req,res) => {
    console.log("Awal Result Alcohol input", req.params, req.query)
    Model.UserAlcohol.findByPk(req.params.id)
    .then (result => {
        console.log("masuk ejs Result Alcohol", result)
        console.log("Subjectsdata dalam ejs", result.dataValues)
        res.render('alcohol', {
            message: 'Rekomendasi untuk Anda',
            title: 'Rekomendasi untuk Anda',
            alcoholsData : result.dataValues
        })
    })
    .catch (err => {
        res.send(err)
    })
})

routes.post('/:id/give-score', (req, res) => {
    console.log("Hasil Give Score ===>", req.params, req.body)
    Model.SubjectStudent.findByPk(req.params.id)
    .then(result => {
        result.score = req.body.score
        result.updatedAt = new Date ()
        return result.save()
    })
    .then((result) => {
        res.redirect(`/subjects/${req.body.SubjectId}/enrolled-students`)
    })
    .catch ((err) => {
        res.send(err)
    })
    
    // Model.SubjectStudent.update (req.body.score, {where: {
    //     id: req.params.id
    // }})
})


routes.post('/:id/enrolled-student', (req, res) => {})

routes.get('/edit/:id', (req,res) => {
    console.log("Edit bro ==>", req.params.id)
    Model.Subject.findByPk (req.params.id)
    .then ((result)=>{
        console.log("Ini result ====> ", result.dataValues.id)
        res.render('subjectsedit', {
            message: 'Edit Data Subject',
            title: 'Edit Data',
            subjectsData : result.dataValues
        })
    })
    .catch ((err) => {
        res.send(err)
    })
    
})

routes.post('/edit/:id', (req,res) => {
    console.log("Hasil Edit ===>", req.params, req.body)
    Model.Subject.update (req.body, {where: {
        id: req.params.id
    }})
    .then((result) => {
        res.redirect('/subjects')
    })
    .catch ((err) => {
        res.send(err)
    })
})

routes.get('/delete/:id', (req,res) => {
    console.log("Yuk Delete", req.params, req.body)
    Model.Subject.destroy ({where: {
        id: req.params.id
    }})
    
    .then((result) => {
        res.redirect('/subjects')
    })
    .catch((err) => {
        res.send(err)
    })
})


module.exports = routes