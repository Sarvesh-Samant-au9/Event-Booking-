const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();
const mongoose = require("mongoose");
const Event = require("./Models/event");

// app.use(bodyParser.json());
app.use(express.json());

// const events = [];

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
        // return events;
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc };
            });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createEvent: (args) => {
        // const eventName = args.name;
        // return eventName;
        // args.title wont work it remains undefined because of rootnutation which has eventinput so nested object is created.
        // const event = {
        // _id: Math.random().toString(),
        // title: args.eventInput.title,
        // description: args.eventInput.description,
        // price: +args.eventInput.price,
        // date: args.eventInput.date,
        // };
        // console.log(args)
        // events.push(event);
        // return event;
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://Sarvesh:AdminSarvesh@cluster0.jl5se.mongodb.net/managementEvent?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log(`Mongo Started`);
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

// app.listen(5000);
