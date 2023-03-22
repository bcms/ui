# BCMS UI

Core module of the [BCMS](https://github.com/becomesco/cms). It is a dashboard for the BCMS and provides UI features.

## For developers

To develop BCMS UI you will need to install few tools on you computer:

- [Docker](https://www.docker.com/),
- [Docker Compose](https://docs.docker.com/compose/),
- [NodeJS 14+](https://nodejs.org/) and
- [NPM](https://www.npmjs.com/)

You can use [YARN](https://yarnpkg.com/) but NPM is recommended.

- Install dependencies with: `npm i`
- Start development by running `docker-compose up`. You can also run `docker-compose -f docker-compose-standalone.yml up` if you only want to start UI container.
- While in development, if you install new dependency or
  change any file outside the `src` directory, you will need
  to run `docker-compose build` command

## Feature management

All features are loaded using [bcmsFeatureLoader](./src/util/feature-loader.ts) function which is called in [app.tsx](./src/app.tsx). This function will push all features to the store and they are available by using `store.getters.feature_available('FEATURE_NAME')`.