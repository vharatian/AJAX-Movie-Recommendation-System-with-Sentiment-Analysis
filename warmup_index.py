from elasticsearch import Elasticsearch
import pandas as pd

es = Elasticsearch(
    cloud_id="cs-683-final-project:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGE3MzE3YWI1ZmI2ZjQ5YTNiZDAwMDgyMmQyYjg0MTFjJDA1MzAyMjcwYTZkNDQ3MjBiOTk2ODJjNDI3ZmYzNjI2"
    ,basic_auth=("elastic", "<password>")

)

data = pd.read_csv("main_data.csv")
for d in data.values:
    doc = {
        "des": d[-1],
        "title": d[-2]
    }
    es.index(index="search-movies", document=doc)
