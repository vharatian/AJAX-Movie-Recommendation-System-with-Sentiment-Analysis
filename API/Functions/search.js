import {Client} from "@elastic/elasticsearch";
import axios from 'axios';

const client = new Client({
    cloud: {
        id: process.env.ELASTIC_ID,
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
    }
});

const API_KEY = process.env.API_KEY

export const search = async (req, res) => {
    try {

        const query = req.query.query;

        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)
        res.status(200).send(response.data)



    } catch (err) {
        console.error(err);
        res.status(500).send(`Error seaching API: ${err}`);
    }
}