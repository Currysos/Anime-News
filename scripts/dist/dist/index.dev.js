"use strict"; //Data class

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Data = function Data(id, name, rank, score, start_date, end_date, type, url, image_url) {
  _classCallCheck(this, Data);

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
    alt: "Thumbnail of ".concat(name)
  };
}; //Functions---------------------------------------------------------
//Top anime


function get_top_anime_data() {
  var response, data, animes;
  return regeneratorRuntime.async(function get_top_anime_data$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch('https://api.jikan.moe/v3/top/anime'));

        case 2:
          response = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          data = _context.sent;
          animes = data.top;
          return _context.abrupt("return", animes);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
} //Top manga


function get_top_manga_data() {
  var response, data, mangas;
  return regeneratorRuntime.async(function get_top_manga_data$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(fetch('https://api.jikan.moe/v3/top/manga'));

        case 2:
          response = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          data = _context2.sent;
          mangas = data.top;
          return _context2.abrupt("return", mangas);

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
} //Top season anime


function get_top_season_anime(season) {
  var year, response, data, animes;
  return regeneratorRuntime.async(function get_top_season_anime$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          year = new Date().getFullYear();
          _context3.next = 3;
          return regeneratorRuntime.awrap(fetch("https://api.jikan.moe/v3/season/".concat(year, "/").concat(season)));

        case 3:
          response = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          data = _context3.sent;
          animes = data.anime;
          return _context3.abrupt("return", animes);

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
} //Top search results


function search_with_name(searchWord) {
  var response, data, animes;
  return regeneratorRuntime.async(function search_with_name$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(fetch("https://api.jikan.moe/v3/search/anime?q=".concat(searchWord)));

        case 2:
          response = _context4.sent;
          _context4.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          data = _context4.sent;
          animes = data.results;
          return _context4.abrupt("return", animes);

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function get_week_anime() {
  var response, data, week;
  return regeneratorRuntime.async(function get_week_anime$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(fetch("https://api.jikan.moe/v3/schedule"));

        case 2:
          response = _context5.sent;
          _context5.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          data = _context5.sent;
          week = {
            monday: [data.monday],
            tuesday: [data.tuesday],
            wednesday: [data.wednesday],
            thursday: [data.thursday],
            friday: [data.friday],
            saturday: [data.saturday],
            sunday: [data.sunday]
          };
          return _context5.abrupt("return", week);

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
} //Helper function


function insert_to_class(response) {
  var _data = new Data(response.mal_id, response.title, response.rank, response.score, response.start_date, response.end_date, response.type, response.url, response.image_url);

  return _data;
}

function find_largest_array_in_object(obj) {
  var max = 0;

  for (var i = 0; i < Object.keys(obj).length; i++) {
    var current_length = obj["".concat(Object.keys(obj)[i])]['0'].length;

    if (max < current_length) {
      max = current_length;
    }
  }

  return max;
}

var result = get_week_anime().then(function (data) {
  var max = find_largest_array_in_object(data);
  var weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  var table = {
    'title': 'Weekly Airing',
    'columns': [{
      'header': 'Monday'
    }, {
      'header': 'Tuesday'
    }, {
      'header': 'Wednesday'
    }, {
      'header': 'Thursday'
    }, {
      'header': 'Friday'
    }, {
      'header': 'Saturday'
    }, {
      'header': 'Sunday'
    }],
    'rows': new Array(max)
  };

  for (var i = 0; i < max; i++) {
    table['rows'][i] = {
      'cells': new Array(7)
    };

    for (var a = 0; a < 7; a++) {
      var current_day = weekdays[a];

      try {
        var current_title = data[current_day]['0'][i]['title'];
        var current_cell = {
          'text': current_title
        };
      } catch (error) {
        console.log('No title left');
        var _current_cell = {
          'text': ''
        };
      }
    }
  }
});