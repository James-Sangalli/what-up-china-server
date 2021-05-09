const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const request = require('superagent');

app.get("/top-news/", (req, res, next) => {
    res.header( 'Access-Control-Allow-Origin','*' );
    const query = `https://newsapi.org/v2/top-headlines?country=cn&apiKey=6d7709b0ec234faab6e438466941c2ae`;
    request.get(query).then((data) => {
        res.send(JSON.parse(data.text.articles));
    }).catch(res.send);
});

app.listen(port, () => console.log(`listening at ${port}`));
