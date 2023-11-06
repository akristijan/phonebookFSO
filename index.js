import express from 'express'
const app = express();
import morgan from 'morgan';
import cors from 'cors'


morgan.token('content', function getBody (req) {
    return JSON.stringify({name: req.body.name, number:req.body.number})
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json()); 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));


let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//Routes
app.get('/', (req, res) => {
    return res.send("<h1>Welcome to Phonebook</h1>")
})
// route to get whole phonebook
app.get('/api/persons', (req, res) => {
    return res.json(phonebook)
})
// route to get a single phonebook entry
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = phonebook.find( person => person.id === id)
    if(person) {
        return res.json(person)
    } else {
        return res.status(204).send("Person not found in phonebook")
    }
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${phonebook.length} people</p><p>
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

    const newPerson = {
        id: generateId(),
        name: body.name,
        phone: body.phone || false
    }

    if(phonebook.find(p=> p.name === newPerson.name)) {
        return res.status(409).json({error: "name must be unique"})
    }else {
        phonebook = phonebook.concat(newPerson)
    }
   
    res.json(newPerson)
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    phonebook = phonebook.filter(p => p.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
