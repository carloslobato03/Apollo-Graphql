const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

require('dotenv').config({path: 'variables.env'});

const Recipe = require('./models/Recipe');
const User = require('./models/User');

// Bring in GRAPHQL-Express middleware
const {graphiqlExpress, graphqlExpress} = require('apollo-server-express')
const {makeExecutableSchema} = require('graphql-tools');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers')

// Create Schema
const schema = makeExecutableSchema({

    typeDefs,
    resolvers
})

// DATABASE CONNECTION
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MONGO DB CONNECTED"))
    .catch(err => console.log(err));

// Initialize App
const app = express();

// Create GraphiQL App
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}

))


// Connect Schemas with GraphQL
app.use('/graphql',
    bodyParser.json(),
    graphqlExpress({
        schema,
        context: {
            Recipe, 
            User
        }
}));
const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`)
})
