import axios from 'axios';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';

const API_KEY = process.env.API_KEY
const PROJECTID = 'cs-683-finalproject';
const COLLECTION_NAME = 'movies';

initializeApp();

const db = getFirestore();



export const movie = async (req, res) => {
    try {

        const query = req.query.query;

        const snapshot = await db.collection(COLLECTION_NAME).where("movie_id", "=", query).limit(1).get()
        if (!snapshot.empty){
            const doc = snapshot.docs[0];
            res.status(200).send(doc.get("data"))
        }else{
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${query}?api_key=${API_KEY}`)
            const data = {"movie_id": query, "data": response.data}
            db.collection(COLLECTION_NAME).add(data)
            res.status(200).send(response.data)
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(`Error getting movie: ${err}`);
    }
}