const {Client} = require("@elastic/elasticsearch");

// Initialize Elastic, requires installing Elastic dependencies:
// https://github.com/elastic/elasticsearch-js
//
// ID, username, and password are stored in functions config variables
const ELASTIC_ID = functions.config().elastic.id;
const ELASTIC_USERNAME = functions.config().elastic.username;
const ELASTIC_PASSWORD = functions.config().elastic.password;

const client = new Client({
    cloud: {
        id: ELASTIC_ID,
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSWORD,
    }
});


functions.http('auto-completion', async (req, res) => {
    try {

        const query = req.query.query;

        // Search for any notes where the text field contains the query text.
        // For more search examples see:
        // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/search_examples.html
        const searchRes = await client.search({
            index: "movies",
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
