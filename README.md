# Appirio Digital Studios Screenings - Backend (Node.js)

## Overview

Welcome! This repository will serve as a technical screening ahead of your interviews for Appirio Digital Studios. Please follow the instructions below.  This exercise should take 1-2 hours to complete.

## Instructions

1. Fork this repo
1. In your newly forked repo, initialize a new Node.js project
1. Create a RESTful Web API using the web framework and database/ORM of your choice that fulfills the fulfills the specifications below
1. Create a Pull Request back to this repo with a summary of your solution.  Highlight libraries chosen, techniques used, and future considerations.

## Route Specifications

### /api/auth/register

#### Method
POST

#### Body
* `email`: String
* `password`: String
* `first_name`: String
* `last_name`: String

#### Output

* `access_token`: A JSON Web Token that expires in 1 hour
* `refresh_token`: A non-expiring refresh JSON Web Token that can be used to redeem another `access_token`
* `email`: The email provided
* `first_name`: The first name provided
* `last_name`: The last name provided

#### Other Implementation Details

* This should persist to a database of your choice

### /api/auth/login

#### Method
POST

#### Body

* `email`: String
* `password`: String

#### Output

* `access_token`: A JSON Web Token that expires in 1 hour
* `refresh_token`: A non-expiring refresh JSON Web Token that can be used to redeem another `access_token`

#### Other Implementation Details

* This should retrieve from the database you chose above

### /api/profile

#### Method
GET

#### Headers

* `Authorization`: A JWT retrieved from either `register` or `login` above

#### Output

* `email`: The email for the corresponding user
* `first_name`: The first name for the corresponding user
* `last_name`: The last name for the corresponding user


#### Other Implementation Details

* This should retrieve from the database you chose above and the user associated with the JWT passed into the `Authorization` header

## Bonus Points

* Unit Tests and a test runner of your choice included
* Application deployed to Heroku
* Instructions for database infrastructure to run locally
