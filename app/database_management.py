import sqlite3

DATABASE = 'database.db'


def make_connection():
    conn = sqlite3.connect(DATABASE)
    return conn


def create_db():
    # Połączenie sie z bazą danych
    conn = make_connection()
    # Stworzenie tabeli w bazie danych za pomocą sqlite3
    conn.execute('CREATE TABLE Users (ID INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, Password TEXT)')
    conn.execute('CREATE TABLE Pins (ID INTEGER PRIMARY KEY AUTOINCREMENT, Pin_Name TEXT, User_ID INTEGER, Latitude '
                 'REAL, Longitude REAL, Description TEXT, Color TEXT)')
    cur = conn.cursor()
    cur.execute("INSERT INTO Users (Username,Password) VALUES ('admin','admin')")
    # Zakończenie połączenia z bazą danych
    conn.commit()
    conn.close()

    return


def get_users():
    try:
        conn = make_connection()
        cur = conn.cursor()
        query = 'SELECT * FROM Users'
        cur.execute(query)
        users = cur.fetchall()
        return users
    except Exception as e:
        print(e)


def add_user(username, password):
    try:
        conn = make_connection()
        cur = conn.cursor()
        query = 'INSERT INTO Users (Username, Password) VALUES (?, ?)'
        cur.execute(query, (username, password,))
        conn.commit()
    except Exception as e:
        print(e)


def check_user_login(username, password):
    try:
        conn = make_connection()
        cur = conn.cursor()
        query = 'SELECT * FROM Users WHERE Username = ? AND Password = ?'
        cur.execute(query, (username, password,))
        result = cur.fetchone()
        if result:
            return result
        else:
            return False
    except Exception as e:
        print(e)


def check_user_existing(username):
    try:
        conn = make_connection()
        cur = conn.cursor()
        query = 'SELECT * FROM Users WHERE Username = ?'
        cur.execute(query, (username,))
        result = cur.fetchone()
        if result:
            return True
        else:
            return False

    except Exception as e:
        print(e)


def add_pin(pin_name, user_id, latitude, longitude, desc, color):
    try:
        conn = make_connection()
        cur = conn.cursor()
        query = 'INSERT INTO Pins (Pin_Name, User_ID, Latitude, Longitude, Description, Color) VALUES (?, ?, ?, ?, ?, ?)'
        cur.execute(query, (pin_name, user_id, latitude, longitude, desc, color,))
        conn.commit()
    except Exception as e:
        print(e)


def delete_pin(pin_id):
    try:
        conn = make_connection()
        cur = conn.cursor()
        query = 'DELETE FROM Pins WHERE ID=?'
        cur.execute(query, (pin_id,))
        conn.commit()
    except Exception as e:
        print(e)


def update_pin(pin_id, pin_name, latitude, longitude, desc, color):
    try:
        conn = make_connection()
        cur = conn.cursor()
        query = 'UPDATE Pins SET Pin_Name=?, Latitude=?, Longitude=?, Description=?, Color=? WHERE ID=?'
        cur.execute(query, (pin_name, latitude, longitude, desc, color, pin_id, ))
        conn.commit()
    except Exception as e:
        print(e)


def get_pins(user_id):
    try:
        conn = make_connection()
        cur = conn.cursor()
        query = 'SELECT ID, Pin_Name, Latitude, Longitude, Description, Color FROM Pins WHERE User_ID=?'
        cur.execute(query, (user_id,))

        pins = []
        for row in cur.fetchall():
            pin_id, name, latitude, longitude, description, color = row
            pins.append({
                "id": str(pin_id),
                "name": str(name),
                "latitude": latitude,
                "longitude": longitude,
                "description": description,
                "color": color,
            })
        return pins
    except Exception as e:
        print(e)


def get_user_pins(user_id):
    try:
        conn = make_connection()
        cur = conn.cursor()
        query = 'SELECT * FROM Pins WHERE User_ID=?'
        cur.execute(query, (user_id,))
        pins = cur.fetchall()
        return pins
    except Exception as e:
        print(e)