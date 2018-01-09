# Demo Conversational UI with Flexbox

Demo is [here](http://delicious-copper.surge.sh/)

## Project Setup

To install the project dependencies run:

```bash
  yarn
```

## Dev server

To run dev server:

```bash
  yarn run dev
```

## Build

In order to build the project:

```bash
  yarn run build
```

Both dev server and build commands are using [parcel](https://github.com/parcel-bundler/parcel) in the background.

## Chatbot

This demo is using [Dialogflow](https://dialogflow.com/) to create a chatbot agent that replies to the user inputs with small talk. You can check it out in action in the [demo](http://delicious-copper.surge.sh/).

Dialogflow is actually [free](https://dialogflow.com/pricing/) and you can sign up for it. 
Once you have signed up, you can create an agent and then enable the small talk from the menu on the left. Grab the API key from the settings and pass it to the dev server or build commands, exchanging the '1234567890' with your actual key:

```bash
  KEY='1234567890' yarn run dev
  KEY='1234567890' yarn run build
```