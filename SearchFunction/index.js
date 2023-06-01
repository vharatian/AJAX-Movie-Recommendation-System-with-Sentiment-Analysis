const {Client} = require("@elastic/elasticsearch");
const functions = require('@google-cloud/functions-framework');

const client = new Client({
    cloud: {
        id: process.env.ELASTIC_ID,
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
    }
});

function checkCORS(req, res)
{
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

functions.http('auto-completion', async (req, res) => {

    if (checkCORS(req, res)) return;

    try {

        const query = req.query.query;

        // Search for any notes where the text field contains the query text.
        // For more search examples see:
        // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/search_examples.html
        const searchRes = await client.search({
            index: "search-movies",
            body: {
                size: 5,
                query: {
                    query_string: {
                        query: `*${query}*`,
                        fields: [
                            "title",
                            "des"
                        ]
                    }
                }
            }
        });
        const hits = searchRes.body.hits.hits;

        const titles = hits.map(h => h["_source"]["title"]);
        const data = {
            titles: titles
        };
        // Send the results
        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Error querying Elastic: ${err}`);
    }
});
