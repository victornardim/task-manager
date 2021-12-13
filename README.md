# Task Manager
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Jasmine](https://img.shields.io/badge/Jasmine-8A4182?style=for-the-badge&logo=Jasmine&logoColor=white)](https://jasmine.github.io/)
[![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)

This project was developed to study Angular software archtecture.

The archtecture is divided into some parts:

## Vertical design

The vertical design consists in a layer-level division.

We have three layers on this project:

- Core
    - Holds all the calls to the external world and some APIs, like database access, state management, external APIs and so on.
    
- Facade
    - It's the layer that holds all the business logic and conects the core to the presentational layer. Must translate the data that comes from the external world through the core layer to be understandable by the presentational layer.
    - This layer prevents the coupling, by being an adapter to the others. If you want to change de business logic, core and presentational layers will not be affected.

- Presentational (components)
    - Just presents data and send the requests (events) to the facade layer.

## Horizontal design

The horizontal design consists in a feature-level division.

This project just have the task manager, but let's supose that we have a other features.

Some resources like database must be shared, so we have to communicate horizontally, through the business logic layer (facade).

Just facades can communicate through each other, core and presentation are forbidden, because it would hurt the low coupling archtecture. The facade is the adapter layer, so only it can communicate horizontaly.

## Request/data flow

The request/data flow follow this simple rule: request go up, data go down.

The presentational layer fire an event to the facade, that ocasionally calls an API.
The data returned by the API is passed to the facade, that will translate the data and then pass it to the presentational, that will show it.

For consistency the data just can be modified in the facade layer.
