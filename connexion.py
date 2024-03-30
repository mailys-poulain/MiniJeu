from flask import Flask, request, render_template
import pymysql
# app.py

app = Flask(__name__)

@app.route('/')
def index():
    message = "Bonjour depuis Python!"
    return render_template('connexion.html', message=message)

if __name__ == '__main__':
    app.run(debug=True)

app = Flask(__name__)

# Configuration de la connexion à la base de données
connection = pymysql.connect(
    host='127.0.0.1',
    user='root',
    password='Canaille.95',
    database='minijeu'
)

# Route pour gérer la création de compte
@app.route('/register', methods=['POST'])
def register():
    # Récupérer les données du formulaire
    username = request.form['username']
    password = request.form['password']

    try:
        with connection.cursor() as cursor:
            # Insérer les données dans la base de données
            sql = "INSERT INTO username (username) VALUES (%s)"  # Utilisez la table username
            cursor.execute(sql, (username,))
            connection.commit()
            print('Compte créé avec succès !')
            return 'Compte créé avec succès'
    except Exception as e:
        print('Erreur lors de l\'insertion du compte :', e)
        return 'Erreur lors de la création du compte', 500

if __name__ == '__main__':
    # Démarrer le serveur Flask
    app.run(port=3001)
