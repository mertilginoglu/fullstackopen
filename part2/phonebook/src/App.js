import { useState, useEffect } from "react";
import axios from "axios";
import personService from "./services/persons.js";

const Filter = ({ onChange, search }) => {
  return (
    <div>
      filter shown with:
      <input onChange={onChange} value={search} />
    </div>
  );
};

const Notification = ({ message, notificationType }) => {
  if (message === null) {
    return null;
  }

  return <div className={notificationType}>{message}</div>;
};

const PersonForm = ({
  onSubmit,
  onNameChange,
  newName,
  onNumberChange,
  newNumber,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input onChange={onNameChange} value={newName} />
      </div>
      <div>
        number: <input onChange={onNumberChange} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, search, setPersons }) => {
  return (
    <div>
      {persons
        .filter((person) => person.name.toLowerCase().includes(search))
        .map((person) => (
          <div key={person.id}>
            {person.name} {person.number}
            <button
              onClick={() => {
                if (window.confirm("Delete " + person.name + "?")) {
                  personService
                    .deleteNote(person.id)
                    .then((response) => console.log(response))
                    .then(() =>
                      personService
                        .getAll()
                        .then((response) => setPersons(response.data))
                    );
                }
              }}
            >
              delete
            </button>
          </div>
        ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState(0);
  const [search, setSearch] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.filter((person) => person.name === newName).length === 1) {
      let currPerson = persons.find((person) => person.name === newName);
      if (
        window.confirm(
          currPerson.name +
            "is already added to phonebook, replace the old number with a new one?"
        )
      ) {
        const personObject = {
          ...currPerson,
          number: newNumber,
        };
        personService
          .update(personObject)
          .then(() =>
            personService.getAll().then((response) => setPersons(response.data))
          )
          .catch((error) => {
            setNotificationMessage(
              "Information of " +
                currPerson.name +
                " has been deleted from the server"
            );
            setNotificationType("error");
          });
      }
      return;
    }
    const personObject = {
      name: newName,
      number: newNumber,
    };
    personService
      .create(personObject)
      .then((response) => {
        console.log(response);
        setPersons(persons.concat(response.data));
      })
      .then(() => {
        setNotificationMessage("Added " + personObject.name);
        setNotificationType("success");
      })
      .catch((error) => {
        setNotificationMessage(error.response.data.error);
        setNotificationType("error");
      });
    setNewName("");
    setNewNumber(0);
    console.log(notificationMessage);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notificationMessage}
        notificationType={notificationType}
      />
      <Filter onChange={handleSearchChange} search={search} />
      <h2>add a new person</h2>
      <PersonForm
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={addPerson}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} setPersons={setPersons} />
    </div>
  );
};

export default App;
