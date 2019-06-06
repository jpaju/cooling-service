# Cooling Service
Service for controlling Arduino fans over the network based on temperature-sensors also connected to Arduino.
Provides REST-like API for adding new devices, fans etc. Also supports monitoring temperatures and
fan-speeds.


## Requirements
- Docker
- Docker-compose
- MongoDB-database using replica-set

## Preparation
- Install docker & docker-compose
- Create MongoDB-cluster
- Create .env -file to each project with two variables:
    - PORT
        - Value: 5000
    - MONGODB_URL
        - MongoDB connection string

## Usage
``` $ docker-compose up```
