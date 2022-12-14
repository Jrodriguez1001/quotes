const axios = require("axios").default;
const cron = require("node-cron");

//quotes
const urlquote = "https://api.api-ninjas.com/v1/quotes?category=love";
const getconfig = {
  headers: {
    "X-Api-Key": "MdsgkVjyyrQambcfEckKaA==ZBzjNXXDFt6vaHRd",
  },
};

const getQuote = async () => {
  try {
    const res = await axios.get(urlquote, getconfig);
    let quote = res.data[0].quote;
    console.log(quote);
    return quote;
  } catch (error) {
    console.log(error);
  }
};
/////

//translate

const translate = async () => {
  try {
    let dataquote = await getQuote();
    const translateptions = {
      method: "POST",
      url: "https://microsoft-translator-text.p.rapidapi.com/translate",
      params: {
        "to[0]": "es",
        "api-version": "3.0",
        profanityAction: "NoAction",
        textType: "plain",
      },
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "b9745ef22bmshae7468ba8174845p1081c8jsn3eac74ef179b",
        "X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
      },
      data: '[{"Text":"' + dataquote + '"}]',
    };

    const res = await axios.request(translateptions);
    let translate = res.data;
    console.log(translate[0].translations[0].text);
    return translate[0].translations[0].text;
  } catch (error) {
    console.log(error);
  }
};

/////

let adj = [
  "Buenos dias amor",
  "Hola cariño",
  "Buenos dias mi vida",
  "Wenas wenas",
];

function getRandom(min, max) {
  console.log(Math.floor(Math.random() * (max - min) + min))
  return Math.floor(Math.random() * (max - min) + min);
}

/////// whatsapp js

const qrcode = require("qrcode-terminal");

///-----
const fs = require("fs");
const { Client, NoAuth } = require("whatsapp-web.js");

// Use the saved values
const client = new Client({
  authStrategy: new NoAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");

  cron.schedule(

    `${getRandom(12,19)} 07 * * *`,
    () => {

      (async () => {
        try {
          let chatid = `51968916413@c.us`;
          let quotetrans = await translate();
          await client.sendMessage(
            chatid,
            `${
              adj[getRandom(0, adj.length)]
            }, hoy quiero dedicarte esta frase 😍 "${quotetrans}"`
          );
        } catch (error) {
          console.log(error);
        }
      })();

    },
    {
      scheduled: true,
      timezone: "America/Lima",
    }
  );
});

client.initialize();


