from dotenv import load_dotenv
import os
import pyrebase
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
cv = CountVectorizer()


load_dotenv()

firebaseConfig = {
    "apiKey": os.getenv("REACT_APP_APIKEY"),
    "databaseURL": os.getenv("REACT_APP_DATABASEURL"),
    "authDomain": os.getenv("REACT_APP_AUTHDOMAIN"),
    "projectId": os.getenv("REACT_APP_PROJECTID"),
    "storageBucket": os.getenv("REACT_APP_STORAGEBUCKET"),
    "messagingSenderId": os.getenv("REACT_APP_MESSAGINGSENDERID"),
    "appId": os.getenv("REACT_APP_APPID"),
    "measurementId": os.getenv("REACT_APP_MEASUREMENTID"),
}


app = Flask(__name__)
firebase = pyrebase.initialize_app(firebaseConfig)
db = firebase.database()


@app.route('/')
def hello():
    data = db.child("").get().val()
    return data
    # return '<h1>Hello, World!</h1>'


def resumeParse(data):
    res = ""
    if "profileData" in data:
        if "description" in data["profileData"]:
            res += data["profileData"]["description"]
    if "userEducation" in data:
        if "collegeName" in data["userEducation"]:
            res += " "
            res += data["userEducation"]["collegeName"]
        if "degreeName" in data["userEducation"]:
            res += " "
            res += data["userEducation"]["degreeName"]
    if "skills" in data:
        res += " "
        res += " ".join(data["skills"])
    return res


@app.route('/searchRelevantCV', methods=["POST"])
@cross_origin(supports_credentials=True)
def func():
    input_json = request.get_json(force=True)
    recruiter = input_json["recruiter"]
    job_id = input_json["job_description_ID"]

    jd = db.child("recruiters/" + recruiter + "/" + job_id).get().val()
    employees_details = db.child("employees/").get().val()

    # key value pair
    results = {}

    for id, employeeData in employees_details.items():
        resume = resumeParse(employeeData)
        text = [resume, jd["description"]]
        count_matrix = cv.fit_transform(text)
        similarity_score = cosine_similarity(count_matrix)[0][1]
        employeeData["similarity_score"] = similarity_score
        # temp = {}
        # temp[id] = similarity_score
        results[id] = employeeData

    # print('Similarity score : ', similarity_score)
    print(input_json)
    return {"result": results}


PORT = os.getenv("BACKEND_PYTHON_PORT") or 9999
app.run(port=9999, debug=True)
