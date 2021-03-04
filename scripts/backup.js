const { conversation } = require('@assistant/conversation');
const functions = require('firebase-functions');
const fetch = require("node-fetch");

const app = conversation();
let results = new Array(5);

app.handle('Top_Anime', async conv => {
  const data = await get_top_anime_data();
  for (i = 0; i < 5; i++) {
    results[i] = insert_to_class(data[i]);
  }
  listify(conv, results);
});

app.handle('Top_Manga', async conv => {
  const data = await get_top_manga_data();
  let response = 'The top 5 manga is: ';
  for (i = 0; i < 5; i++) {
    response += `\n${data[i].title},`;
    results[i] = insert_to_class(data[i]);
  }
  response += `\n In that order.\n\n`;
  conv.add(response);
});
app.handle('Top_Season_Anime', async conv => {
  let selectedSeason = conv.intent.params.selected_season;
  const data = await get_top_season_anime(selectedSeason);
  let response = `The top 5 ${selectedSeason} anime is: `;
  for (i = 0; i < 5; i++) {
    response += `\n${data[i].title},`;
    results[i] = insert_to_class(data[i]);
  }
  conv.add(response);
});

app.handle('Search_Anime', async conv => {
  let searchName = conv.intent.params.name.original;
  let data = await search_with_name(searchName);
  let response = `First 5 search results for ${searchName} is:`;
  for (i = 0; i < 5; i++) {
    response += `\n${data[i].title},`;
    results[i] = insert_to_class(data[i]);
  }
  conv.add(response);
});

app.handle('Score_From_List', conv => {
  const id = Number(conv.intent.params.Index_Ordinal.resolved);
  const name = results[id - 1].name;
  const score = results[id - 1].score;
  const response = `The score of ${name} is ${score}`;
  conv.add(response);
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);

//Data class
class Data {
    constructor(id, name, rank, score, start_date, end_date, type, url, image_url) {
        this.id = id;
        this.name = name;
        this.rank = rank;
        this.score = score;
        this.start_date = start_date;
        this.end_date = end_date;
        this.type = type;
        this.url = url;
        this.image_url = image_url;
      	this.thumbnail = {
          url: image_url,
          alt: `Thumbnail of ${name}`
        };
    }
}

//Functions---------------------------------------------------------
//Top anime
async function get_top_anime_data() {
    const response = await fetch('https://api.jikan.moe/v3/top/anime');
    const data = await response.json();
    const animes = data.top;
    return animes;
}
//Top manga
async function get_top_manga_data() {
    const response = await fetch('https://api.jikan.moe/v3/top/manga');
    const data = await response.json();
    const mangas = data.top;
    return mangas;
}
//Top season anime
async function get_top_season_anime(season) {
    let year = new Date().getFullYear();
    const response = await fetch(`https://api.jikan.moe/v3/season/${year}/${season}`);
    const data = await response.json();
    const animes = data.anime;
    return animes;
}
//Top search results
async function search_with_name(searchWord) {
    const response = await fetch(`https://api.jikan.moe/v3/search/anime?q=${searchWord}`);
    const data = await response.json();
    const animes = data.results;
    return animes;
}
//Getting scores by id
//anime
async function get_anime_score_by_id(id) {
    const response = await fetch(`https://api.jikan.moe/v3/anime/${id}`);
    const data = await response.json();
    const score = data.score;
    return score;
}
//manga
async function get_manga_score_by_id(id) {
    const response = await fetch(`https://api.jikan.moe/v3/manga/${id}`);
    const data = await response.json();
    const score = data.score;
    return score;
}
//Helper function
function insert_to_class(response) {
    let _data = new Data(response.mal_id, response.title, response.rank, response.score, response.start_date, response.end_date, response.type, response.url, response.image_url);
    return _data;
}

function listify(conv, content, list_name) {
  conv.add("This is what i found: ");
  
  //Overrid type based on slot 'prompt_option'
  conv.session.typeOverrides = [{
    name: 'prompt_option',
    mode: 'TYPE_REPLACE',
    synonym: {
      entries: [
        {
          name: 'ITEM_1',
          synonyms: [content[0].name],
          display: {
            title: content[0].name,
            description: `Score: ${content[0].score}`,
            image: content[0].thumbnail,
          }
        },
        {
          name: 'ITEM_2',
          synonyms: [content[1].name],
          display: {
            title: content[1].name,
            description: `Score: ${content[1].score}`,
            image: content[1].thumbnail,
          }
        },
        {
          name: 'ITEM_3',
          synonyms: [content[2].name],
          display: {
            title: content[2].name,
            description: `Score: ${content[2].score}`,
            image: content[2].thumbnail,
          }
        },
        {
          name: 'ITEM_4',
          synonyms: [content[3].name],
          display: {
            title: content[3].name,
            description: `Score: ${content[3].score}`,
            image: content[3].thumbnail,
          }
        },
        {
          name: 'ITEM_5',
          synonyms: [content[4].name],
          display: {
            title: content[4].name,
            description: `Score: ${content[4].score}`,
            image: content[4].thumbnail,
          }
        },
      ]
    }
  }];
  
  //Define prompt content using keys
  conv.add(new List({
    title: list_name,
    items: [
      {
        key: 'ITEM_1'
      },
      {
        key: 'ITEM_2'
      },
      {
        key: 'ITEM_3'
      },
      {
        key: 'ITEM_4'
      },
      {
        key: 'ITEM_5'
      }
    ],
  }));
}