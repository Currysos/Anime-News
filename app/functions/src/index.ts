import { conversation, Table, Image, Simple, Card, Link } from '@assistant/conversation';
import { ImageFill } from '@assistant/conversation/dist/api/schema';
import * as functions from 'firebase-functions';
import * as fetch from 'node-fetch';

const app = conversation();
let results = new Array(5);
let current_card:Toplist_Data;
let current_detailed_data:object;

app.handle('Toplist', async conv => {
  const _type = conv.intent.params.type.resolved;
  const data = await get_toplist(_type);
  let response = `The top 5 ${_type} is: `;
  for (let i = 0; i < 5; i++) {
    response += `\n${data[i].title},`;
    results[i] = insert_to_toplist_data_class(data[i], _type);
  }
  response += `\n In that order.\n\n`;

  const title = `Top ${_type}`;
  const table = top_5_to_table(title);

  conv.add(table);
  conv.add(new Simple({
    text: '',
    speech: response
  }));


});
app.handle('Top_Season_Anime', async conv => {
  let selectedSeason = conv.intent.params.selected_season;
  const data = await get_top_season_anime(selectedSeason);
  let response = `The top 5 ${selectedSeason} anime is: `;
  for (let i = 0; i < 5; i++) {
    response += `\n${data[i].title},`;
    results[i] = insert_to_toplist_data_class(data[i], 'anime');
  }

  const title = `Top ${selectedSeason} Anime`;
  const table = top_5_to_table(title);

  conv.add(table);
  conv.add(new Simple({
    text: '',
    speech: response
  }));
});

app.handle('Search_Anime', async conv => {
  let searchName = conv.intent.params.name.original;
  let data = await search_with_name(searchName, 5);
  let response = `First 5 search results for ${searchName} is:`;
  for (let i = 0; i < 5; i++) {
    response += `\n${data[i].title},`;
    results[i] = insert_to_toplist_data_class(data[i], 'anime');
  }

  const title = `Top results for ${searchName}`
  const table = top_5_to_table(title);

  conv.add(table);
  conv.add(new Simple({
    text: '',
    speech: response
  }));
});

app.handle('Week_Schedule', async conv => {
  const data = await get_week_anime();
  const max = find_largest_array_in_object(data);
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  let table = {
    'title': 'Weekly Airing',
    'columns': [
      { 'header': 'Monday' },
      { 'header': 'Tuesday' },
      { 'header': 'Wednesday' },
      { 'header': 'Thursday' },
      { 'header': 'Friday' },
      { 'header': 'Saturday' },
      { 'header': 'Sunday' },
    ],
    'rows': new Array(max)
  };

  for (let i = 0; i < max; i++) {
    table['rows'][i] = {
      'cells': new Array(7)
    };
    for (let a = 0; a < 7; a++) {
      const current_day = weekdays[a];
      let current_cell = new Object();
      try {
        const current_title = data[current_day]['0'][i]['title'];
        current_cell = {
          'text': current_title
        };
      } catch (error) {
        console.log('No title left');
        current_cell = {
          'text': ''
        };
      } finally {
        table['rows'][i]['cells'][a] = current_cell;
      }
    }
  }
  conv.add(new Table(table));
  conv.add('This is the schedule for this and possibly next week');

});

app.handle('Properties_From_Toplist', async conv => {
  let id = Number(conv.intent.params.Index_Ordinal.resolved);
  const data = results[id - 1];
  const detailed_data = await get_detailed_data(data.id, data.type);
  const property = conv.intent.params.properties.resolved;
  const response = check_property(data, detailed_data, property);
  const card = make_card(data, detailed_data);

  conv.add(card);
  conv.add(new Simple({
    text: '',
    speech: response
  }));

  current_card = data;
  current_detailed_data = detailed_data;
});
app.handle('Properties_From_Search', async conv => {
  const searchName = conv.intent.params.name.original;
  const property = conv.intent.params.properties.resolved;

  const dataObj = await search_with_name(searchName, 1);
  const data = insert_to_toplist_data_class(dataObj[0], 'anime')
  const detailed_data = await get_detailed_data(data.id, data.type);
  const response = check_property(data, detailed_data, property);
  const card = make_card(data, detailed_data);

  conv.add(card);
  conv.add(new Simple({
    text: '',
    speech: response
  }));
  
  current_card = data;
  current_detailed_data = detailed_data;
});

app.handle('Properties_From_Card', async conv => {
  const property = conv.intent.params.properties.resolved;
  const data = current_card;
  const detailed_data = current_detailed_data;
  const response = check_property(data, detailed_data, property);
  const card = make_card(data, detailed_data);

  conv.add(card);
  conv.add(new Simple({
    text: '',
    speech: response
  }));
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);

//Data class
class Toplist_Data {
  id: number;
  name: string;
  rank: number;
  score: number;
  start_date: string;
  end_date: string;
  type: string;
  url: string;
  image_url: string;
  thumbnail: { url: string; alt: string; };
  constructor(id: number, name: string, rank: number, score: number, start_date: string, end_date: string, type: string, url: string, image_url: string) {
    this.id = id;
    this.name = name;
    this.rank = rank;
    this.score = score;
    this.start_date = start_date;
    this.end_date = end_date;
    this.type = type;
    this.url = url;
    this.image_url = image_url;
    this.thumbnail = new Image({
      url: image_url,
      alt: `Thumbnail of ${name}`
    });
  }
}

//async Functions---------------------------------------------------------
//Top anime
async function get_toplist(type: any): Promise<object> {
  const response = await fetch(`https://api.jikan.moe/v3/top/${type}`);
  const data = await response.json();
  const toplist = data.top;
  return toplist;
}
//Top season anime
async function get_top_season_anime(season: any): Promise<object> {
  let year = new Date().getFullYear();
  const response = await fetch(`https://api.jikan.moe/v3/season/${year}/${season}`);
  const data = await response.json();
  const animes = data.anime;
  return animes;
}
//Top search results
async function search_with_name(searchWord: any, limit: number): Promise<object> {
  const response = await fetch(`https://api.jikan.moe/v3/search/anime?q=${searchWord}&order_by=title&sort=ascending&limit=${limit}`);
  const data = await response.json();
  const animes = data.results;
  return animes;
}
async function get_week_anime(): Promise<object> {
  const response = await fetch(`https://api.jikan.moe/v3/schedule`);
  const data = await response.json();
  const week = {
    monday: [data.monday],
    tuesday: [data.tuesday],
    wednesday: [data.wednesday],
    thursday: [data.thursday],
    friday: [data.friday],
    saturday: [data.saturday],
    sunday: [data.sunday]
  };
  return week;
}

async function get_detailed_data(id: number, type: string): Promise<object> {
  const response = await fetch(`https://api.jikan.moe/v3/${type}/${id}`);
  const data = await response.json();
  return data;
}

//Helper function
function make_card(data: Toplist_Data, additional_data:object): Card {
  const card = new Card({
    title: data.name,
    subtitle: `Type: ${data.type} | Score: ${data.score}/10 | Rank: ${data.rank} | Aired from ${data.start_date} to ${data.end_date}`,
    text: additional_data['synopsis'],
    image: data.thumbnail,
    imageFill: ImageFill.Gray,
    button: new Link({
      name: `Link to page on My Anime List`,
      open: {
        url: data.url
      }
    })

  });

  return card;
}

function check_property (data:Toplist_Data, detailed_data:object,  property:string):string {
  let response:string;
  switch (property) {
    case 'select':
      response = `Here is ${data.name}`;
    case 'score':
      response = `The score of ${data.name} is ${data.score} out of 10`;
      break;
    case 'rank':
      response = `The rank of ${data.name} is ${data.rank}`;
      break;
    case 'synopsis':
      response = detailed_data['synopsis'];
      break;
    case 'title':
      response = data.name;
      break;
    case 'type':
      response = `${data.name} is of type ${data.type}`;
      break;
    case 'airing':
      response = `${data.name} aired from ${data.start_date} to ${data.end_date}`;
      break;
    case 'id':
      response = `${data.name} has an anime id of ${data.id}`;
      break;
    case 'status':
      response = `The status of ${data.name} is: ${detailed_data['status']}`;
      break;
    default:
      //If nothing is found
      response = `I am not able to get that data yet`;
      break;
  }

  return response;
}
function insert_to_toplist_data_class(response: any, type:string): Toplist_Data {
  let _data = new Toplist_Data(response.mal_id, response.title, response.rank, response.score, response.start_date, response.end_date, type, response.url, response.image_url);
  return _data;
}

function find_largest_array_in_object(obj: any): number {
  let max = 0;
  for (let i = 0; i < Object.keys(obj).length; i++) {
    const current_length = obj[`${Object.keys(obj)[i]}`]['0'].length;
    if (max < current_length) {
      max = current_length;
    }
  }
  return max;
}

function top_5_to_table(title: string): Table {
  let table = {
    'title': title,
    'columns': [
      { 'header': 'Rank' },
      { 'header': 'Title' },
      { 'header': 'Score' },
    ],
    'rows': new Array(5)
  };

  for (let i = 0; i < 5; i++) {
    table['rows'][i] = {
      'cells': [{
        'text': `${i + 1}`
      }, {
        'text': `${results[i].name}`
      }, {
        'text': `${results[i].score}/10`
      }]
    };
  }
  return new Table(table);
}

