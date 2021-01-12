const auth = require('../middleware/auth')
const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const Vechile = require('../models/vechile')
const Repair = require('../models/repair')
const { Router } = require('express')

router.post('/repair/:id',auth,async(req,res)=>{
    const vechile_id = req.params.id
    try {
        const vechile = await Vechile.findOne({_id : vechile_id,owner : req.user._id})
        if (!vechile) {
            return res.status(400).send({error : 'The vechile is not associated with this user'})
        }
        const repair = new Repair({
            ...req.body,
            vechileid : vechile_id
        })
        const newRepair = await repair.save()
        res.status(201).send(newRepair)
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e.message)
    }
})

router.patch('/repair/:vechileid/:repairid',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates =['parts','date','cost','invoice','partyname','km','gst']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!'})       
    }
    req.body.parts.forEach(element => {
        const partsUpdates = Object.keys(element)
        const partsAllowedUpdates = ['partname','cost','quantity','hsn']
        const isValidOperation = partsUpdates.every((update)=>partsAllowedUpdates.includes(update))
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid Updates!'})       
        }
    })
    try {
        const vechile = await Vechile.findOne({_id:req.params.vechileid,owner : req.user._id})        
        
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators : true})
        if (!vechile) {
            return res.status(404).send({error : "Vechile is not found"})
        }

        const repair = await Repair.findOne({_id: req.params.repairid,vechileid:req.params.vechileid})
        if (!repair) {
            return res.status(404).send({error : "The following docs is not found"})
        }
        updates.every((update)=> repair[update] = req.body[update] )
        await repair.save()
        res.send(repair)
    } catch (e) {
        return res.status(404).send(e)
    }
})

router.get('/repair/:repairid',async (req,res)=>{
    const repair = await Repair.findOne({_id: req.params.repairid})
    if (!repair) {
        return res.send({error: ' No such file found'})
    }
    res.send(repair)
})

router.delete('/repair/:repairid',async (req,res)=>{
    const repair = await Repair.findOne({_id: req.params.repairid})
    if (!repair) {
        return res.send({error: ' No such file found'})
    }
    await repair.remove()
    res.send(repair)
})



module.exports = router