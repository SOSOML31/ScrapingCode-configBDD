import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re

# Fonction pour télécharger une ressource (image, css, js)
def download_resource(url, folder_path):
    try:
        # Récupère le nom du fichier à partir de l'URL
        resource_name = os.path.basename(urlparse(url).path)
        
        # Si le nom de la ressource est vide (par exemple, pour des dossiers)
        if not resource_name:
            resource_name = url.split('/')[-1]

        # Crée le chemin d'enregistrement
        resource_path = os.path.join(folder_path, resource_name)
        
        # Si la ressource existe déjà, on ne la télécharge pas à nouveau
        if os.path.exists(resource_path):
            return resource_path
        
        # Télécharger la ressource
        response = requests.get(url)
        with open(resource_path, 'wb') as f:
            f.write(response.content)
        
        print(f"Ressource téléchargée : {resource_path}")
        return resource_path
    except Exception as e:
        print(f"Erreur lors du téléchargement de {url}: {e}")
        return None

# Fonction pour télécharger le HTML d'une page et ses ressources
def scrape_page(url, folder_path):
    # Créer le dossier de base pour la page
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    # Télécharger le HTML de la page
    response = requests.get(url)
    html = response.text

    # Sauvegarder le HTML localement
    html_filename = os.path.join(folder_path, 'index.html')
    with open(html_filename, 'w', encoding='utf-8') as file:
        file.write(html)
    print(f"HTML téléchargé et enregistré : {html_filename}")
    
    # Analyser le HTML avec BeautifulSoup
    soup = BeautifulSoup(html, 'html.parser')

    # Télécharger les ressources CSS, JavaScript et les images
    resources = []

    # Scraper les fichiers CSS
    for css_link in soup.find_all('link', {'rel': 'stylesheet'}):
        css_url = css_link.get('href')
        if css_url:
            full_url = urljoin(url, css_url)
            resources.append(full_url)

    # Scraper les fichiers JavaScript
    for js_script in soup.find_all('script', {'src': True}):
        js_url = js_script.get('src')
        if js_url:
            full_url = urljoin(url, js_url)
            resources.append(full_url)

    # Scraper les images
    for img_tag in soup.find_all('img', {'src': True}):
        img_url = img_tag.get('src')
        if img_url:
            full_url = urljoin(url, img_url)
            resources.append(full_url)

    # Télécharger toutes les ressources
    for resource in resources:
        download_resource(resource, folder_path)

    # Modifier le HTML pour pointer vers les ressources locales
    for css_link in soup.find_all('link', {'rel': 'stylesheet'}):
        css_url = css_link.get('href')
        if css_url:
            full_url = urljoin(url, css_url)
            local_css_path = download_resource(full_url, folder_path)
            if local_css_path:
                css_link['href'] = os.path.basename(local_css_path)

    for js_script in soup.find_all('script', {'src': True}):
        js_url = js_script.get('src')
        if js_url:
            full_url = urljoin(url, js_url)
            local_js_path = download_resource(full_url, folder_path)
            if local_js_path:
                js_script['src'] = os.path.basename(local_js_path)

    for img_tag in soup.find_all('img', {'src': True}):
        img_url = img_tag.get('src')
        if img_url:
            full_url = urljoin(url, img_url)
            local_img_path = download_resource(full_url, folder_path)
            if local_img_path:
                img_tag['src'] = os.path.basename(local_img_path)

    # Sauvegarder le HTML modifié
    with open(html_filename, 'w', encoding='utf-8') as file:
        file.write(str(soup))
    print(f"HTML modifié avec les liens locaux : {html_filename}")

url = 'https://track.bpost.cloud/btr/web/#/home?lang=fr'
folder_path = 'bpost'

# Lancer le scraping de la page
scrape_page(url, folder_path)