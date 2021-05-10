const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const request = require('superagent');
const apiKeysNews = [
    "6d7709b0ec234faab6e438466941c2ae",
    "15e281928b994633ab09b55784ce35cd",
    "0e9d878eeb994e5087ad30e40e5706db"
]

app.get("/top-news/", (req, res, next) => {
    res.header( 'Access-Control-Allow-Origin','*' );
    callNewsAPI(0).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.send(err);
    });
});

async function callNewsAPI(apiKeyIndex) {
    const query = `https://newsapi.org/v2/top-headlines?country=cn&apiKey=${apiKeysNews[apiKeyIndex]}`;
    try {
        let result = await request.get(query);
        return JSON.parse(result.text).articles;
    } catch (e) {
        console.error(e);
        if(e.message === "Too Many Requests") {
            return callNewsAPI(++apiKeyIndex);
        } else {
            return e;
        }
    }
}

app.listen(port, () => console.log(`listening at ${port}`));
