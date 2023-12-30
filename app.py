import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, jsonify
from flask_session import Session
import datetime

app = Flask(__name__)

app.config["SESSION_PERMAMENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQL("sqlite:///appdata.db")


@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/pomodoro", methods=["GET", "POST"])
def pomodoro():
    time = datetime.datetime.now()

    if request.method == "POST":
        task = request.get_json()

        if task["action"] == "WRITE":
            db.execute(
                "INSERT INTO pomodoro (date, time) VALUES (?,?);",
                time.strftime("%x"),
                time.strftime("%X"),
            )
            return jsonify(past=pomodoroDB())

        else:
            id = int(task["action"])
            db.execute("DELETE FROM pomodoro WHERE id = ? ;", id)
            return jsonify(past=pomodoroDB())
    else:
        return render_template("pomodoro.html", past=pomodoroDB())


def pomodoroDB():
    print("called pomodoro DB")
    past = db.execute("SELECT * FROM pomodoro ORDER BY date DESC, time DESC;")
    return past


@app.route("/stopwatch", methods=["GET", "POST"])
def stopwatch():
    time = datetime.datetime.now()
    if request.method == "POST":
        task = request.get_json()
        # Save new entry
        if task["action"] == "WRITE":
            text = task["text"]
            if not text:
                text = ""
            db.execute("INSERT INTO timer (date, time, task, duration) VALUES (?,?,?,?);",
                        time.strftime("%x"),
                        time.strftime("%X"),
                        text,
                        task["time"],
            )
            print(swchDB())
            return jsonify(timerdata=swchDB())

        # Update existing entry
        elif task["action"] == "EDIT":
            db.execute("UPDATE timer SET task = ?, duration = ? WHERE id = ?;",
                        task["task"],
                        task["duration"],
                        task["id"],
            )
            return jsonify(timerdata=swchDB())

        # Delete entry
        else:
            db.execute("DELETE FROM timer WHERE id = ?;", task["id"])
            return jsonify(timerdata=swchDB())

    else:
        return render_template("stopwatch.html", timerdata=swchDB())


def swchDB():
    timerdb = db.execute("SELECT * FROM timer ORDER BY date DESC, time DESC;")
    return timerdb

@app.route("/todo", methods=["GET", "POST"])
def todo():
    if request.method == "POST":
        task = request.get_json()
        if task["action"] == "WRITE": # Add new entry to DB
            db.execute("INSERT INTO todo(task, status) VALUES(?,?);", task["text"], task["status"])
            return jsonify(tododata=todoDB())
        elif task["action"] == "EDIT": # Edit selected entry
            print(f"task : {task}, {datetime.datetime.now()}")
            status = "DONE" if task["status"] else ""
            db.execute("UPDATE todo SET status = ? WHERE id = ?;", status, task["id"])
            return jsonify(tododata=todoDB())
        else: # Delete selected entry
            db.execute("DELETE FROM todo WHERE id = ?", task["id"])
            return jsonify(tododata=todoDB())
    else:
        return render_template("todo.html", tododata=todoDB())

def todoDB():
    tododb = db.execute("SELECT * FROM todo ORDER BY id DESC;")
    return tododb
