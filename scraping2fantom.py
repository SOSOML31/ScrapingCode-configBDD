import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import psycopg2

# Connexion à PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    database="fantomDB",  # Nom de la base de données
    user="postgres",           # Nom d'utilisateur PostgreSQL
    password="931752"  # Remplacez par votre mot de passe
)
cursor = conn.cursor()

# Création des tables si elles n'existent pas
def create_tables():
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS regions (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            url TEXT
        );
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            location TEXT,
            description TEXT,
            region_id INTEGER REFERENCES regions(id)
        );
    ''')
    conn.commit()
    print("Tables vérifiées ou créées.")

# Fonction pour insérer une région dans la BDD
def insert_region(name, description, url):
    cursor.execute('''
        INSERT INTO regions (name, description, url)
        VALUES (%s, %s, %s)
        RETURNING id
    ''', (name, description, url))
    conn.commit()
    return cursor.fetchone()[0]  # Retourne l'ID de la région

# Fonction pour insérer un événement dans la BDD
def insert_event(name, location, description, region_id):
    cursor.execute('''
        INSERT INTO events (name, location, description, region_id)
        VALUES (%s, %s, %s, %s)
    ''', (name, location, description, region_id))
    conn.commit()

# Scraper les informations sur les régions
def scrape_regions(base_url):
    response = requests.get(base_url)
    soup = BeautifulSoup(response.text, 'html.parser')

    regions = []

    # Trouver les divs correspondant aux régions
    region_divs = soup.find_all('div', class_='w3-border-left')
    for div in region_divs:
        # Titre de la région
        title_tag = div.find('h4')
        region_name = title_tag.text.strip() if title_tag else None

        # Description
        description_tag = div.find('p')
        description = description_tag.text.strip() if description_tag else None

        # Lien vers la page régionale
        link_tag = div.find('a', href=True)
        region_url = urljoin(base_url, link_tag['href']) if link_tag else None

        # Insérer la région dans la BDD
        region_id = insert_region(region_name, description, region_url)
        regions.append({"id": region_id, "name": region_name, "url": region_url})

    return regions

# Scraper les événements pour une région donnée
def scrape_events(region):
    response = requests.get(region['url'])
    soup = BeautifulSoup(response.text, 'html.parser')

    # Supposons que les événements sont listés dans un tableau ou des divs spécifiques
    event_divs = soup.find_all('div', class_='event')  # Adaptez la classe en fonction du HTML réel
    for div in event_divs:
        # Nom de l'événement
        title_tag = div.find('h3')
        event_name = title_tag.text.strip() if title_tag else None

        # Lieu
        location_tag = div.find('span', class_='location')
        location = location_tag.text.strip() if location_tag else None

        # Description
        description_tag = div.find('p', class_='description')
        description = description_tag.text.strip() if description_tag else None

        # Insérer l'événement dans la BDD
        insert_event(event_name, location, description, region['id'])

# Pipeline principal
def main():
    base_url = "https://www.paranormaldatabase.com/"  # Page principale

    # Vérifier ou créer les tables
    create_tables()

    print("Scraping les régions...")
    regions = scrape_regions(base_url)

    print("Scraping les événements pour chaque région...")
    for region in regions:
        print(f"Scraping les événements pour la région : {region['name']}")
        scrape_events(region)

    print("Scraping terminé !")

# Lancer le script principal
if __name__ == "__main__":
    main()

# Fermer la connexion à la base de données
cursor.close()
conn.close()