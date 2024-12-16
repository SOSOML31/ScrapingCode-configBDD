import requests
from bs4 import BeautifulSoup
import os
import urllib.parse

# Fonction pour télécharger une image
def download_image(img_url, folder_path):
    try:
        # Récupère le nom de l'image à partir de l'URL
        img_name = os.path.basename(img_url)
        img_path = os.path.join(folder_path, img_name)
        
        # Récupère l'image depuis l'URL
        img_data = requests.get(img_url).content
        
        # Sauvegarde l'image sur le disque
        with open(img_path, 'wb') as file:
            file.write(img_data)
        print(f"Image {img_name} téléchargée avec succès !")
    except Exception as e:
        print(f"Erreur lors du téléchargement de l'image {img_url}: {e}")

# Fonction pour scraper une page web et récupérer les images des produits
def scraper_images(url, folder_path):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Trouve toutes les balises <img> sur la page (les images des produits)
    images = soup.find_all('img')
    
    # Crée le dossier pour stocker les images si nécessaire
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    # Télécharge chaque image
    for img in images:
        img_url = img.get('src')
        
        # Si l'URL de l'image est relative, complète-la avec l'URL de base
        if img_url and img_url.startswith('/'):
            img_url = urllib.parse.urljoin(url, img_url)
        
        # Télécharge et enregistre l'image
        if img_url:
            download_image(img_url, folder_path)

# URL du site à scraper (page des produits Pokémon)
url = "https://scrapeme.live/product-category/pokemon/"

# Dossier où les images seront sauvegardées
folder_path = "pokemon_images"  # Dossier dans lequel enregistrer les images

# Lancer le scraper d'images
scraper_images(url, folder_path)