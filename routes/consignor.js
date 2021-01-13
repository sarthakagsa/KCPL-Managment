const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Consignor = require('../models/consignor')

router.post('/consignor',auth,async(req,res)=>{
    try {
        const consignor = new Consignor({
            ...req.body,
            owner : req.user._id
        })
        const newConsignor = await consignor.save()
        res.status(201).send(newConsignor)
    }
    catch (e) {
        res.status(400).send(e)
    } 
})

router.get('/consignors/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try {
    //    const task = await Task.findById(_id)

       const consignor = await Consignor.findOne({ _id , owner : req.user._id})
       if(!consignor){
        return res.status(404).send({error:'No consignee Found'})
        }
    res.send(consignor)
    } catch (e) {
        res.status(500).send(e)   
    }
})

router.get('/consignor/me',auth,async(req,res)=>{
    try {
        const consignor = await Consignor.find({owner : req.user._id})
        res.send(consignor)
    } catch (error) {
        res.send(400).error(error)
    }
})

router.patch('/consignor/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates =['consignorname','address']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!'})       
    }
    try {
        const consignor = await Consignor.findOne({_id:req.params.id,owner : req.user._id})
        
        
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators : true})
        if (!consignor) {
            return res.status(404).send({error : "Consignor is not found"})
        }
        updates.every((update)=> consignor[update] = req.body[update] )

        await consignor.save()
        res.send(consignor)
    } catch (e) {
        return res.status(404).send(e)
    }
})

router.delete('/consignor/:id',auth,async(req,res)=>{
    try {
        const consignor = await Consignor.findOne({_id:req.params.id,owner:req.user._id})
        if (!consignor) {
            return res.status(400).send({error : 'No consignee exist with this user'})
        }
        await consignor.remove()
        res.send(consignor)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = router