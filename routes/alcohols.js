const express = require('express')
const routes = express()
const fs = require('fs')
const Model = require ('../models')
const Verify = require('../middleware/verify')


routes.use(express.json())
routes.use(express.urlencoded({extended: true}))

routes.use((req,res,next) => {
    if(req.session.login) {
        next()
    } else {
        res.redirect('/home')
    }
})


//dari res.redirect(/alcohols/sesuatu.id/result)

routes.get('/:id/result', Verify, (req, res) => {


    console.log("cek session ====>", req.session.login.id)
    console.log("Masuk ke result alcohol ===>", Number(req.params.id), req.query,req.body)
    Model.User.findOne({where: {id: req.params.id}})
    .then ((result) => {
        console.log("Result Masuk ke enrolled student ===>", result.dataValues)
        if(result.dataValues.isAlcohol == 'yes') {
            Model.Alcohol.findAll({where: {
                body: result.drinkBody,
                taste:result.afterTaste,
                CategoryId:2
            }})
            .then((resultAlcohol) => {
                console.log("Untuk inside Looping ===>", resultAlcohol)

                // var scoreName = []
                // for(let alcoholList of resultAlcohol) {
                //     for(let subjectList of studentList.dataValues.Subjects) {
                //         scoreName.push(getScoreLetter(subjectList.SubjectStudent.dataValues.score))
                //     }
                // }
                // console.log("Hasil Looping Score Letter", scoreName)
                
                //Dimatikan supaya data tidak disimpan
                // for(let alcoholList of resultAlcohol) {
                //     console.log("untuk simpan ===> ", result.dataValues.firstName, alcoholList.alcoholName, alcoholList.id)
                //     Model.UserAlcohol.create({
                //         UserId: result.dataValues.id,
                //         AlcoholId: alcoholList.id,
                //         createdAt: new Date(),
                //         updatedAt: new Date ()
                //     })
                // }

                res.render('alcohol', {
                    message: 'All Alcohol Data based on User',
                    title: 'List Alcohol',
                    usersData : result.dataValues,
                    alcoholsData : resultAlcohol
                })
            })
        } else {
            Model.Alcohol.findAll({where: {
                body: result.drinkBody,
                taste:result.afterTaste,
                CategoryId:1
            }})
            .then((resultAlcohol) => {
                console.log("Untuk inside Looping ===>", resultAlcohol)
                
                //Dimatikan supaya data tidak disimpan
                // for(let alcoholList of resultAlcohol) {
                //     console.log("untuk simpan ===> ", result.dataValues.firstName, alcoholList.alcoholName, alcoholList.id)
                //     Model.UserAlcohol.create({
                //         UserId: result.dataValues.id,
                //         AlcoholId: alcoholList.id,
                //         createdAt: new Date(),
                //         updatedAt: new Date ()
                //     })
                // }
                
                res.render('alcohol', {
                    message: 'All Alcohol Data based on User',
                    title: 'List Alcohol',
                    usersData : result.dataValues,
                    alcoholsData : resultAlcohol
                })
            })
        }  
    })
    .catch ((err) => {
        console.log("Terjadi error =====>",  err)
        res.send(err)
    })
})

//TAMPILAN UNTUK MENUNJUKKAN SEMUA ALCOHOL YANG DIPESAN BERDASARKAN BANYAK ORANG
routes.get('/result', (req,res) => {
    Model.Alcohol.findAll({
        include: [{
            model: Model.User,
        }]
    })
    .then (resultAlcohol => {
        console.log("All Data", resultAlcohol)
        // console.log("Result Masuk ke enrolled student findAll Student ===>", resultStudent[0].dataValues.Subjects[0].dataValues.SubjectStudent)
        res.render('alcoholresult', {
            message: 'All Alcohol Data based on Users',
            title: 'List Data',
            alcoholsData : resultAlcohol
        })
    })
    .catch (err => {
        console.log("Terjadi error =====>",  err)
        res.send(err)
    })
})

//TAMPILAN UNTUK MENUNJUKKAN SEMUA USER DAN PESAN ALCOHOL APA
routes.get('/result/user', (req,res) => {
    Model.User.findAll({
        include: [{
            model: Model.Alcohol,
        }]
    })
    .then (resultUser => {
        console.log("All Data", resultUser)
        //console.log("Result Masuk ke findAll Users ===>", resultUser[0].dataValues.Alcohols[0].dataValues.alcoholName)
        res.render('alcoholresultuser', {
            message: 'All User Data based on Alcohol',
            title: 'List Data',
            usersData : resultUser
        })
    })
    .catch (err => {
        console.log("Terjadi error =====>",  err)
        res.send(err)
    })
})

//TAMPILAN UNTUK USER MENAMBAH ALCOHOL
routes.get('/:id/manual', Verify, (req, res) => {
    console.log("Masuk ke result ===>", req.params)
    Model.User.findByPk(req.params.id)
    .then(resultUser => {
        console.log("Hasil User ===> ", resultUser)
        Model.Alcohol.findAll()
        .then (resultAlcohol => {
            console.log("Seluruh Hasil: ", resultAlcohol[0].dataValues)
        // console.log("Result Masuk ke enrolled student findAll Student ===>", resultAlcohol[0].dataValues.Alcohols[0].dataValues.UserAlcohol)
        // console.log("Untuk inside Looping ===>", resultAlcohol[0].dataValues)
        res.render('alcoholadd', {
            message: 'Tambah Alcohol Sesuai Selera Anda',
            title: 'Tambah Alcohol',
            alcoholsData : resultAlcohol,
            usersData: resultUser
        })
    })
        
    })
    .catch ((err) => {
        console.log("Terjadi error =====>")
        res.send(err)
    })
    
})

//TAMPILAN UNTUK USER MENAMBAH ALCOHOL DAN SIMPAN
routes.post('/:id/manual', Verify,(req, res) => {
    console.log("Hasil Tambah Alcohol ===>", req.params, req.body)
    Model.UserAlcohol.create({
        UserId: req.params.id,
        AlcoholId: req.body.id,
        createdAt: new Date(),
        updatedAt: new Date ()
    })

    .then((result) => {
        res.redirect(`/alcohols/${req.params.id}/newresult`)
    })
    .catch ((err) => {
        res.send(err)
    })

})

//TAMPILAN UNTUK USER  MELIHAT SEMUA ALCOHOL YANG DIA SUKA DAN  BISA TAMBAH LAGI
routes.get('/:id/newresult', Verify, (req,res) => {
    console.log("Hasil Summary Tambah Alcohol ===>", req.params, req.body)
    Model.User.findAll({
        where: {id: Number(req.params.id)},
        include: [{
            model: Model.Alcohol,
        }]
    })
    .then (resultUser => {
        console.log("All Data", resultUser)
        //console.log("Result Masuk ke findAll Users ===>", resultUser[0].dataValues.Alcohols[0].dataValues.alcoholName)
        res.render('alcoholresultnew', {
            message: 'User Data based on Alcohol',
            title: 'List Data',
            usersData : resultUser
        })
    })
    .catch (err => {
        console.log("Terjadi error =====>",  err)
        res.send(err)
    })
})


routes.get('/:id/delete', Verify, (req,res) => {
    console.log("Hasil Summary untuk Delete Alcohol ===>", req.params, req.body)
    Model.User.findAll({
        where: {id: Number(req.params.id)},
        include: [{
            model: Model.Alcohol,
        }]
    })
    .then (resultUser => {
        console.log("All Data", resultUser)
        //console.log("Result Masuk ke findAll Users ===>", resultUser[0].dataValues.Alcohols[0].dataValues.alcoholName)
        res.render('alcoholdelete', {
            message: 'User Data based on Alcohol',
            title: 'List Data',
            usersData : resultUser
        })
    })
    .catch (err => {
        console.log("Terjadi error =====>",  err)
        res.send(err)
    })
})

routes.post('/:id/delete', Verify, (req,res) => {
    console.log("Yuk Delete", req.params, req.body)
    Model.UserAlcohol.destroy ({where: {
        UserId: Number(req.params.id),
        AlcoholId: Number(req.body.id)
    }})
    
    .then((result) => {
        res.redirect(`/alcohols/${req.params.id}/newresult`)
    })
    .catch((err) => {
        res.send(err)
    })
})


module.exports = routes