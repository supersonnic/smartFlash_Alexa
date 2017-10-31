var MongoClient = require('mongodb').MongoClient;
var Alexa = require('alexa-sdk');
var url = "database_url_goes_here";


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myobj = { name: "Company Inc", address: "Highway 37" };
  db.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});


var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Smart Flash';


var dictionary = [
  {
    english: "hello",
    japanese: "Kon'nichiwa",
    german: "Hallo"

  },
  {
    english: "red",
    japanese: "Ak a",
    german: "rot"
  },
  {
    english: "blue",
    japanese: "Ao",
    german: "blau"
  },

  {
    english: "white",
    japanese: "shiro",
    german: "Wei"
  },

    {
      english: "1",
      japanese: "ichi",
    german: "eins"
    },

    {
      english: "2",
      japanese: "ni",
    german: "zwei"
    },

    {
      english: "3",
      japanese: "shi",
    german: "drei"
    },

    {
      english: "4",
      japanese: "go",
    german: "vier"
    },

    {
      english: "5",
      japanese: "roku",
    german: "funf"
    },

    {
      english: "6",
      japanese: "nana",
      german: "sechs"
    },

    {
      english: "7",
      japanese: "shichi",
    german: "sieben"
    },

    {
      english: "8",
      japanese: "Hachi",
    german: "acht"
    },

    {
      english: "9",
      japanese: "Kyu",
    german: "neun"
    },

    {
      english: "10",
      japanese: "Ju",
      german: "zehn"
    },
    {
    english: "yellow",
    japanese: "ki",
    german: "gelb"
  },
  {
    english: "green",
    japanese: "midori",
    german: "Grün"
  }
    //["rojo", "red"],
    //["guten Morgen", "good morning"],
    //["fromage", "cheese"],
    //["bagno", "bathroom"]
];

var newWord = function() {
  var factIndex = Math.floor(Math.random() * dictionary.length);
  return dictionary[factIndex];
};

var currentWord = newWord();

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var correct = false;
var score = 0;
var language;
var start;
var handlers = {
    'LaunchRequest': function () {
        currentWord = newWord();
        score = 0;
        start = 0;
        var language = ''
        var output = 'Welcome to Smart Flash. What language do you want to learn?';
        this.emit(':ask', output);
    },

    'SetLanguageIntent': function () {
      if(start == 0) {
          start = 1;
      language = this.event.request.intent.slots.language.value.toLowerCase();
      var out = "Okay! I'll quiz you on" + language + ". . . . . . .Translate, " + currentWord[language];
      this.emit(':ask', out); }
      else {
          this.emit('GetWordCont');
      }

},

    'GetWordCont': function () {
        var output = '';
        var out = '';
        if (correct === true) {
            currentWord = newWord();
            output = " Correct, Translate, " + currentWord[language];
        } else {
            output = "Incorrect, the correct translation is" + currentWord['english'];
            currentWord = newWord();
            out = " . . Next, Translate " + currentWord[language];
        }
        this.emit(':ask', output + out);
    },
    'GetScore': function() {
      this.emit(':ask', 'you have gotten ' + score + " correct", "Say, give me a new word ,  continue");
    },
    'AnswerIntent': function() {
        if (this.event.request.intent.slots.answers.value === currentWord['english']) {
            score++;
            correct = true;
        } else {
            correct = false;
        }
        this.emit("GetWordCont");
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = " help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};
