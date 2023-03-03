const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("arguments needed");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://mertilginoglu:${password}@cluster0.kgikxfi.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log(
      "added " + person.name + " number " + person.number + " to phonebook!"
    );
  });
}

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note);
    });
    mongoose.connection.close();
  });
}
