import 'dotenv/config'
import express from 'express'
const app = express();
import connectDB from "./config/database.js"
import morgan from 'morgan';
import cors from 'cors'
import Person from './models/Person.js'
import mongoose from 'mongoose';

//connect to database
connectDB()

morgan.token('content', function getBody (req) {
    return JSON.stringify({name: req.body.name, number:req.body.number})
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json()); 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));


//Routes
app.get('/', (req, res) => {
    return res.send("<h1>Welcome to Phonebook</h1>")
})
// route to get whole phonebook
app.get('/api/persons', async (req, res) => {
    try {
        const contacts = await Person.find().lean()
        console.log(contacts)
        res.json(contacts)
        
        
    } catch (error) {
        console.log(error)
    }
    
})
// route to get a single phonebook entry
app.get('/api/persons/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id)
        res.json(person)
    } catch (error) {
        console.log("Person not found in phonebook", error)
    }
})

app.get('/info',async (req, res) => {
    const numberOfContacts = await Person.countDocuments()
    res.send(`<p>Phonebook has info for ${numberOfContacts} people</p><p>
        ${ new Date()}
    </p>`)
})

function generateId() {
    return Math.floor(Math.random() * 100000)
}

//route for adding new persons in the phonebook
app.post('/api/persons', (req,res) => {
    const body = req.body

    if(!body.name && !body.phone) {
        return res.status(400).json({
            error: "name or phone missing"
        })
    }

    const newPerson = new Person(
        {
            name: body.name,
            number: body.number || false
        }
    )

    newPerson.save().then(result => {
        console.log("Contact saved!")
        
    })

   /*  if(phonebook.find(p=> p.name === newPerson.name)) {
        return res.status(409).json({error: "name must be unique"})
    }else {
        phonebook = phonebook.concat(newPerson)
    } */
    
    res.json(newPerson)
})

/* app.delete('/api/persons/:id',async (req,res) => {
    
    await Person.deleteOne({_id: ObjectId(req.params.id)})
    res.status(204).end()
}) */

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
