const DEMOCRACY = {
  "categories": [
    {
      "id": 0,
      "title": "Demokrati & diktatur",
      "icon": "🗳️",
      "description": "Folkstyre, frihet och lika röster"
    },
    {
      "id": 1,
      "title": "Att påverka",
      "icon": "🙋",
      "description": "Direkt, representativt och i skolan"
    },
    {
      "id": 2,
      "title": "Val & partier",
      "icon": "📮",
      "description": "Rösträtt, partier och val"
    },
    {
      "id": 3,
      "title": "Riksdag & regering",
      "icon": "🏛️",
      "description": "Vem bestämmer vad?"
    },
    {
      "id": 4,
      "title": "Lagar & statschef",
      "icon": "📜",
      "description": "Demokratins skydd och landets representant"
    },
    {
      "id": 5,
      "title": "Nära dig & Europa",
      "icon": "🌍",
      "description": "Kommun, region och EU"
    }
  ],
  "cards": [
    {
      "id": "c0",
      "cat": 0,
      "term": "Demokrati",
      "answer": "Demokrati betyder folkstyre. Folket påverkar hur landet styrs genom fria val. Människor har rättigheter, till exempel yttrandefrihet.",
      "prompt": "Förklara demokrati och ge två kännetecken.",
      "check": [
        "Folkstyre",
        "Fria val",
        "Rättigheter, till exempel yttrandefrihet"
      ]
    },
    {
      "id": "c1",
      "cat": 0,
      "term": "Diktatur",
      "answer": "En person eller en liten grupp har makten. Folket kan inte välja sina ledare i fria val. Kritik och fria medier begränsas ofta.",
      "prompt": "Vad skiljer en diktatur från en demokrati? Ge minst två skillnader.",
      "check": [
        "Vem som har makten",
        "Fria val eller inte",
        "Möjlighet att kritisera makten"
      ]
    },
    {
      "id": "c2",
      "cat": 0,
      "term": "Allmän och lika rösträtt",
      "answer": "Allmän rösträtt innebär att alla som uppfyller rösträttsvillkoren får rösta. Lika rösträtt betyder att varje persons röst är lika mycket värd.",
      "prompt": "Förklara både allmän och lika rösträtt.",
      "check": [
        "Alla som uppfyller villkoren får rösta",
        "Alla röster är lika mycket värda"
      ]
    },
    {
      "id": "c3",
      "cat": 0,
      "term": "Yttrandefrihet",
      "answer": "Rätt att uttrycka tankar och åsikter och kritisera makten. Friheten har gränser: man får till exempel inte hota någon.",
      "prompt": "Varför behövs yttrandefrihet i en demokrati? Ge ett exempel.",
      "check": [
        "Människor kan säga vad de tycker",
        "Kan granska och kritisera makten",
        "Ett konkret exempel"
      ]
    },
    {
      "id": "c4",
      "cat": 0,
      "term": "Majoritet och minoritet",
      "answer": "Majoritet betyder här mer än hälften. Minoritet är mindre än hälften. Om 18 av 30 elever röstar ja är de en majoritet.",
      "prompt": "18 av 30 elever röstar ja. Vilka är majoritet och minoritet? Förklara.",
      "check": [
        "18 är mer än hälften och är majoritet",
        "12 är mindre än hälften och är minoritet"
      ]
    },
    {
      "id": "c5",
      "cat": 1,
      "term": "Direktdemokrati",
      "answer": "Människor röstar själva i en sakfråga. Fördel: direkt inflytande. Nackdel: många beslut tar tid och kräver att alla sätter sig in i frågorna.",
      "prompt": "Förklara direktdemokrati med ett exempel, en fördel och en nackdel.",
      "check": [
        "Rösta direkt i en fråga",
        "Exempel: omröstning i klassen",
        "Fördel och nackdel"
      ]
    },
    {
      "id": "c6",
      "cat": 1,
      "term": "Representativ demokrati",
      "answer": "Folket väljer representanter som fattar beslut. Fördel: de kan lägga tid på att sätta sig in i frågor. Nackdel: de kan besluta annorlunda än en väljare vill.",
      "prompt": "Hur fungerar representativ demokrati? Ge en fördel och en nackdel.",
      "check": [
        "Välja representanter",
        "Representanterna fattar beslut",
        "Fördel och nackdel"
      ]
    },
    {
      "id": "c7",
      "cat": 1,
      "term": "Folkomröstning",
      "answer": "Väljarna röstar direkt i en särskild fråga. Sverige har till exempel haft en folkomröstning om medlemskap i EU. En folkomröstning kan vara rådgivande.",
      "prompt": "Vad är en folkomröstning? Hur skiljer den sig från att välja politiker?",
      "check": [
        "Rösta i en sakfråga",
        "Välja politiker innebär att välja representanter"
      ]
    },
    {
      "id": "c8",
      "cat": 1,
      "term": "Klassråd",
      "answer": "Ett möte där eleverna i en klass tar upp gemensamma frågor och förslag, till exempel om arbetsro. Alla ska få möjlighet att komma till tals.",
      "prompt": "Hur kan du påverka din skola genom klassrådet?",
      "check": [
        "Ta upp ett förslag",
        "Lyssna och diskutera",
        "Ett konkret exempel"
      ]
    },
    {
      "id": "c9",
      "cat": 1,
      "term": "Elevråd",
      "answer": "Elevernas representanter från olika klasser samlas och tar upp frågor för hela skolan. De kan föra förslag vidare till rektorn.",
      "prompt": "Vad gör elevrådet, och varför är det ett exempel på representativ demokrati?",
      "check": [
        "Representanter för klasser",
        "Frågor för hela skolan",
        "För elevernas åsikter vidare"
      ]
    },
    {
      "id": "c10",
      "cat": 2,
      "term": "Politiskt parti",
      "answer": "En grupp människor med gemensamma politiska idéer om hur samhället ska fungera. Partier ställer upp i val för att påverka besluten.",
      "prompt": "Vad är ett politiskt parti och varför finns olika partier?",
      "check": [
        "Gemensamma politiska idéer",
        "Människor tycker olika",
        "Vill påverka beslut genom val"
      ]
    },
    {
      "id": "c11",
      "cat": 2,
      "term": "Partierna i underlaget",
      "answer": "S: Socialdemokraterna. M: Moderaterna. SD: Sverigedemokraterna. V: Vänsterpartiet. C: Centerpartiet. KD: Kristdemokraterna. MP: Miljöpartiet. L: Liberalerna.",
      "prompt": "Skriv namnen på de åtta partierna i provunderlaget.",
      "check": [
        "Socialdemokraterna, Moderaterna",
        "Sverigedemokraterna, Vänsterpartiet",
        "Centerpartiet, Kristdemokraterna",
        "Miljöpartiet, Liberalerna"
      ]
    },
    {
      "id": "c12",
      "cat": 2,
      "term": "Ordinarie val",
      "answer": "Ordinarie val till riksdag, kommun och region hålls vart fjärde år. Då väljer väljarna vilka som ska representera dem.",
      "prompt": "Hur ofta hålls ordinarie val till riksdag, kommun och region? Vad väljer man?",
      "check": [
        "Vart fjärde år",
        "Representanter till riksdag, kommun och region"
      ]
    },
    {
      "id": "c13",
      "cat": 2,
      "term": "4-procentsspärren",
      "answer": "Huvudregeln är att ett parti behöver minst 4 procent av rösterna i hela landet för att få mandat i riksdagen. Mandat betyder plats.",
      "prompt": "Vad innebär 4-procentsspärren?",
      "check": [
        "Huvudregel: minst 4 procent",
        "Av rösterna i hela landet",
        "För att få platser i riksdagen"
      ]
    },
    {
      "id": "c14",
      "cat": 2,
      "term": "Rösträtt i riksdagsval",
      "answer": "För att rösta i riksdagsval ska du fylla 18 år senast på valdagen, vara svensk medborgare och vara eller ha varit folkbokförd i Sverige.",
      "prompt": "Vilka villkor gäller för att få rösta i riksdagsvalet?",
      "check": [
        "18 år senast på valdagen",
        "Svensk medborgare",
        "Är eller har varit folkbokförd i Sverige"
      ]
    },
    {
      "id": "c15",
      "cat": 3,
      "term": "Riksdagen",
      "answer": "Riksdagen har 349 folkvalda ledamöter. Den beslutar om lagar och statens budget och granskar regeringen.",
      "prompt": "Vilka är riksdagens viktigaste uppgifter?",
      "check": [
        "Besluta om lagar",
        "Besluta om statens budget",
        "Granska regeringen"
      ]
    },
    {
      "id": "c16",
      "cat": 3,
      "term": "Regeringen",
      "answer": "Regeringen styr landet, föreslår lagar och ser till att riksdagens beslut genomförs. Den består av statsministern och övriga statsråd.",
      "prompt": "Vad gör regeringen? Förklara skillnaden mot riksdagen.",
      "check": [
        "Regeringen styr och genomför beslut",
        "Kan föreslå lagar",
        "Riksdagen beslutar om lagar och budget"
      ]
    },
    {
      "id": "c17",
      "cat": 3,
      "term": "Statsminister och statsråd",
      "answer": "Statsministern leder regeringen och utser övriga statsråd, som också kallas ministrar. Ministrarna ansvarar för olika områden.",
      "prompt": "Vad gör statsministern och vad är ett statsråd?",
      "check": [
        "Statsministern leder regeringen",
        "Utser övriga statsråd",
        "Statsråd är ministrar"
      ]
    },
    {
      "id": "c18",
      "cat": 3,
      "term": "Att bilda regering",
      "answer": "Talmannen föreslår en statsminister. Riksdagen röstar. Förslaget godkänns om färre än 175 ledamöter röstar nej. Även en minoritetsregering är möjlig.",
      "prompt": "Måste en regering ha en majoritet som röstar ja? Förklara.",
      "check": [
        "Nej",
        "Godkänns om inte minst 175 röstar nej",
        "En minoritetsregering är möjlig"
      ]
    },
    {
      "id": "c19",
      "cat": 3,
      "term": "Statens budget",
      "answer": "En plan för statens inkomster och utgifter. Regeringen lämnar ett budgetförslag och riksdagen beslutar om budgeten.",
      "prompt": "Vad är statens budget? Vem föreslår och vem beslutar?",
      "check": [
        "Plan för inkomster och utgifter",
        "Regeringen föreslår",
        "Riksdagen beslutar"
      ]
    },
    {
      "id": "c20",
      "cat": 4,
      "term": "Grundlag",
      "answer": "Grundlagar är Sveriges viktigaste lagar. De innehåller regler om hur landet styrs och skyddar demokratin och våra friheter.",
      "prompt": "Vad är en grundlag och varför är grundlagarna viktiga?",
      "check": [
        "Regler om hur landet styrs",
        "Skyddar demokrati och friheter",
        "Svårare att ändra än vanliga lagar"
      ]
    },
    {
      "id": "c21",
      "cat": 4,
      "term": "Ändra en grundlag",
      "answer": "Huvudregeln är två likadana riksdagsbeslut med ett riksdagsval emellan. Väljarna får möjlighet att påverka innan det andra beslutet.",
      "prompt": "Hur ändras en grundlag och varför är det svårare än att ändra en vanlig lag?",
      "check": [
        "Två likadana beslut",
        "Riksdagsval emellan",
        "Väljarna får påverka; skydd mot förhastade ändringar"
      ]
    },
    {
      "id": "c22",
      "cat": 4,
      "term": "Tryckfrihet och yttrandefrihet",
      "answer": "Tryckfrihetsförordningen och yttrandefrihetsgrundlagen är två grundlagar. De skyddar friheten att uttrycka sig i bland annat tryckta medier respektive radio och tv.",
      "prompt": "Nämn två grundlagar från underlaget och förklara vad de skyddar.",
      "check": [
        "Tryckfrihetsförordningen",
        "Yttrandefrihetsgrundlagen",
        "Friheten att uttrycka sig i olika medier"
      ]
    },
    {
      "id": "c23",
      "cat": 4,
      "term": "Statschef",
      "answer": "Statschefen är landets högsta representant. I Sverige är kungen statschef. Han representerar landet men fattar inte politiska beslut.",
      "prompt": "Vad gör Sveriges statschef? Är statschefen samma person som statsministern?",
      "check": [
        "Representerar Sverige",
        "Kungen är statschef, utan politisk makt",
        "Statsministern leder regeringen"
      ]
    },
    {
      "id": "c24",
      "cat": 4,
      "term": "Monarki och republik",
      "answer": "I en monarki är en kung eller drottning statschef och posten går vanligen i arv. I en republik är statschefen vanligen en vald president. Båda kan vara demokratier.",
      "prompt": "Förklara skillnaden mellan monarki och republik. Måste en monarki vara en diktatur?",
      "check": [
        "Kung eller drottning jämfört med president",
        "Arv jämfört med val",
        "Nej, Sverige är en demokratisk monarki"
      ]
    },
    {
      "id": "c25",
      "cat": 5,
      "term": "Kommun",
      "answer": "Kommunen ansvarar för sådant som skola, förskola, bibliotek och avfall. Sverige har 290 kommuner. Tidaholm är en kommun.",
      "prompt": "Ge tre exempel på vad en kommun ansvarar för.",
      "check": [
        "Till exempel skola",
        "Förskola och bibliotek",
        "Avfall/sophantering"
      ]
    },
    {
      "id": "c26",
      "cat": 5,
      "term": "Region",
      "answer": "Regionen ansvarar bland annat för sjukvård och regional kollektivtrafik. Sverige har 21 regioner. Tidaholm ligger i Västra Götalandsregionen.",
      "prompt": "Vad ansvarar en region för och vad heter regionen som Tidaholm ligger i?",
      "check": [
        "Sjukvård",
        "Regional kollektivtrafik",
        "Västra Götalandsregionen"
      ]
    },
    {
      "id": "c27",
      "cat": 5,
      "term": "EU",
      "answer": "EU betyder Europeiska unionen. Det är ett samarbete mellan 27 europeiska länder. Sverige är medlem. Länderna samarbetar bland annat om miljö och handel.",
      "prompt": "Vad är EU? Ge två exempel på frågor som länderna samarbetar om.",
      "check": [
        "Europeiska unionen",
        "Samarbete mellan europeiska länder",
        "Exempel: miljö och handel"
      ]
    },
    {
      "id": "c28",
      "cat": 5,
      "term": "Beslut på olika nivåer",
      "answer": "Skola och bibliotek: kommunen. Sjukvård: regionen. Svenska lagar: riksdagen. Gemensamma frågor mellan EU-länder: EU.",
      "prompt": "Vem ansvarar främst för skolan, sjukvården och Sveriges lagar?",
      "check": [
        "Skola: kommun",
        "Sjukvård: region",
        "Lagar: riksdag"
      ]
    },
    {
      "id": "c29",
      "cat": 5,
      "term": "Påverka tillsammans",
      "answer": "Man kan påverka genom att rösta när man har rösträtt, skriva förslag, kontakta politiker, delta i elevrådet och uttrycka åsikter. Även barn kan påverka.",
      "prompt": "Ge två sätt som du kan påverka samhället innan du har rösträtt.",
      "check": [
        "Till exempel klassråd eller elevråd",
        "Kontakta politiker eller skriva ett förslag",
        "Förklara hur förslaget kan nå den som beslutar"
      ]
    }
  ],
  "quiz": [
    {
      "id": "q0",
      "cat": 0,
      "prompt": "Vad betyder demokrati?",
      "options": [
        "Folkstyre",
        "Ensamstyre",
        "Kungastyre"
      ],
      "correct": 0,
      "answer": "Folket ska kunna påverka hur landet styrs."
    },
    {
      "id": "q1",
      "cat": 0,
      "prompt": "Vad visar att rösträtten är lika?",
      "options": [
        "Rika får fler röster",
        "Alla röster har samma värde",
        "Bara politiker får rösta"
      ],
      "correct": 1,
      "answer": "Ingen persons röst räknas mer än någon annans."
    },
    {
      "id": "q2",
      "cat": 0,
      "prompt": "16 av 30 röstar ja. Ja-sidan är …",
      "options": [
        "en minoritet",
        "exakt hälften",
        "en majoritet"
      ],
      "correct": 2,
      "answer": "Hälften av 30 är 15. 16 är mer än hälften."
    },
    {
      "id": "q3",
      "cat": 1,
      "prompt": "Klassen röstar direkt om en utflykt. Vad är det exempel på?",
      "options": [
        "Direktdemokrati",
        "Diktatur",
        "Representativ demokrati"
      ],
      "correct": 0,
      "answer": "Eleverna röstar själva i själva sakfrågan."
    },
    {
      "id": "q4",
      "cat": 1,
      "prompt": "Valda elever tar klassens frågor till elevrådet. Det liknar …",
      "options": [
        "en folkomröstning",
        "representativ demokrati",
        "monarki"
      ],
      "correct": 1,
      "answer": "Representanter företräder de andra eleverna."
    },
    {
      "id": "q5",
      "cat": 1,
      "prompt": "Vad röstar man om i en folkomröstning?",
      "options": [
        "Vem som är kung",
        "Alla lagar samtidigt",
        "En särskild sakfråga"
      ],
      "correct": 2,
      "answer": "En folkomröstning gäller en sakfråga, exempelvis EU-medlemskap."
    },
    {
      "id": "q6",
      "cat": 2,
      "prompt": "Hur ofta hålls ordinarie riksdagsval?",
      "options": [
        "Varje år",
        "Vart fjärde år",
        "Vart sjätte år"
      ],
      "correct": 1,
      "answer": "Ordinarie val till riksdag, kommun och region hålls vart fjärde år."
    },
    {
      "id": "q7",
      "cat": 2,
      "prompt": "Vilken är huvudregeln för att ett parti ska få platser i riksdagen?",
      "options": [
        "Minst 4 procent i hela landet",
        "Minst 40 procent",
        "Exakt 349 röster"
      ],
      "correct": 0,
      "answer": "Huvudregeln kallas 4-procentsspärren."
    },
    {
      "id": "q8",
      "cat": 2,
      "prompt": "Vad står förkortningen KD för?",
      "options": [
        "Kommunens demokrater",
        "Kulturdemokraterna",
        "Kristdemokraterna"
      ],
      "correct": 2,
      "answer": "KD är förkortningen för Kristdemokraterna."
    },
    {
      "id": "q9",
      "cat": 3,
      "prompt": "Vem beslutar om Sveriges lagar?",
      "options": [
        "Regeringen ensam",
        "Riksdagen",
        "Kungen"
      ],
      "correct": 1,
      "answer": "Regeringen kan föreslå lagar. Riksdagen beslutar."
    },
    {
      "id": "q10",
      "cat": 3,
      "prompt": "Hur många ledamöter har riksdagen?",
      "options": [
        "349",
        "290",
        "21"
      ],
      "correct": 0,
      "answer": "Riksdagen har 349 folkvalda ledamöter."
    },
    {
      "id": "q11",
      "cat": 3,
      "prompt": "Vem leder regeringen?",
      "options": [
        "Statschefen",
        "Talmannen",
        "Statsministern"
      ],
      "correct": 2,
      "answer": "Statsministern leder regeringen och utser övriga statsråd."
    },
    {
      "id": "q12",
      "cat": 4,
      "prompt": "Vad krävs enligt huvudregeln för att ändra en grundlag?",
      "options": [
        "Kungens underskrift räcker",
        "Två likadana beslut med riksdagsval emellan",
        "Ett klassråd"
      ],
      "correct": 1,
      "answer": "Valet mellan besluten ger väljarna möjlighet att påverka."
    },
    {
      "id": "q13",
      "cat": 4,
      "prompt": "Vilken roll har kungen i Sverige?",
      "options": [
        "Statschef utan politisk makt",
        "Chef för regeringen",
        "Beslutar om alla lagar"
      ],
      "correct": 0,
      "answer": "Kungen representerar landet; statsministern leder regeringen."
    },
    {
      "id": "q14",
      "cat": 4,
      "prompt": "Vad är en republik?",
      "options": [
        "Ett land utan lagar",
        "Ett land som alltid är demokratiskt",
        "Ett land som vanligen har en vald president som statschef"
      ],
      "correct": 2,
      "answer": "Republik beskriver statschefsformen, inte automatiskt hur demokratiskt landet är."
    },
    {
      "id": "q15",
      "cat": 5,
      "prompt": "Vem ansvarar främst för sjukvården?",
      "options": [
        "Kommunen",
        "Regionen",
        "Elevrådet"
      ],
      "correct": 1,
      "answer": "Regionen ansvarar bland annat för sjukvård."
    },
    {
      "id": "q16",
      "cat": 5,
      "prompt": "Vem ansvarar för kommunens bibliotek?",
      "options": [
        "Kommunen",
        "EU",
        "Regeringen"
      ],
      "correct": 0,
      "answer": "Bibliotek är ett exempel på kommunal verksamhet."
    },
    {
      "id": "q17",
      "cat": 5,
      "prompt": "Vad står EU för?",
      "options": [
        "Europas utbildning",
        "Enade universiteten",
        "Europeiska unionen"
      ],
      "correct": 2,
      "answer": "EU är ett samarbete mellan europeiska länder."
    }
  ]
};
