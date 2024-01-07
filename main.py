from app import app
import random

if __name__ == "__main__":
    app.secret_key = str(random.random())
    app.run(host='0.0.0.0', port=5000)