def get_recommendations(category):
    products = {
        "denim": ["Custom Denim Jacket", "Distressed Jeans"],
        "furniture": ["Wooden Chair", "Custom Table"],
        "art": ["African Painting", "Handmade Sculpture"]
    }

    return products.get(category, ["No recommendations found"])