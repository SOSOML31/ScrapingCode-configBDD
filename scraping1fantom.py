import requests
from bs4 import BeautifulSoup
import psycopg2
from urllib.parse import urljoin


conn = psycopg2.connect(
    host="localhost",
    database="fantomDB", 
    user="postgres",           
    password="931752"  
)
cursor = conn.cursor()

# Fonction pour extraire la liste des événements sur une page
def get_events_list(page_url):
    response = requests.get(page_url)
    response.encoding = 'utf-8'
    soup = BeautifulSoup(response.text, 'html.parser')

    events = []

    # Adaptez ceci à la structure du site. Par exemple, si chaque événement
    # est dans un <div class="event-item"> avec un <a href="details.php?id=...">
    event_divs = soup.find_all('div', class_='event-item')
    for div in event_divs:
        # Exemple : le nom se trouve dans un <h3>, le lien vers la page détail dans un <a>
        name_tag = div.find('h3')
        if not name_tag:
            continue

        name = name_tag.text.strip()
        link_tag = div.find('a', href=True)
        if link_tag:
            event_url = urljoin(page_url, link_tag['href'])
            events.append((name, event_url))
    
    return events

# Fonction pour extraire les détails d'un événement
def get_event_details(event_url):
    response = requests.get(event_url)
    response.encoding = 'utf-8'
    soup = BeautifulSoup(response.text, 'html.parser')

    # Adaptez ceci aux détails fournis par le site
    # Par exemple, supposons :
    # - Le lieu est dans un <p class="location">
    # - La description est dans un <div id="description">
    # - La date ou période est dans un <span class="date">
    # - Le type est dans un <span class="type">
    # - La région peut être déduite de l'URL ou d'un élément sur la page
    location_tag = soup.find('p', class_='location')
    location = location_tag.text.strip() if location_tag else None

    description_div = soup.find('div', id='description')
    description = description_div.text.strip() if description_div else None

    date_tag = soup.find('span', class_='date')
    date_event = date_tag.text.strip() if date_tag else None

    type_tag = soup.find('span', class_='type')
    event_type = type_tag.text.strip() if type_tag else None

    # Parfois la région est dans l'URL ou dans un autre tag
    # On peut extraire la région depuis l'URL si c'est structuré, par exemple :
    # https://www.paranormaldatabase.com/ ... /uk?page=...
    # Dans ce cas, on peut faire une logique :
    if 'uk' in event_url:
        region = 'UK'
    else:
        region = 'Unknown'  # Adapter selon le cas

    return location, description, date_event, event_type, region

# Fonction pour insérer l'événement dans la base de données
def insert_event(name, location, description, date_event, event_type, region):
    cursor.execute('''
        INSERT INTO Event (name, location, description, date_event, type, region)
        VALUES (%s, %s, %s, %s, %s, %s)
    ''', (name, location, description, date_event, event_type, region))
    conn.commit()

# Scraper toutes les pages
# Il faut déterminer comment naviguer entre les pages.
# Si le site a une pagination du type ?page=2, ?page=3, etc., on peut faire une boucle.
# Supposons qu'il y a une pagination simple, 10 pages. Adaptez selon le site.

base_url = 'https://www.paranormaldatabase.com'  # Exemple: page de base UK
for page_num in range(1, 11):  # exemple pour 10 pages, à adapter
    page_url = f"{base_url}?page={page_num}"
    events = get_events_list(page_url)
    for name, event_url in events:
        location, description, date_event, event_type, region = get_event_details(event_url)
        insert_event(name, location, description, date_event, event_type, region)

# Fermeture de la connexion
cursor.close()
conn.close()

print("Scraping terminé !")