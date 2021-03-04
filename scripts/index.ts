

//Data class
class Data {
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
    constructor(id:number, name:string, rank:number, score:number, start_date:string, end_date:string, type:string, url:string, image_url:string) {
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
async function get_top_anime_data():Promise<object> {
    const response = await fetch('https://api.jikan.moe/v3/top/anime');
    const data = await response.json();
    const animes = data.top;
    return animes;
}
//Top manga
async function get_top_manga_data():Promise<object> {
    const response = await fetch('https://api.jikan.moe/v3/top/manga');
    const data = await response.json();
    const mangas = data.top;
    return mangas;
}
//Top season anime
async function get_top_season_anime(season:any):Promise<object> {
    let year = new Date().getFullYear();
    const response = await fetch(`https://api.jikan.moe/v3/season/${year}/${season}`);
    const data = await response.json();
    const animes = data.anime;
    return animes;
}
//Top search results
async function search_with_name(searchWord:any):Promise<object> {
    const response = await fetch(`https://api.jikan.moe/v3/search/anime?q=${searchWord}`);
    const data = await response.json();
    const animes = data.results;
    return animes;
}
async function get_week_anime():Promise<object> {
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
//Helper function
function insert_to_class(response:any):Data {
    const _data = new Data(response.mal_id, response.title, response.rank, response.score, response.start_date, response.end_date, response.type, response.url, response.image_url);
    return _data;
}
function find_largest_array_in_object(obj:any):number {
  let max = 0;
    for(let i = 0; i < Object.keys(obj).length; i++) {
      const current_length = obj[`${Object.keys(obj)[i]}`]['0'].length;
      if(max < current_length) {
        max = current_length;
      }
    }
    return max;
}

const result = get_week_anime().then(function (data) {
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
              table['rows'][i]['cells'][a]  = current_cell;
            }
    }
  }
  console.log(table);
});
