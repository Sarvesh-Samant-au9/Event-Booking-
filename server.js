const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();
// app.use(bodyParser.json());
app.use(express.json());

const events = [];

//only one end point for graphql
app.use(
  "/graphql",
  graphqlHttp.graphqlHTTP({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }
    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }
    type RootQuery {
        events: [Event!]!
    }
    type RootMutation {
        createEvent(eventInput: EventInput): Event
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
      events: () => {
        // return ["Sarvesh", "Liverpool", "GraphQl Project", "Dacebiik"];
        return events;
      },
      createEvent: (args) => {
        // const eventName = args.name;
        // return eventName;
       // args.title wont work it remains undefined because of rootnutation which has eventinput
        const event = {
          id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date,
        };
        events.push(event);
        return event
      },
    },
    graphiql: true,
  })
);
app.listen(5000);
