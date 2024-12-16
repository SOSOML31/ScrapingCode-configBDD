import requests
from bs4 import BeautifulSoup
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="livres_db", 
    user="postgres",       
    password="931752"     
)
cursor = conn.cursor()

# convertir les nom en lettre 
def convertir_note(note_text):
    notes_mapping = {
        "One": 1,
        "Two": 2,
        "Three": 3,
        "Four": 4,
        "Five": 5
    }
    return notes_mapping.get(note_text, 0)  # Retourne 0 si la note est inconnue

# Fonction pour scraper une page de livres
def scraper_page(url):
    response = requests.get(url)
    response.encoding = 'utf-8'  # Force l'encodage à UTF-8
    soup = BeautifulSoup(response.text, 'html.parser')

    livres = soup.find_all('article', class_='product_pod')

    for livre in livres:
        titre = livre.find('h3').find('a')['title']
        auteur = "Inconnu"  # Placeholder car le champ "auteur" n'existe pas sur ce site
        prix_text = livre.find('p', class_='price_color').text.strip()
        prix = float(prix_text.replace('£', '').replace(',', ''))  # Retire le symbole £ et convertit en float
        disponibilite = livre.find('p', class_='instock availability').text.strip()
        note_element = livre.find('p', class_='star-rating')
        note_text = note_element['class'][1] if note_element else "Inconnu"
        note = convertir_note(note_text)  # Convertir en valeur numérique
        image_url = "https://books.toscrape.com/" + livre.find('img')['src']
        description = "Aucune description"  # Placeholder pour l'exemple

        cursor.execute('''
            INSERT INTO Livre (titre, auteur, prix, disponibilite, note, image_url, description)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        ''', (titre, auteur, prix, disponibilite, note, image_url, description))

    conn.commit()

base_url = 'https://books.toscrape.com/catalogue/page-{}.html'
for page in range(1, 6): 
    print("donner entrerrrrr")
    scraper_page(base_url.format(page))


cursor.close()
conn.close()