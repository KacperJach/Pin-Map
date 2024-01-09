from app import app
import random
import os
from app import database_management as db_manage

if __name__ == "__main__":
    if not os.path.isfile('database.db'):
        db_manage.create_db()
    app.secret_key = str(random.random())
    app.run(host='0.0.0.0', port=5000)