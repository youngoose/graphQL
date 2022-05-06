const axios = require("axios");
const {
  GraphQLObjectType, 
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');


// // Hardcoded data
// const customers = [
//   {id: '1', name: 'John Doe', email: 'jdoe@gmail.com', age: 35},
//   {id: '2', name: 'John Doe2', email: 'jdoe2@gmail.com', age: 25},
//   {id: '3', name: 'John Doe3', email: 'jdoe3@gmail.com', age: 15},
// ]

// Customer Type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    age: {type: GraphQLInt}
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args:{
        id:{type: GraphQLString}
      },
      resolve(parentValue, args){
        // for(let i = 0; i < customers.length; i++) {
        //   return customers.find((c) => c.id == args.id);
        // } 
        return axios.get('http://localhost:3000/customers/' + args.id)
          .then(res => res.data);
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return axios.get('http://localhost:3000/customers/')
        .then(res => res.data);
      }
    }
  }
});

// Mutataion
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields:{
    addCustomer:{
      type: CustomerType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parentValue, args){
        return axios.post('http://localhost:3000/customers', {
          name: args.name,
          email: args.email,
          age: args.age,
        })
        .then(res => res.data);
      }
    },
    deleteCustomer:{
      type: CustomerType,
      args: {
        id:{type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, args){
        return axios.delete('http://localhost:3000/customers/' + args.id)
        .then(res => res.data);
      }
    },
    editCustomer:{
      type: CustomerType,
      args: {
        id:{type: new GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt}
      },
      resolve(parentValue, args){
        return axios.patch('http://localhost:3000/customers/' + args.id, args)
        .then(res => res.data);
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});