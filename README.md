# Resume Grader - Shortlisting condidates made easy


##  HireQuotient’s 2023 Hackathon
* The Challenge
	* Build a Search engine
	* Essential features which were expected
		 * Be deployed on a server
		* Should get the results from different (independent sources like Job Portals, Candidate Sourcing Tools)
		* Should display the search results in structured format and be relevant as per the
		requirements given in the JDs
		* Should display minimum 6 key highlights of the person’s profile
			* Name (first and last)
			* Location (city and country)
			* Designation
			* Current Company
	* Detailed View of the Problem Statement can be found [here](https://drive.google.com/file/d/113NU6w7Wi8DhPay5dJuNT9Ht7QXAn3ZM/view)

## Implementation Details

### Scraper

* Puppeteer is a Node.js library that provides a high-level API to control Chromium or Chrome over the DevTools Protocol. 
* Scrapped the candidate profile based on tags such as “open to work” and keywords from the job description.

### Cosine Similarity and Calculation of relevance score.

* We used cosine similarity text matching technique to obtain a relevancy score of a particular profile at a specific job description. 
* We preferred this method because of its efficiency in catching the semantics of each text, the direction the text points can be thought of as its meaning, so texts with similar purposes will be similar.

### Parsing PDFs

* We used `pdfjs-dist` library, a web standards-based platform for parsing and rendering PDFs, to obtain the text from the job description.
*  The unique keywords from all the uploaded JDs are then used to scrape data from the sources.

### Extracting Keywords

* We used `RAKE` (Rapid Automatic Keyword Extraction algorithm), a domain independent keyword extraction algorithm which tries to determine key phrases in a body of text by analyzing the frequency of word appearance and its co-occurance with other words in the text.

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

* Search 
   * Recruiter can upload and delete multiple JD .
   * JD format should be pdf only.
      
* History
   * Recruiter can view description of all the previously uploaded JD.
   * Recruiter can rescan any previously uploaded JD.
   * Recruiter can download any previously uploaded JD


## Results
  * Recruiter can view all the condidates satisfying specific JD.
  * Recruiter can send mail to any candidate.
  * Recruiter can search and sort candidates on the basis of relevance score.
  * Recruiter can also view the source of information for every candidate.
 
## Shortlisted Candidates [WIP]
* Recruiter can view the shortlisted candidates corresponding to specific JDs.
* Recruiter can update the status of the candidate's application.
* Recruiter can mail any of the shortlisted candidates.

## Insights
  * User can get idea about top demanding skills.

## WIP and Future Work
  *  Functionality for recruiter to select candidates, add status such as Accepted, Rejected and Ongoing. 
  * Functionality for recuiter to view shortlisted condidates.
  * Addition of multiple sources to get condidates.
  * Use of advanced algorithm like semantic-based algorithms, machine learning-based algorithms, and statistical model-based algorithms for keyword extraction from JD.


## Contributing Guidelines

1. This repository consists of 2 directory `frontend`,`backend`.
2. The `frontend` directory the frontent code written in React.
3. The `backend` contains `backend-node`, `backend-python` and `scraper` directories which have webpages backend, relevancy checker, and scraper.
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


#### Pre-requisites
1. Download and Install [Nodejs](https://nodejs.org/en/download)

#### Setup Node Backend

1. Run `cd .\backend\backend-node` to go inside the Node.js server folder for Windows or
Run `cd backend/backend-node` to go inside the Node.js server folder for Linux.
2. Run `npm install` to install all the dependencies.
3. Create a new file named `.env` and add the environment variables according to `.env.sample` file.
4. Run `npm start` to start the node backend server.

#### Setup Python Backend
##### Linux Users
1. Run `cd backend/backend-python` to go inside the python server folder.
2. To create a virtual environment run `python3 -m venv flaskapp`.
3. To activate the virtual environment run `source flaskapp/bin/activate`.
4. To install the required dependencies run `pip install -r requirements.txt`.
4. Finally, run `python3 app.py` to start the python backend server.

##### Windows Users

1. Run `cd .\backend\backend-python` to go inside the python server folder.
2. To create a virtual environment run `python -m venv flaskapp`.
3. To activate the virtual environment run `.\flaskapp\Scripts\activate`.
4. To install the required dependencies run `pip install -r requirements.txt`.
4. Finally, run `python .\app.py` to start the python backend server.

#### Setup Node Backend

1. Run `cd .\backend\scraper` to go inside the Node.js server folder for Windows or
Run `cd backend/scraper` to go inside the Node.js server folder for Linux.
2. Run `npm install` to install all the dependencies.
3. Create a new file named `.env` and add the environment variables according to `.env.sample` file.
4. Run `node index.js` to start the node-scrapper backend server.

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

* Database Schema Employee
<img width="1604" alt=" Database Schema Employe" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/schema.jpeg"> 
* Database Schema Recruiter
<img width="1604" alt=" Database Schema Recuiter" src="https://raw.githubusercontent.com/divyanshu887/hireQ-2023/main/img/schema1.jpeg"> 
