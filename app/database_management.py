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
    conn.execute('CREATE TABLE Pins (ID INTEGER PRIMARY KEY AUTOINCREMENT, User_ID INTEGER, Latitude TEXT, Longitude '
                 'TEXT, Description TEXT)')
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
        query = 'INSERT INTO Users VALUES (%s, %s)'
        cur.execute(query, (username, password,))
        conn.commit()
    except Exception as e:
        print(e)


def check_user_login(username, password):
    try:
        conn = make_connection()
        cur = conn.cursor()
        query = 'SELECT * FROM Users WHERE Username = %s AND Password = %s'
        cur.execute(query, (username, password, ))
        result = cur.fetchone()
        if result:
            return True
        else:
            return False
    except Exception as e:
        print(e)


def check_user_existing(username):
    try:
        conn = make_connection()
        cur = conn.cursor()
        query = 'SELECT * FROM Users WHERE Username = %s'
        cur.execute(query, (username,))
        result = cur.fetchone()
        if result:
            return True
        else:
            return False

    except Exception as e:
        print(e)
