"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var conversation_1 = require("@assistant/conversation");
var functions = require("firebase-functions");
var fetch = require("node-fetch");
var app = conversation_1.conversation();
var results = new Array(5);
app.handle('Top_Anime', function (conv) { return __awaiter(void 0, void 0, void 0, function () {
    var data, response, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, get_top_anime_data()];
            case 1:
                data = _a.sent();
                response = 'The top 5 anime is: ';
                for (i = 0; i < 5; i++) {
                    response += "\n" + data[i].title + ",";
                    results[i] = insert_to_class(data[i]);
                }
                response += "\n In that order.\n\n";
                conv.add(response);
                return [2 /*return*/];
        }
    });
}); });
app.handle('Top_Manga', function (conv) { return __awaiter(void 0, void 0, void 0, function () {
    var data, response, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, get_top_manga_data()];
            case 1:
                data = _a.sent();
                response = 'The top 5 manga is: ';
                for (i = 0; i < 5; i++) {
                    response += "\n" + data[i].title + ",";
                    results[i] = insert_to_class(data[i]);
                }
                response += "\n In that order.\n\n";
                conv.add(response);
                return [2 /*return*/];
        }
    });
}); });
app.handle('Top_Season_Anime', function (conv) { return __awaiter(void 0, void 0, void 0, function () {
    var selectedSeason, data, response, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                selectedSeason = conv.intent.params.selected_season;
                return [4 /*yield*/, get_top_season_anime(selectedSeason)];
            case 1:
                data = _a.sent();
                response = "The top 5 " + selectedSeason + " anime is: ";
                for (i = 0; i < 5; i++) {
                    response += "\n" + data[i].title + ",";
                    results[i] = insert_to_class(data[i]);
                }
                conv.add(response);
                return [2 /*return*/];
        }
    });
}); });
app.handle('Search_Anime', function (conv) { return __awaiter(void 0, void 0, void 0, function () {
    var searchName, data, response, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                searchName = conv.intent.params.name.original;
                return [4 /*yield*/, search_with_name(searchName)];
            case 1:
                data = _a.sent();
                response = "First 5 search results for " + searchName + " is:";
                for (i = 0; i < 5; i++) {
                    response += "\n" + data[i].title + ",";
                    results[i] = insert_to_class(data[i]);
                }
                conv.add(response);
                return [2 /*return*/];
        }
    });
}); });
app.handle('Score_From_List', function (conv) {
    var id = Number(conv.intent.params.Index_Ordinal.resolved);
    var name = results[id - 1].name;
    var score = results[id - 1].score;
    var response = "The score of " + name + " is " + score;
    conv.add(response);
});
app.handle('Week_Schedule', function (conv) { return __awaiter(void 0, void 0, void 0, function () {
    var data, max, weekdays, table, i, a, current_day, current_cell, current_title;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                conv.add("Schedule for next week is: ");
                return [4 /*yield*/, get_week_anime()];
            case 1:
                data = _a.sent();
                max = find_largest_array_in_object(data);
                weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                table = {
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
                for (i = 0; i < max; i++) {
                    table['rows'][i] = {
                        'cells': new Array(7)
                    };
                    for (a = 0; a < 7; a++) {
                        current_day = weekdays[a];
                        current_cell = new Object();
                        try {
                            current_title = data[current_day]['0'][i]['title'];
                            current_cell = {
                                'text': current_title
                            };
                        }
                        catch (error) {
                            console.log('No title left');
                            current_cell = {
                                'text': ''
                            };
                        }
                        finally {
                            table['rows'][i]['cells'][a] = current_cell;
                        }
                    }
                }
                conv.add(new conversation_1.Table(table));
                return [2 /*return*/];
        }
    });
}); });
exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
//Data class
var Anime_Data = /** @class */ (function () {
    function Anime_Data(id, name, rank, score, start_date, end_date, type, url, image_url) {
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
            alt: "Thumbnail of " + name
        };
    }
    return Anime_Data;
}());
//Functions---------------------------------------------------------
//Top anime
function get_top_anime_data() {
    return __awaiter(this, void 0, Promise, function () {
        var response, data, animes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('https://api.jikan.moe/v3/top/anime')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    animes = data.top;
                    return [2 /*return*/, animes];
            }
        });
    });
}
//Top manga
function get_top_manga_data() {
    return __awaiter(this, void 0, Promise, function () {
        var response, data, mangas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('https://api.jikan.moe/v3/top/manga')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    mangas = data.top;
                    return [2 /*return*/, mangas];
            }
        });
    });
}
//Top season anime
function get_top_season_anime(season) {
    return __awaiter(this, void 0, Promise, function () {
        var year, response, data, animes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    year = new Date().getFullYear();
                    return [4 /*yield*/, fetch("https://api.jikan.moe/v3/season/" + year + "/" + season)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    animes = data.anime;
                    return [2 /*return*/, animes];
            }
        });
    });
}
//Top search results
function search_with_name(searchWord) {
    return __awaiter(this, void 0, Promise, function () {
        var response, data, animes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://api.jikan.moe/v3/search/anime?q=" + searchWord)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    animes = data.results;
                    return [2 /*return*/, animes];
            }
        });
    });
}
function get_week_anime() {
    return __awaiter(this, void 0, Promise, function () {
        var response, data, week;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://api.jikan.moe/v3/schedule")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    week = {
                        monday: [data.monday],
                        tuesday: [data.tuesday],
                        wednesday: [data.wednesday],
                        thursday: [data.thursday],
                        friday: [data.friday],
                        saturday: [data.saturday],
                        sunday: [data.sunday]
                    };
                    return [2 /*return*/, week];
            }
        });
    });
}
//Getting scores by id
//anime
// async function get_anime_score_by_id(id:number) {
//     const response = await fetch(`https://api.jikan.moe/v3/anime/${id}`);
//     const data = await response.json();
//     const score = data.score;
//     return score;
// }
// //manga
// async function get_manga_score_by_id(id:number) {
//     const response = await fetch(`https://api.jikan.moe/v3/manga/${id}`);
//     const data = await response.json();
//     const score = data.score;
//     return score;
// }
//Helper function
function insert_to_class(response) {
    var _data = new Anime_Data(response.mal_id, response.title, response.rank, response.score, response.start_date, response.end_date, response.type, response.url, response.image_url);
    return _data;
}
// function listify(conv:any, content:any, list_name:string) {
//   conv.add("This is what i found: ");
//   //Overrid type based on slot 'prompt_option'
//   conv.session.typeOverrides = [{
//     name: 'prompt_option',
//     mode: 'TYPE_REPLACE',
//     synonym: {
//       entries: [
//         {
//           name: 'ITEM_1',
//           synonyms: [content[0].name],
//           display: {
//             title: content[0].name,
//             description: `Score: ${content[0].score}`,
//             image: content[0].thumbnail,
//           }
//         },
//         {
//           name: 'ITEM_2',
//           synonyms: [content[1].name],
//           display: {
//             title: content[1].name,
//             description: `Score: ${content[1].score}`,
//             image: content[1].thumbnail,
//           }
//         },
//         {
//           name: 'ITEM_3',
//           synonyms: [content[2].name],
//           display: {
//             title: content[2].name,
//             description: `Score: ${content[2].score}`,
//             image: content[2].thumbnail,
//           }
//         },
//         {
//           name: 'ITEM_4',
//           synonyms: [content[3].name],
//           display: {
//             title: content[3].name,
//             description: `Score: ${content[3].score}`,
//             image: content[3].thumbnail,
//           }
//         },
//         {
//           name: 'ITEM_5',
//           synonyms: [content[4].name],
//           display: {
//             title: content[4].name,
//             description: `Score: ${content[4].score}`,
//             image: content[4].thumbnail,
//           }
//         },
//       ]
//     }
//   }];
//   //Define prompt content using keys
//   conv.add(new List({
//     title: list_name,
//     items: [
//       {
//         key: 'ITEM_1'
//       },
//       {
//         key: 'ITEM_2'
//       },
//       {
//         key: 'ITEM_3'
//       },
//       {
//         key: 'ITEM_4'
//       },
//       {
//         key: 'ITEM_5'
//       }
//     ],
//   }));
// }
function find_largest_array_in_object(obj) {
    var max = 0;
    for (var i = 0; i < Object.keys(obj).length; i++) {
        var current_length = obj["" + Object.keys(obj)[i]]['0'].length;
        if (max < current_length) {
            max = current_length;
        }
    }
    return max;
}
