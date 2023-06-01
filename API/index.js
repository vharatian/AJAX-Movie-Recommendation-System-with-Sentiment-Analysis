import {autoCompletion} from "./Functions/autoCompletion.js";
import {search} from "./Functions/search.js";
import {movie} from "./Functions/movie.js";

function checkCORS(req, res) {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
        return true;
    } else {
        return false;
    }
}

const main = (req, res) => {
    if (checkCORS(req, res)) return;

    const task = req.query.task;
    if (task === 'completion'){
        autoCompletion(req, res)
    }else if( task === 'search'){
        search(req, res)
    }else if( task === 'movie'){
        movie(req, res)
    }
}

export {main as autoCompletion};