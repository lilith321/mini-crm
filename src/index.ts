import express from "express";

interface Contact {
    id: number;
    firstName?: string;
    lastName?: string;
    email: string;
}

const contacts: Contact[] = [
    {id: 1, firstName: "Ana", lastName: "Petrova", email: "ana@example.com"},
    {id: 2, firstName: "Ben", lastName: "Carter", email: "ben@example.com"},
    {id: 3, firstName: "Chloe", lastName: "Nguyen", email: "chloe@example.com"},
    {id: 4, firstName: "David", lastName: "Smith", email: "david@example.com"}
];

const app = express();

app.use(express.json());

app.get("/contacts", ( req, res) => {
    res.json(contacts);
});

app.get("/contacts/:id", (req, res) => {
    const id = Number(req.params.id);
    const contact = contacts.find(c => c.id === id);
    if (!contact) {
        res.status(404).json({error: "Contact not found"});
        return;
    }
    res.json(contact);
});

app.post("/contacts", (req, res) => {
    if (!req.body.email || typeof req.body.email !== "string") {
        res.status(400).json({error: "Missing or invalid required field: email"});
        return;
    }

    const email = req.body.email.toLowerCase();

    const existingContact = contacts.find(c => c.email === email);
    if (existingContact) {
        res.status(409).json({error: "Contact with this email already exists"});
        return;
    }

    const newContact: Contact = {
        id: contacts.length + 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email
    };
    
    contacts.push(newContact);
    res.status(201).json(newContact);
});

app.listen(3000, () => {
    console.log("API running at http://localhost:3000");
});
