const http =  require('http');
const rp = require('request-promise');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const request = require('request');
const ocrSpaceApi = require('ocr-space-api');
const cron = require('node-cron');
const SlackBot = require('slackbots');
const axios = require('axios');
const nodemailer = require('nodemailer');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var SlackClient = require('slack-client').WebClient;
const Promise = require('bluebird');
//const WebClient = require('slack-client').WebClient;


const hostname = '127.0.0.1';
const port = 5000;


const server = http.createServer((req, res) => {
   res.statusCode = 200;
   res.setHeader('Content-type', 'text/plain');
   res.end('Ocr api with Nodejs!');
});

server.listen(port,hostname, () => {
    console.log('Server started on port ' + port);
});


let today = new Date();
let dd = today.getDate();

let mm = today.getMonth()+1; 
let yyyy = today.getFullYear();
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
} 
today = mm+'-'+dd+'-'+yyyy;

    // Cron Job 
cron.schedule('5 53 18 * * 1-5', () => {
  console.log('Cron Job starting bot everyday from monday to friday...');


let family = 'channels';
let team  = 'slack-api';
let value = 'general';
let myChannelID = 'xxxx';
var bot;

const token = 'xxxx-token'  // prvi token za read

// Automatically reconnect after an error response from Slack.
var autoReconnect = true;

var slackClient = new SlackClient(token, autoReconnect);


let getChannelHistory = function() {
    this.get = function(family, value, callback) {
    let xhr = new XMLHttpRequest();
    // This builds the actual structure of the API call using our provided variables
    let url = "https://" + team + ".slack.com/api/" + family + ".history?token=" + token + "&channel=" + value;
    xhr.onreadystatechange = function() { 
      if (xhr.readyState == 4 && xhr.status == 200)
        callback(xhr.responseText);
      }
      xhr.open("GET", url, true); 
      xhr.send();
    }
  }


    // Get the message history for the channel
        // using our custom API call
        history = new getChannelHistory();
        history.get(family, myChannelID, function(response) {
          // Now that we have our messages, 
          // let's parse them to make them readable
          json = JSON.parse(response);
  
          // The history object had a few children, 
          // so we're just pulling out the "messages" child
          mymessages = json['messages'];
  
          // Create an array to hold our filtered list of messages
          let unresolved = [];

          var messages = { 
            reactions: [], 
            text: [], 
            users: [] 
        }
  
          // Filter for messages that don't have reactions
          for (let i = 0; mymessages.length > i; i++) {
            // For each message, get the reactions (if any)
            let msgStatus = mymessages[i]['reactions'];

           
          
            // If the message has no reactions...
            if (typeof msgStatus == "undefined") {
              // ...add the message to our array
              unresolved.push(mymessages[i].text);
            }else{


              var menu = mymessages[i].text  + ' ' + '-' +  ' ' +msgStatus[0].count  + ' ' + 'pieces' + '\r\n';

              console.log(i+'=>' + menu);
                    myWrite(menu)
     
                   // console.log(i+"=>"+ menu);

                if(i > 2 ){
                  
                    continue;
                }

                
                messages.reactions.push(msgStatus);
                messages.text.push(mymessages[i].text);
            }

          };
  
          // Once we've finished looping through all the messages
          // count how many didn't have reactions, for logging
          let myCount = unresolved.length;
  
          // Combine our array of unresolved messages into one line
          // so the bot can send just one message to slack
          let list = unresolved.join("\n");


         var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
                 user: 'stojanovicsrdjan27@gmail.com',
                 pass: ''
             }
         });
        
         var attachments = [{ filename: 'menu.txt', path: __dirname + '/menu.txt', contentType: 'application/text' }];
        
         const mailOptions = {
          from: 'stojanovicsrdjan27@gmail.com', // sender address
          to: 'stojanovicsrdjan@programmer.net', // list of receivers
          subject: 'Food order for our company', // Subject line
          html: '<p>Hi there. Our order for today '+'('+today+')'+' is in Attachement.</p>',// plain text body
          attachments: attachments,
        };
        
        transporter.sendMail(mailOptions, function (err, info) {
          if(err)
            console.log(err)
          else
            console.log(info);
        });

});




});


function inRange(x, min, max) {
    return ((x-min)*(x-max) <= 0);
}


function searchImage() {
    let pathToFoodMenuPage = '';
    return fetch(pathToFoodMenuPage)
        .then(response => response.text());
}


var download = function(uri, filename, callback){
    let pathToImageMenu;
  uri = pathToImageMenu;
    request.head(uri, function(err, res, body){
      //  console.log('content-type:', res.headers['content-type']);
     //   console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

searchImage()
    .then(body => {
        const $ = cheerio.load(body);
        $('.menu').each(function (i, element) {

            let imageSrc = element.children[1].attribs.src;

           download(imageSrc, 'food_menu.jpg', function(){
                   console.log('Image dowloaded');
               });

         /*
               if(inRange(diff.toFixed(2), 0.68, 0.79)){

               download(imageSrc, 'food_menu.jpg', function(){
                   console.log('Image dowloaded');
               });
            }

            */
        })
    });


function getCurrentDate() {
    let today = new Date();
    let dd = today.getDate();

    let mm = today.getMonth()+1;
    const yyyy = today.getFullYear();
    if(dd<10)
    {
        dd=`0${dd}`;
    }

    if(mm<10)
    {
        mm=`0${mm}`;
    }
    today = `${dd}.${mm}.${yyyy}`;
    return today;

}


function myWrite(data) {
    fs.appendFile('menu.txt', data, function (err) {
      if (err) { /* Do whatever is appropriate if append fails*/ }
    });
}

const curDate = getCurrentDate();

// Opcije za ocr spsace api
let options =  {
    apikey: 'ocrSpaceApikey',
    language: 'eng',
    imageFormat: 'image/png', // Image Type (Only png ou gif is acceptable at the moment i wrote this)
    isOverlayRequired: true
};

// Image file to upload
const imageFilePath = "food_menu.jpg";

// Run and wait the result
ocrSpaceApi.parseImageFromLocalFile(imageFilePath, options)
    .then(function (parsedResult) {

       let arr = parsedResult.parsedText.split(/\r\n/);

        const bot  = new SlackBot({
                token: 'xxxx-token',  // slack-api -stojanovicsrdjan27@gmail.com taj mejl sam koristio
                name: 'FoodBot'
            });

        bot.on('start', () => {
            const params = {
                icon_emoji: ':robot_face:'
            };

            let x = 0;

            setInterval(function() {

                if (x < arr.length) {
                    let j = x + 1;

                    if(arr[x].substring(0, 1) == "$"){
                           delete arr[x];
                    }

                if(typeof arr[x] !== 'undefined' && arr[x] !== ""){

                    bot.postMessageToChannel('food-time',  + j + "." + " " + arr[x], params);
                    console.log(x+"=>"+ arr[x]);
                }
                  
                }

            else return;

                x++;
            }, 200);

        });

      
        }).catch(function (err) {
        console.log('ERROR:', err);
    });