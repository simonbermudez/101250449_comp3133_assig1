const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TypeDefs = require('./schema')
const Resolvers = require('./resolvers.js')

//import ApolloServer
const { ApolloServer } = require('apollo-server-express')

//Store sensitive information to env variables
const dotenv = require('dotenv');
dotenv.config();


//TODO - Replace you Connection String here
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});

//Define Apollo Server
const server = new ApolloServer({
  typeDefs: TypeDefs.typeDefs,
  resolvers: Resolvers.resolvers
})

//Define Express Server
const app = express();
app.use(express.json());
app.use('*', cors());

//Add Express app as middleware to Apollo Server
server.applyMiddleware({app})

//Start listen 
app.listen({ port: process.env.PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`));
