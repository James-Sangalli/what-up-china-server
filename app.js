const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const request = require('superagent');
const parse = require("node-html-parser").parse;
const apiKeysNews = [
    "6d7709b0ec234faab6e438466941c2ae",
    "15e281928b994633ab09b55784ce35cd",
    "0e9d878eeb994e5087ad30e40e5706db"
]

app.get("/baidu/hot-news/", (req, res, next) => {
    res.header( 'Access-Control-Allow-Origin','*' );
    getBaiduHotNews().then((response) => {
        res.send(response);
    }).catch((err) => {
        res.send(err);
    });
});

app.get("/top-news/", (req, res, next) => {
    res.header( 'Access-Control-Allow-Origin','*' );
    callNewsAPI(0).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.send(err);
    });
});

app.get("/bilibili/trending/", (req, res, next) => {
    res.header( 'Access-Control-Allow-Origin','*' );
    const query = "https://api.bilibili.com/x/web-interface/dynamic/region?&jsonp=jsonp&ps=10&rid=1";
    request.get(query).then((result) => {
        res.send(JSON.parse(result.text).data.archives)
    }).catch((err) => {
        res.send(err);
    })
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

//TODO this is gross
async function getBaiduHotNews() {
    const query = "https://news.baidu.com/";
    const articles = [];
    try {
        let result = await request.get(query);
        let parsedHtml = parse(result.text);
        const topNews = parsedHtml.querySelector(".hotnews").childNodes[1];
        for(let i = 0; i < topNews.childNodes.length; i+=2) {
            const section = topNews.childNodes[i].childNodes.toString();
            const link = section.match(/\bhttps?:\/\/\S+/gi)[0].replace('"', "");
            let title = section.match(/\p{Script=Han}+/gu);
            title = title[title.length - 1];
            if(!link.includes("<strong>")) {
                articles.push({
                    title: title,
                    link: link
                });
            }
        }

        return articles;
    } catch (e) {
        console.error(e);
        return e;
    }
}

app.listen(port, () => console.log(`listening at ${port}`));
