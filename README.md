# hireQ-2023
# Search Engine - Shortlisting condidates made easy

## Table of Contents 📕

- [About the Challenge](#HireQuotient’s-2023-Hackthon)
- [Tools And Technologies](#tools-and-technology)
- [Features](#features-)
  	- [Homepage](#homepage)
  	- [Dashboard](#dashboard)
  	  - [Create Quiz](#create-quiz)
  	  - [Quiz History](#quiz-history)
  	- [Quizzing Window](#quizzing-window)
  	- [Scorecard](#scorecard)
  	- [Statistics](#statistics)
- [Future Work](#future-work)
- [Contributing Guidelines](#contributing-guidelines)
- [Installation or Dev Setup](#setting-up-the-repository-locally)
- [Gallery](#gallery)
- [Database Schema](#database-schema)
#  HireQuotient’s 2023 Hackathon
* The Challenge
	* Build a Search engine
	* Essential features which were expected
	   1. Be deployed on a server
		2. Should get the results from different (independent sources like Job Portals, Candidate Sourcing Tools)
		3. Should display the search results in structured format and be relevant as per the
		requirements given in the JDs
		4. Should display minimum 6 key highlights of the person’s profile
		a. Name (first and last)
		b. Location (city and country)
		c. Designation
		d. Current Company
	* Detailed View of the Problem Statement can be found [here](https://drive.google.com/file/d/18wRUstOp10EiQj2klv1hFi108ZHT5iJt/view?usp=sharing)


## Tools and Technology

We have developed Three microservices - 
1) **Node backend** 
2) **Node** + **puppeteer** backend for scraping websites 
3) A **Flask API** that checks for candidate relevancy with the job description. 
The front end is created in **React.js** and **Material UI**. We created a very flexible and versatile foundation for our codebase, so that in future its functionality could be easily extended and new agents could be easily added into it.


# Features :

## Homepage
* Login/Signup 
	* Users can login/signup via Google Sign in or email. 

## Dashboard

#### Search 
   * Recuiter can upload and delete multiple JD .
   * JD formate should be pdf only.zes.
      
####  History
   * Recuiter can view description of all the previously uploaded JD.
   * Recuiter can rescan any previously uploaded JD.
   * Recuiter can download any previously uploaded JD


## Results
  * Recuiter can view all the condidates satisfying specific JD.
  * Recuiter can send mail to any candidate.
  * Recuiter can search and sort candidates on the basis of relevance score.

## Insights
  * User can get idea about top demanding skills.

## Future Work
  *  Functionality for recruiter to select candidates, add status such as Accepted, Rejected and Ongoing. 
  * Functionality for recuiter to view shortlisted condidates.
  * Addition of multiple sources to get condidates.
  * Use of advanced algorithum like semantic-based algorithms, machine learning-based algorithms, and statistical model-based algorithms for keyword extraction from JD.


## Contributing Guidelines

1. This repository consists of 2 directory `frontend`,`backend`.
2. The `frontend` directory the frontent code written in React.
3. The `backend` contains webpages backend `nodejs` .
4. So, commit code to the corresponding services.

### Setting up the repository locally

1. Fork the repo to your account.

2. Clone your forked repo to your local machine:
```
git clone https://github.com/divyanshu887/hireQ-2023.git (https)
```
or
```
git clone git@github.com:divyanshu887/hireQ-2023.git (ssh)
```
This will make a copy of the code to your local machine.

3. Change directory to `hireQ-2023`.
```
cd hireQ-2023
```

4. Check the remote of your local repo by:
```
git remote -v
```
It should output the following:
```
origin  https://github.com/<username>/hireQ-2023.git (fetch)
origin  https://github.com/<username>/hireQ-2023.git (push)

```
or
```
origin	git@github.com:<username>/hireQ-2023.git (fetch)
origin	git@github.com:<username>/hireQ-2023.git (push)
```
Add upstream to remote:
```
git remote add upstream https://github.com/divyanshu887/hireQ-2023.git (https)
```
or
```
git remote add upstream git@github.com:divyanshu887/hireQ-2023.git (ssh)
```
Running `git remote -v` should then print the following:
```
origin  https://github.com/<username>/hireQ-2023.git (fetch)
origin  https://github.com/<username>/hireQ-2023.git (push)
upstream	https://github.com/divyanshu887/hireQ-2023.git (fetch)
upstream	https://github.com/divyanshu887/hireQ-2023.git (push)
```
or
```
origin	git@github.com:<username>/hireQ-2023.git (fetch)
origin	git@github.com:<username>/hireQ-2023.git (push)
upstream	git@github.com:divyanshu887/hireQ-2023.git (fetch)
upstream	git@github.com:divyanshu887/hireQ-2023.git (push)
```
## 

### Method 1 (recommended): Using Docker

#### Pre-requisites

1. Install `Docker` by looking up the [docs](https://docs.docker.com/get-docker/)
2. Install `Docker Compose` by looking up the [docs](https://docs.docker.com/compose/install/)

#### Steps

1. Make sure you are inside the root of the project (i.e., `./Tally-Quizzer/` folder).
2. Setup environment variables in `.env` files of all folders according to `.env.sample` files.
3. Run `docker-compose up` to spin up the containers.
4. The website would then be available locally at `http://localhost:3000/`.
5. The above command could be run in detached mode with `-d` flag as `docker-compose up -d`.
6. For help, run the command `docker-compose -h`.

### Method 2

#### Pre-requisites

1. Install `concurrently` by running `npm run pre-install` on terminal.

#### Steps

1. Make sure you are inside the root of the project (i.e., `./Tally-Quizzer/` folder).
2. Setup environment variables in `.env` files of all folders according to `.env.sample` files.
3. Run `npm run start-with-install` to install all the dependencies and run frontend and backend concurrently.
4. The website would then be available locally at `http://localhost:3000/`.
5. If you have already installed the dependencies, you can also run `npm run start` to run the frontend and backend concurrently.

### Method 3 : Setup services independently

#### Pre-requisites
1. Download and Install [Nodejs](https://nodejs.org/en/download)

#### Setup Node Backend

1. Run `cd .\backend` to go inside the Node.js server folder for Windows or
Run `cd backend` to go inside the Node.js server folder for Linux.
3. Run `npm install` to install all the dependencies.
4. Create a new file named `.env` and add the environment variables according to `.env.sample` file.
5. Run `npm start` to start the node backend server.

#### Setup Frontend

1. Run `cd frontend` to go inside the frontend folder.
2. Run `npm install` to install all the dependencies.
3. Create a new file named `.env` and add the environment variables according to `.env.sample` file.
4. Run `npm start` to start the frontend backend server.


# Gallery

|||
|:-------------------------:|:-------------------------:|
|<img width="1604" alt="login" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/login.png">  Login Page |  <img width="1604" alt="register" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/register.png"> Register |
|<img width="1604" alt="Homepage" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/home.png"> Homepage| <img width="1604" alt="search" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/search.png">Search|
|<img width="1604" alt="History" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/history.jpeg"> History |  <img width="1604" alt="Shortlisted Prifiles" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/screened.jpeg"> Shortlisted Profiles|
<img width="1604" alt="Insights" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/insights.png"> Insights| <img width="1604" alt="Update Profile" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/update profile.png"> Update Profile|
<img width="1604" alt="mail test link" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/candidates.jpeg"> Result|<img width="1604" alt="Job Discription" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/jd.jpeg"> Job Discription|
<img width="1604" alt="Candidate Detail" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/candidate_detail.jpeg"> Candidate Detail|

 

# Database Schema

<img width="1604" alt=" Database Schema Employe" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/schema.jpeg"> Database Schema Employe 
<img width="1604" alt=" Database Schema Recuiter" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/schema1.jpeg">  Database Schema Recuiter
