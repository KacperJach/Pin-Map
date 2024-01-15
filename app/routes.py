from app import app
from flask import request, jsonify
from app import database_management as db_manage


@app.route('/api/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        password = data['password']
        result = db_manage.check_user_login(username, password)
        if result:
            return jsonify({"logged_in": True, "user_id": result[0]}), 201

        else:
            return jsonify({"logged_in": False}), 201


@app.route('/api/get_users', methods=['GET'])
def get_users():
    users = db_manage.get_users()
    return jsonify({'users': users}), 200


@app.route('/api/register', methods=['GET', 'POST'])
def register():
    msg = ''
    if request.method == 'POST':

        data = request.get_json()
        username = data['username']
        password = data['password']

        result = db_manage.check_user_existing(username)
        if result:
            msg = 'User already exists!'
            return jsonify({"register": False, 'msg': msg}), 201

        else:
            db_manage.add_user(username, password)
            msg = 'You have successfully registered!'
            return jsonify({"register": True, 'msg': msg}), 201


@app.route('/api/get_pins', methods=['GET'])
def get_pins():
    pins = db_manage.get_pins()
    return jsonify({'pins': pins}), 201


@app.route('/api/add_pin', methods=['POST'])
def add_pin():
    if request.method == 'POST':
        data = request.get_json()
        user_id = data['user_id']
        pin_name = data['name']
        latitude = data['latitude']
        longitude = data['longitude']
        desc = data['description']

        db_manage.add_pin(pin_name, user_id, latitude, longitude, desc)
        msg = 'Pin added successfully!'
        return jsonify({"pin added": True, 'msg': msg}), 201


@app.route('/api/delete_pin/<pin_id>', methods=['DELETE'])
def delete_pin(pin_id):

    db_manage.delete_pin(pin_id)
    msg = 'Pin deleted successfully!'
    return jsonify({"pin deleted": True, 'msg': msg}), 201


@app.route('/api/map/<user_id>', methods=['GET'])
def get_user_pins(user_id):
    pins = db_manage.get_user_pins(user_id)
    return jsonify({'pins': pins}), 201


@app.route('/api/edit_pin', methods=['PUT'])
def edit_user_pin():
    if request.method == 'PUT':
        data = request.get_json()
        user_id = data['user_id']
        pin_id = data['pin_id']
        pin_name = data['name']
        latitude = data['latitude']
        longitude = data['longitude']
        desc = data['description']

        db_manage.update_pin(pin_id, pin_name, user_id, latitude, longitude, desc)
        msg = 'Pin edited successfully!'
        return jsonify({"pin edited": True, 'msg': msg}), 201
