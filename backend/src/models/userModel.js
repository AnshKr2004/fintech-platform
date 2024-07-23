const axios = require('axios');

const HASURA_ENDPOINT = process.env.HASURA_ENDPOINT;
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

const headers = {
  'Content-Type': 'application/json',
  'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
};

const getUsersQuery = `
  query {
    users {
      id
      name
      balance
    }
  }
`;

const getUserByIdQuery = `
  query($id: Int!) {
    users_by_pk(id: $id) {
      id
      name
      balance
    }
  }
`;

const insertUserMutation = `
  mutation($name: String!, $balance: Float!) {
    insert_users_one(object: {name: $name, balance: $balance}) {
      id
      name
      balance
    }
  }
`;

const updateUserBalanceMutation = `
  mutation($id: Int!, $balance: Float!) {
    update_users_by_pk(pk_columns: {id: $id}, _set: {balance: $balance}) {
      id
      name
      balance
    }
  }
`;

exports.getUsers = async () => {
  const response = await axios.post(HASURA_ENDPOINT, { query: getUsersQuery }, { headers });
  return response.data.data.users;
};

exports.getUserById = async (id) => {
  const variables = { id };
  const response = await axios.post(HASURA_ENDPOINT, { query: getUserByIdQuery, variables }, { headers });
  return response.data.data.users_by_pk;
};

exports.createUser = async (name, balance) => {
  const variables = { name, balance };
  const response = await axios.post(HASURA_ENDPOINT, { query: insertUserMutation, variables }, { headers });
  return response.data.data.insert_users_one;
};

exports.updateUserBalance = async (id, balance) => {
  const variables = { id, balance };
  const response = await axios.post(HASURA_ENDPOINT, { query: updateUserBalanceMutation, variables }, { headers });
  return response.data.data.update_users_by_pk;
};
