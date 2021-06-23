# Solution
I didn't want to use stuff external to Nest because it would complicate
running it, although in a production setting I would be more open to doing this because it could improve reliability/speed. I tried to keep the code consise, readable and documented. I didn't really explore a lot of Nest's features becuase they seemed a bit complicated and I wanted a 100% working solution that I understood completely and only had a little time to work on this.

## General Approach
I focussed on making sure the system was fault tolerant so it is reliable in terms of communicating between microservices, and can tell the user if something has gone wrong. I'm not aware of any techniques for data reliability, I tried googling but didn't find any good answers, but I'd really like to learn more. 

My core approach for scheduling was to use JS's intervals because I'm familliar with it although with more time I'd look into CRON more thoughroughly. 

I used TCP because of it's simplicity although there are better approaches.

I didn't focus on the frontend because you use GraphQL and Next which aren't being tested/used so it seemed a bit "pointless" to put a lot of effort into the frontend (because I'm not using relevant tech) as opposed to making sure the server was working correctl. 

I'm a really big fan of logging because it helps me see what is happening on a smaller scale, so I really took advantage of Nest's logger (especially since verbose output can be hidden). Normally I would use less logs and delete them before using the code (for production) but because of how nest is configured it seemed like a really handy tool.

## Storage
To store the data retrieved by a worker I used Nest's built in 
caching system. This is because it seemed like a very simple way 
to store data, and it is a bit extendable since different workers
can have their data stored simultaniously.

Initially I used a variable but I didn't like this because it wasn't very extendable, and just seemed like a very bad approach although I don't have a specific reason for this.

I considered using an external solution, storing in a DB, redis or file. For the first 2 they required external applications to be running on the server, and I don't like that in the context of a coding challenge. For the last, I didn't want the runtime to be affected by slow IO operations.

## Protocol
I used TCP because I am somewhat familliar with it and it didn't
require an external broker "server" to be running. The downside of this
is it doesn't seem 'easily' extendable because you would need to listen/send
to a different port for each microservice.

If there were more workers I would probably use Rabbit because (although I've never used it just read stuff online) it uses a message queue, and 
provides message acknowledgement, both of which make it reliable. It's
also widely used so there would be good documentation/support online, 
and has proven use in distributed systems architecture.

I chose not to consider gRPC because I have never used it (although 
I'd like to learn it) and while it seems useful I didn't want to go through 
extra configurations for a service that didn't seem like it offered 
anything better than a message broker (which I already didn't want to use).

## To-do list
- [ ] Error Checking (High Prio)
- [ ] Testing modules (High Prio)
- [ ] Add better JSDoc (Probably gonna do first lmao)
- [x] Add documentation/instructions/explainations to readme
- [x] Add reliability measures
- [ ] Optimization (Ensure Async, research more)

## How to Run
Start the worker and the data-stream in any order. If/when a message is sent between the 2 there is some error checking, so if it is unavailable it will output to the user as such. The worker should be started first as data-stream checks if it can connect to the worker.

GET /data:
This is the data retrieved by the worker

GET /start:
Starts the worker with an interval of 5 minutes

GET /start/:interval:
Starts the worker with a set interval (in minutes)

GET /stop:
Stops the worker from retrieving data

GET /error:
Shows any errors

## Shortcomings
Doesn't use external services, I think using RMQ or another message broker that supports queues and data reception would be good because it would ensure reliability, provide better error checking, and be extendable to other workers. 

It doesn't store the data in a reliable way so any crashes will result in data being lost. So using an external solution (redis or a DB) would be better in this regard.

I'm not sure what I can do to ensure realiability within the server beyond error checking and acknowledging reception, so there are probably a lot of ways to improve in this aspect.

For some reason the worker doesn't fetch the latest data immediately, I can't figure out why and would really like to know how to fix this issue, as I think updating the datastore in a timely way would be good.

I don't think my testing is very good and can definately be improved, I'm pretty new to TDD and Jest so there are probably a lot of better/more ways to test the code.

I'm not sure if takes advantage of/implements the best practices for NestJS (I've never used it before).

# Future Work
- Better error checking/outputting to user
- Store data in a persistant way
- Testing for speed and optimsing
- More unit and E2E tests
- Use a message broker
- Add Swagger docs because this is probably going to be used by other devs
- Add healthchecks for the end user
- Add methods for accepts/json because a user is probably going to be interacting with the API in this way

# Welcome to Welds coding-challenge

## Introduction
Here at Weld we use [NestJS](https://nestjs.com/) for our applications. So this project also reflects that. On our front-end we use NextJS and GraphQL. For simplicity we have used the monorepo structure from NestJS.

Fork this repository and create your own repository to get started.

## Challenge
One of our customers wants us to help them build a pipeline for Hubspot. And they want us to setup a new data-pipeline for them to get information out and into their current data-warehouse.

To accomplish this you will build two services:
- **Data-streams**: Our API that can receive calls and issue commands to **worker**. This service also stores any information that our customer wants to fetch.
- **Worker:** Fetches the data from Hubspot. Makes any transformations you see fit. And sends it back to **data-streams** for storage.

### Steps in challenge
- Configure a message protocol between the two services. You can get inspiration from the [nestjs docs.](https://docs.nestjs.com/microservices/basics) Choose which ever you want but tell us why in your answer.
- Create an endpoint on **data-streams** that tells **worker** to start fetching data on an interval (every 5 minutes).
- Setup an [http module](https://docs.nestjs.com/techniques/http-module) that **worker** can use to communicate with Hubspot. You can setup a [Hubspot developer account](https://developers.hubspot.com/) or mock the data. Depending on what you prefer.
- Send the data and store the results on **data-streams** using internal communication protocol.
- Make an endpoint on **data-streams** that can fetch the data stored on **data-streams**. Use whatever storage you see fit but tell us why you chose it.
- Make an endpoint on **data-streams** that can stop the data fetching on **worker**.

## How we evaluate
- We understand that this can be **time consuming**. If you are short on time leave something out. But be sure to tell us your approach to the problem in the documentation.
- A documented answer that explains your approach, short-comings, how-to-run and future work.
- A working solution. Preferably with some tests to give us an idea of how you write tests (you don't need to put it all under test).
- Reliability is very important when dealing with data-pipelines. So any measures you can add to keep the data-flowing will be appreciated.
- We appreciate small commits with a trail of messages that shows us how you work.

## Project structure
```
├── README.md
├── apps
│   ├── data-streams
│   └── worker
├── package.json
```
### data-streams:
This is our API. We will be able to issue HTTP requests to this and have it talk to our microservice **worker**.
We also store any information that **worker** sends our way. This project has been setup as a hybrid app. It can both function as an API but also as a microservice with an internal communication layer.

You can start data-streams with:
```
yarn start
```

### worker:
This is the worker microservice that is in charge of talking to the external API. It will fetch data when issued a command from **data-streams** and then return the results. This project only functions as a microservice which means it can only receive commands from the internal communication layer.

You can start worker with:
```
yarn start worker
```
