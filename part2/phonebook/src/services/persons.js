import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject);
};

const deleteNote = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const update = (newObject) => {
  return axios.put(`${baseUrl}/${newObject.id}`, newObject);
};

export default {
  getAll: getAll,
  create: create,
  deleteNote: deleteNote,
  update: update,
};
