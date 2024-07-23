const axios = require('axios');

const HASURA_ENDPOINT = process.env.HASURA_ENDPOINT;
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

const headers = {
  'Content-Type': 'application/json',
  'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
};

exports.getUsers = async () => {
  const query = `
    query {
      users {
        id
        name
        balance
      }
    }
  `;
  const response = await axios.post(HASURA_ENDPOINT, { query }, { headers });
  return response.data.data.users;
};

exports.createUser = async (userData) => {
  const mutation = `
    mutation($name: String!, $balance: Float!) {
      insert_users_one(object: {name: $name, balance: $balance}) {
        id
        name
        balance
      }
    }
  `;
  const variables = {
    name: userData.name,
    balance: userData.balance,
  };
  const response = await axios.post(HASURA_ENDPOINT, { query: mutation, variables }, { headers });
  return response.data.data.insert_users_one;
};

exports.deposit = async (id, amount) => {
  const query = `
    query($id: Int!) {
      users_by_pk(id: $id) {
        id
        balance
      }
    }
  `;
  const response = await axios.post(HASURA_ENDPOINT, { query, variables: { id } }, { headers });
  const user = response.data.data.users_by_pk;

  const newBalance = user.balance + amount;

  const mutation = `
    mutation($id: Int!, $balance: Float!) {
      update_users_by_pk(pk_columns: {id: $id}, _set: {balance: $balance}) {
        id
        balance
      }
    }
  `;
  const updatedUser = await axios.post(HASURA_ENDPOINT, { query: mutation, variables: { id, balance: newBalance } }, { headers });
  return updatedUser.data.data.update_users_by_pk;
};

exports.withdraw = async (id, amount) => {
  const query = `
    query($id: Int!) {
      users_by_pk(id: $id) {
        id
        balance
      }
    }
  `;
  const response = await axios.post(HASURA_ENDPOINT, { query, variables: { id } }, { headers });
  const user = response.data.data.users_by_pk;

  const newBalance = user.balance - amount;

  const mutation = `
    mutation($id: Int!, $balance: Float!) {
      update_users_by_pk(pk_columns: {id: $id}, _set: {balance: $balance}) {
        id
        balance
      }
    }
  `;
  const updatedUser = await axios.post(HASURA_ENDPOINT, { query: mutation, variables: { id, balance: newBalance } }, { headers });
  return updatedUser.data.data.update_users_by_pk;
};
