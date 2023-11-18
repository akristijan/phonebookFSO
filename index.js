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
app.get('/api/persons', async (req, res, next) => {
    try {
        const contacts = await Person.find().lean()
        console.log(contacts)
        res.json(contacts)
        
        
    } catch (error) {
        next(error)
    }
    
})
// route to get a single phonebook entry
app.get('/api/persons/:id', async (req, res, next) => {
    try {
        const person = await Person.findById(req.params.id)
        res.json(person)
    } catch (error) {
        console.log("Person not found in phonebook", error)
        next(error)
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

    res.json(newPerson)
})

app.put('/api/persons/:id', async (req, res, next) => {
    try {
        await Person.findByIdAndUpdate(req.params.id, { number: req.body.number})
        
    } catch (error) {
        next(error)
        console.log(error)
    }
})

app.delete('/api/persons/:id',async (req,res,next) => {

    try {
        await Person.deleteOne({_id: req.params.id})
        res.status(204).end()
    } catch (error) {
        console.log(error)
        next(error)
    }
    
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  // this has to be the last loaded middleware.
  app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
