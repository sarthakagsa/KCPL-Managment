const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Consignee = require('../models/consignee')

router.post('/consignee',auth,async(req,res)=>{
    try {
        const consignee = new Consignee({
            ...req.body,
            owner : req.user._id
        })
        const newConsignee = await consignee.save()
        res.status(201).send(newConsignee)
    }
    catch (e) {
        res.status(400).send(e)
    } 
})

router.get('/consignees/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try {
    //    const task = await Task.findById(_id)

       const consignee = await Consignee.findOne({ _id , owner : req.user._id})
       if(!consignee){
        return res.status(404).send({error:'No consignee Found'})
        }
    res.send(consignee)
    } catch (e) {
        res.status(500).send(e)   
    }
})

router.get('/consignee/me',auth,async(req,res)=>{
    try {
        const consignee = await Consignee.find({owner : req.user._id})
        res.send(consignee)
    } catch (error) {
        res.send(400).error(error)
    }
})

router.patch('/consignee/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates =['consigneename','address']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!'})       
    }
    try {
        const consignee = await Consignee.findOne({_id:req.params.id,owner : req.user._id})
        
        
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators : true})
        if (!consignee) {
            return res.status(404).send({error : "Consignee is not found"})
        }
        updates.every((update)=> consignee[update] = req.body[update] )

        await consignee.save()
        res.send(consignee)
    } catch (e) {
        return res.status(404).send(e)
    }
})

router.delete('/consignee/:id',auth,async(req,res)=>{
    try {
        const consignee = await Consignee.findOne({_id:req.params.id,owner:req.user._id})
        if (!consignee) {
            return res.status(400).send({error : 'No Consignee exist with this user'})
        }
        await consignee.remove()
        res.send(consignee)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = router