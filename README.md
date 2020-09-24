# Xeneta Assignment

The application has been developed in Node.js.

## Start up
In order to launch the application, Node.js and NPM have to be installed and, of course, the Postgres database has to be up an running. This is my configuration.

| Name     | Version     |
|----------|:------------|
| Node.js  |  v12.13.1   |
| NPM      |    6.12.1   |

Once they are installed, launch the following commands:

`npm install`  
to install all modules

`node app.js`  
to run the application

Then navigate to
`http://localhost:3000/`

## Endpoints

GET /rates
```
curl -L -X GET 'http://localhost:3000/rates?date_from=2016-01-01&date_to=2016-01-10&origin=CNSGH&destination=north_europe_main' \
```

GET /rates_null
```
curl -L -X GET 'http://localhost:3000/rates_null?date_from=2016-01-01&date_to=2016-01-05&origin=CNGGZ&destination=EETLL'
```


POST /rates  
(if the fields "currency" is omitted the price is stored as is)
```
curl -L -X POST 'http://localhost:3000/rates' \
-H 'Content-Type: application/json' \
--data-raw '{
    "date_from": "2020-08-26",
    "date_to": "2020-08-27",
    "origin_code": "NOMAY",
    "destination_code": "SEMMA",
    "price": 505,
    "currency": "EUR"
}'
```

## Notes
The project follows the three tier architecture, so there are controllers (in this case embedded in the routes), services and repositories. The validation of the input is managed only for the GET calls. Probably not every edge case has been managed, but all the requested functionalities have been released.

## Batch Processing
In order to choose the right solutions several factors should be taken into account:
- who sends the data (a human, a machine, etc)
- when this procedure takes place (is it scheduled, triggered by a specific event, etc.)
- where are the data located 
- which is their format (both in input and in output)

For example, if the prices are a in a csv file and needs to be manually added to the database of destination that is on AWS (RDS), one possibility could be to upload the data on S3 and leverage the AWS Batch service to do the usual cleansing, standardization, deduplication and verification tasks before of storing them in the final destination.
Another solution that I used for a similar purpose is Apache Airflow, an open-source workflow management platform started at Airbnb and written in Python. It defines a workflow as a Directed Acyclic Graph (DAG) where every node represents a task to be executed. Each task is developed as a python function and have its own log visible on the dasboard which is a grafical interface where is possible to configure the tasks and see their status.
The workflow can be scheduled or triggered by an event. It has built-in support for the most used technologies: major database vendors, http calls, etc.

