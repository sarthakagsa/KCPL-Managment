const auth = require('../middleware/auth')
const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const Vechile = require('../models/vechile')
const Lr = require('../models/lr')
const Consignor = require('../models/consignor')
const Consignee = require('../models/consignee')

router.post('/lr/:vechileid/:consignorid',auth,async(req,res)=>{
    const vechile_id = req.params.vechileid
    const consignor_id = req.params.consignorid
    try {
        const vechile = await Vechile.findOne({_id : vechile_id,owner : req.user._id})
        if (!vechile) {
            return res.status(400).send({error : 'The vechile is not associated with this user'})
        }
        const consignor = await Consignor.findOne({_id : consignor_id,owner : req.user._id})
        if (!consignor) {
            return res.status(400).send({error : 'The consignor is not associated with this user'})
        }
        const lr = new Lr({
            ...req.body,
            vechileid : vechile_id,
            consignorid : consignor_id
        })
        const newLr = await lr.save()
        res.status(201).send(newLr)
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e.message)
    }
})

// router.patch('/repair/:vechileid/:repairid',auth,async(req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates =['parts','date','cost','invoice','partyname','km','gst']
//     const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid Updates!'})       
//     }
//     req.body.parts.forEach(element => {
//         const partsUpdates = Object.keys(element)
//         const partsAllowedUpdates = ['partname','cost','quantity','hsn']
//         const isValidOperation = partsUpdates.every((update)=>partsAllowedUpdates.includes(update))
//         if (!isValidOperation) {
//             return res.status(400).send({ error: 'Invalid Updates!'})       
//         }
//     })
//     try {
//         const vechile = await Vechile.findOne({_id:req.params.vechileid,owner : req.user._id})        
        
//         //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators : true})
//         if (!vechile) {
//             return res.status(404).send({error : "Vechile is not found"})
//         }

//         const repair = await Repair.findOne({_id: req.params.repairid,vechileid:req.params.vechileid})
//         if (!repair) {
//             return res.status(404).send({error : "The following docs is not found"})
//         }
//         updates.every((update)=> repair[update] = req.body[update] )
//         await repair.save()
//         res.send(repair)
//     } catch (e) {
//         return res.status(404).send(e)
//     }
// })

router.get('/lr/:lrid',auth,async (req,res)=>{
    try {
        const lr = await Lr.findOne({_id: req.params.lrid})
        if (!lr) {
            return res.send({error: ' No such file found'})
        }
        res.send(lr)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/lr/:lrid',auth,async (req,res)=>{
    try {
        const lr = await Lr.findOne({_id: req.params.lrid})
        if (!lr) {
            return res.send({error: ' No such file found'})
        }
        await lr.remove()
        res.send(lr) 
    } catch (error) {
        res.status(400).send(error)
    }
})

//Get All LRS
router.get('/lr/:vechileid/:consignorid',auth,async (req,res)=>{
    try {
        const lr = await Lr.find({vechileid: req.params.vechileid,consignorid : req.params.consignorid})
        if (!lr) {
            return res.send({error: ' No such file found'})
        }
        res.send(lr)
    } catch (error) {
        res.status(400).send(error)
    }
})



module.exports = router