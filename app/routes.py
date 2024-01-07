from app import app
from flask import render_template, request, jsonify, flash
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from app import database_management as db_manage

app.config['JWT_SECRET_KEY'] = 'sekretne_haslo'
jwt = JWTManager(app)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        password = data['password']
        result = db_manage.check_user_login(username, password)
        if result:
            access_token = create_access_token(identity=username)
            return jsonify(access_token=access_token), 200
        else:
            return flash('User not existing')


@app.route('/get_users', methods=['GET'])
def get_users():
    users = db_manage.get_users()
    return jsonify({'users': users}), 200


@app.route('/register', methods=['GET', 'POST'])
def register():
    msg = ''
    if request.method == 'POST':

        data = request.get_json()
        username = data['username']
        password = data['password']

        result = db_manage.check_user_existing(username)
        if result:
            msg = 'User already exists!'

        else:
            db_manage.add_user(username, password)
            msg = 'You have successfully registered!'

    return jsonify(msg, 200)

