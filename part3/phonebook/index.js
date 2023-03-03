const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
let persons = [];
const Person = require("./models/person");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("build"));

Person.find({}).then((result) => {
  const personsJson = result.map((person) => person.toJSON());
  persons = personsJson;
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    const personsJson = result.map((person) => person.toJSON());
    persons = personsJson;
    console.log(persons);
    response.json(result);
  });
});

app.post("/api/persons/", (request, response, next) => {
  const id = getRandomInt(1, 10000);
  const body = request.body;
  console.log(body);
  if (
    body.hasOwnProperty("name") &&
    body.hasOwnProperty("number") &&
    !persons.find((person) => person.name === request.body.name)
  ) {
    const person = new Person({
      name: body.name,
      number: body.number,
      _id: id,
    });
    person
      .save()
      .then((savedPerson) => {
        response.json(savedPerson);
      })
      .catch((error) => next(error));
  } else {
    if (!body.name) {
      response.status(400).json({ error: "name is missing" });
    } else if (!body.number) {
      response.status(400).json({ error: "number is missing" });
    } else {
      response.status(400).json({ error: "user exists" });
    }
  }
});

app.get("/info", (request, response) => {
  response.send(
    "Persons has info for " + persons.length + " people <br>" + new Date()
  );
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = Number(request.params.id);
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = Number(request.params.id);
  Person.deleteOne({ _id: id })
    .then((result) => {
      console.log(result);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = Number(request.params.id);
  const number = request.body.number;
  Person.findOneAndUpdate({ _id: id }, { number: number })
    .then((result) => {
      console.log("result is:", result);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
