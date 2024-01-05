# Simple Chart Application

This repository is a single-page application built with React, TypeScript and Vite. It has Sass as a preprocessor for
styling. The codebase is maintained using ESLint and Prettier to ensure proper code structure and
syntax.

## Specification

App is a very simple candlestick chart.

The candles (public/candles) are in flattened array structure. Each candle is composed of five different
numbers in the following order: open price, high price, low price, close price and volume. Volume is
not visible in the chart and is nullable. Data gaps may occur, empty candles are
represented as single null value. Null candles at the start of the array are ignored, null candles anywhere else
are transformed into candles with open, high, low and close price equal to previous close price.

Box in the top left corner shows information about selected candle.

## Running application locally

To run the application on your local machine, follow these steps:

- Clone this repository.
- Install dependencies by running `npm install`.
- Start the development server with `npm run dev`.

## Documentation

Here are some useful scripts you can run:

- `npm run dev`: Builds the production version and opens the application in development mode.
- `npm run lint`: Runs ESLint to check TS and SCSS code.
- `lint-and-format`: Runs ESLint and Prettier to check and format the code.

### [Test it here](https://simple-chart-app.netlify.app/ 'Link title')
