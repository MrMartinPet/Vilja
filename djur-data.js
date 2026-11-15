/* Biologi – djur. Frågor och svar bygger på lärarens repetitionshäfte. */
const DJUR = {
  "version": 1,
  "topics": [
    {
      "id": "miljo",
      "icon": "🌍",
      "title": "Djur finns nästan överallt",
      "tag": "Miljö & anpassning",
      "intro": "Djur lever i havsdjup, öknar, snöiga berg och regnskogar. De har under lång tid utvecklat egenskaper som hjälper dem att överleva.",
      "facts": [
        "Olika miljöer har olika utmaningar: kyla, värme, brist på vatten, mat och farliga rovdjur.",
        "En anpassning är en egenskap som gör det lättare att överleva och få ungar i en viss miljö.",
        "Försök alltid förklara både VILKEN egenskap djuret har och VARFÖR den hjälper."
      ],
      "remember": "Anpassning = egenskap + nytta i miljön",
      "example": "En isbjörns ljusa päls hjälper den att smälta in i snö och is."
    },
    {
      "id": "utseende",
      "icon": "🦎",
      "title": "Kamouflage & varningsfärger",
      "tag": "Utseende",
      "intro": "Djurens färger och kroppsformer hjälper dem att hitta mat och slippa bli uppätna.",
      "facts": [
        "Kamouflage innebär att djuret smälter in i omgivningen. Det kan gömma sig för rovdjur eller smyga på byten.",
        "Varningsfärger är ofta tydliga och starka färger som signalerar att ett djur kan vara farligt eller giftigt.",
        "Giraffens långa hals gör att den kan nå blad högt upp i träden."
      ],
      "remember": "Kamouflage = synas mindre. Varningsfärger = synas och varna.",
      "example": "En kameleont kan ändra färg; en del giftiga djur visar starka varningsfärger."
    },
    {
      "id": "grupper",
      "icon": "🦋",
      "title": "Djurens släktträd",
      "tag": "Ryggrad & skelett",
      "intro": "Djur delas i två huvudgrupper: ryggradslösa och ryggradsdjur.",
      "facts": [
        "Ungefär 95 % av alla djurarter är ryggradslösa, till exempel insekter, spindlar, kräftdjur, maskar, snäckor, svampdjur och maneter.",
        "Insekter är leddjur. De har ett yttre skelett som skyddar kroppen.",
        "Ryggradsdjur har ryggrad och ett inre skelett. Fem grupper är fiskar, groddjur, kräldjur, fåglar och däggdjur.",
        "De första ryggradsdjuren utvecklades i vattnet."
      ],
      "remember": "Ryggradslösa ≈ 95 %. Ryggradsdjur = fem grupper.",
      "example": "Myran har yttre skelett. Råttan har ryggrad och inre skelett."
    },
    {
      "id": "energi",
      "icon": "🌱",
      "title": "Energi & kroppens organ",
      "tag": "Fotosyntes & andning",
      "intro": "Växter och djur behöver energi, men skaffar den på olika sätt.",
      "facts": [
        "Växter tillverkar energirik näring genom fotosyntes med hjälp av solljus, koldioxid och vatten. Då bildas också syre.",
        "Djur måste äta växter eller andra djur. Vid cellandningen används syre för att frigöra energi ur maten; koldioxid och vatten bildas.",
        "Insekter som myror andas med trakéer, små luftrör som har öppningar på kroppens utsida. Antennerna känner av omgivningen.",
        "Däggdjur som råttor har lungor, inre skelett, hjärna och nervsystem samt ett hjärta med fyra rum."
      ],
      "remember": "Växt: fotosyntes. Djur: äta, andas och frigöra energi.",
      "example": "En myra har inte lungor som en råtta: myran har trakéer."
    },
    {
      "id": "livscykel",
      "icon": "🐛",
      "title": "Befruktning & livscykler",
      "tag": "Fortplantning",
      "intro": "Djur får nya ungar på olika sätt. Hos insekter kan kroppen förändras mycket under uppväxten.",
      "facts": [
        "Vid yttre befruktning möts ägg och spermier utanför honans kropp, vanligt hos många fiskar och groddjur.",
        "Vid inre befruktning möts ägg och spermie inne i honans kropp, vanligt hos däggdjur, fåglar och kräldjur.",
        "Fullständig förvandling: ägg → larv → puppa → vuxen. Exempel: fjäril.",
        "Ofullständig förvandling: ägg → nymf → vuxen. Nymfen liknar den vuxna men växer och ömsar hud; det finns ingen puppa. Exempel: gräshoppa."
      ],
      "remember": "Fullständig = larv + puppa. Ofullständig = nymf, ingen puppa.",
      "example": "Fjäril: ägg → larv → puppa → vuxen fjäril."
    },
    {
      "id": "daggdjur",
      "icon": "🐈",
      "title": "Däggdjur & kattdjur",
      "tag": "Varmblodiga djur",
      "intro": "Däggdjur lever på land, i hav och i luften – från små näbbmöss till blåvalar.",
      "facts": [
        "Däggdjur är jämnvarma, andas luft med lungor och har oftast päls eller hår.",
        "Honorna har mjölkkörtlar och diar sina ungar. Nästan alla föder levande ungar, men till exempel näbbdjur lägger ägg.",
        "Människor, valar, fladdermöss och katter är däggdjur.",
        "Kattdjur är smygjägare. De har bra mörkersyn, hörsel och luktsinne, vassa tänder för kött och mjuka tassar som gör stegen tysta."
      ],
      "remember": "Däggdjur diar ungar. Kattdjur är anpassade för smygjakt.",
      "example": "En blåval lever i havet men är däggdjur och andas med lungor."
    },
    {
      "id": "faglar",
      "icon": "🦉",
      "title": "Fåglarnas smarta kroppar",
      "tag": "Flygning & vinter",
      "intro": "Fåglarnas skelett, fjädrar, näbbar och fötter passar deras sätt att leva.",
      "facts": [
        "Många fåglar har lätta, delvis luftfyllda ben som underlättar flygning.",
        "Fjädrar hjälper fåglar att flyga och styra samt skyddar mot kyla, vind och vatten.",
        "Näbbar och fötter har olika form beroende på föda och livsmiljö.",
        "Flyttfåglar flyttar när mat kan bli svår att hitta under vintern. Stannfåglar stannar kvar året runt."
      ],
      "remember": "Lätta ben + fjädrar = flygning; näbb & fötter = föda och miljö.",
      "example": "En rovfågels böjda näbb är användbar för att slita kött."
    },
    {
      "id": "sinnen",
      "icon": "🦇",
      "title": "Djurens supersinnen",
      "tag": "Syn, hörsel & känsel",
      "intro": "Djur kan uppfatta sådant som vi människor inte alltid kan se eller höra.",
      "facts": [
        "Rovfåglar har mycket skarp syn. Vissa fåglar uppfattar ultraviolett ljus.",
        "Ugglor ser mycket bra i svagt ljus tack vare ljuskänsliga ögon, men inte i totalt mörker.",
        "Fladdermöss kan använda ultraljud och ekon för att hitta insekter. Hundar kan också höra mycket höga toner.",
        "Ormar saknar yttre öron, men känner vibrationer i marken.",
        "Hajar kan känna svaga elektriska signaler från andra djur."
      ],
      "remember": "Uggla = svagt ljus. Fladdermus = ultraljud. Orm = vibrationer. Haj = elektricitet.",
      "example": "Hajen hittar ett bytesdjur genom att uppfatta svaga elektriska signaler."
    },
    {
      "id": "fiskar",
      "icon": "🐟",
      "title": "Fiskarnas liv under ytan",
      "tag": "Gälar, fjäll & lek",
      "intro": "Fiskar är växelvarma ryggradsdjur som lever i vatten och har flera speciella anpassningar.",
      "facts": [
        "Fiskar tar upp syre ur vattnet med gälar.",
        "Många benfiskar har en simblåsa som hjälper dem att hålla sig på olika djup utan att ständigt simma.",
        "Många fiskar har slem och fjäll som skyddar kroppen. Årsringar på fjällen kan användas för att uppskatta åldern.",
        "När fiskar fortplantar sig kallas det lek. Honan lägger rom (ägg); hos många arter befruktar hanen rommen med mjölke i vattnet."
      ],
      "remember": "Gälar = andning. Simblåsa = djup. Fjäll = uppskatta ålder. Lek = fortplantning.",
      "example": "En abborre kan använda simblåsan för att hålla sig på ett visst djup."
    }
  ],
  "terms": [
    {
      "id": "t0",
      "topic": "miljo",
      "term": "Anpassning",
      "definition": "En egenskap som hjälper ett djur att överleva i en viss miljö."
    },
    {
      "id": "t1",
      "topic": "utseende",
      "term": "Kamouflage",
      "definition": "Färger eller former som gör att ett djur smälter in i omgivningen."
    },
    {
      "id": "t2",
      "topic": "utseende",
      "term": "Varningsfärger",
      "definition": "Tydliga färger som signalerar att djuret kan vara giftigt eller farligt."
    },
    {
      "id": "t3",
      "topic": "grupper",
      "term": "Ryggradslösa djur",
      "definition": "Djur utan ryggrad; cirka 95 % av alla djurarter."
    },
    {
      "id": "t4",
      "topic": "grupper",
      "term": "Ryggradsdjur",
      "definition": "Djur med ryggrad och inre skelett."
    },
    {
      "id": "t5",
      "topic": "grupper",
      "term": "Yttre skelett",
      "definition": "Hårt skydd på kroppens utsida, som hos insekter."
    },
    {
      "id": "t6",
      "topic": "energi",
      "term": "Fotosyntes",
      "definition": "Växter gör energirik näring av vatten och koldioxid med hjälp av solljus."
    },
    {
      "id": "t7",
      "topic": "energi",
      "term": "Cellandning",
      "definition": "Syre används för att frigöra energi ur maten."
    },
    {
      "id": "t8",
      "topic": "energi",
      "term": "Trakéer",
      "definition": "Små luftrör som insekter andas genom."
    },
    {
      "id": "t9",
      "topic": "energi",
      "term": "Antenner",
      "definition": "Känselspröt som insekter använder för att uppfatta omgivningen."
    },
    {
      "id": "t10",
      "topic": "livscykel",
      "term": "Yttre befruktning",
      "definition": "Ägg och spermier möts utanför honans kropp, ofta i vatten."
    },
    {
      "id": "t11",
      "topic": "livscykel",
      "term": "Inre befruktning",
      "definition": "Ägg och spermie möts inne i honans kropp."
    },
    {
      "id": "t12",
      "topic": "livscykel",
      "term": "Fullständig förvandling",
      "definition": "Ägg → larv → puppa → vuxen insekt."
    },
    {
      "id": "t13",
      "topic": "livscykel",
      "term": "Ofullständig förvandling",
      "definition": "Ägg → nymf → vuxen insekt; inget puppstadium."
    },
    {
      "id": "t14",
      "topic": "livscykel",
      "term": "Nymf",
      "definition": "Ung insekt som liknar en liten vuxen och växer genom att ömsa hud."
    },
    {
      "id": "t15",
      "topic": "livscykel",
      "term": "Puppa",
      "definition": "Stadium mellan larv och vuxen vid fullständig förvandling."
    },
    {
      "id": "t16",
      "topic": "daggdjur",
      "term": "Däggdjur",
      "definition": "Jämnvarma ryggradsdjur där honorna har mjölk som ungarna diar."
    },
    {
      "id": "t17",
      "topic": "daggdjur",
      "term": "Jämnvarm",
      "definition": "Har en relativt jämn kroppstemperatur oavsett omgivningens temperatur."
    },
    {
      "id": "t18",
      "topic": "daggdjur",
      "term": "Smygjägare",
      "definition": "Djur som smyger nära bytet innan de attackerar."
    },
    {
      "id": "t19",
      "topic": "faglar",
      "term": "Flyttfågel",
      "definition": "Fågel som flyttar till andra områden under en del av året."
    },
    {
      "id": "t20",
      "topic": "faglar",
      "term": "Stannfågel",
      "definition": "Fågel som stannar kvar i samma område även på vintern."
    },
    {
      "id": "t21",
      "topic": "sinnen",
      "term": "Ultraljud",
      "definition": "Ljud med så hög frekvens att vi människor inte kan höra det."
    },
    {
      "id": "t22",
      "topic": "sinnen",
      "term": "Vibration",
      "definition": "En liten skakning som till exempel kan kännas genom marken."
    },
    {
      "id": "t23",
      "topic": "fiskar",
      "term": "Gälar",
      "definition": "Organ där fiskar tar upp syre ur vattnet."
    },
    {
      "id": "t24",
      "topic": "fiskar",
      "term": "Simblåsa",
      "definition": "Gasfylld blåsa som hjälper många benfiskar att hålla rätt djup."
    },
    {
      "id": "t25",
      "topic": "fiskar",
      "term": "Rom",
      "definition": "Fiskägg."
    },
    {
      "id": "t26",
      "topic": "fiskar",
      "term": "Mjölke",
      "definition": "Vätska med spermier från fiskhanen som kan befrukta rom."
    },
    {
      "id": "t27",
      "topic": "fiskar",
      "term": "Lek",
      "definition": "Det som fiskarnas fortplantning kallas."
    }
  ],
  "quiz": [
    {
      "id": "q0",
      "topic": "grupper",
      "question": "Vilken andel av alla djurarter på jorden utgörs av ryggradslösa djur?",
      "options": [
        "Ungefär 50 %",
        "Ungefär 75 %",
        "Ungefär 95 %"
      ],
      "correct": 2,
      "why": "Ungefär 95 % av alla djurarter saknar ryggrad.",
      "teacher": true
    },
    {
      "id": "q1",
      "topic": "energi",
      "question": "Hur skiljer sig växters och djurs sätt att få energi åt?",
      "options": [
        "Växter gör sin egen näring genom fotosyntes; djur måste äta organismer.",
        "Båda tillverkar sin egen mat, men djur använder syre.",
        "Djur använder solljus som mat medan växter äter organismer."
      ],
      "correct": 0,
      "why": "Växter använder fotosyntes. Djur behöver föda.",
      "teacher": true
    },
    {
      "id": "q2",
      "topic": "livscykel",
      "question": "Vilken typ av befruktning är vanligast hos däggdjur, fåglar och kräldjur?",
      "options": [
        "Yttre befruktning",
        "Inre befruktning",
        "Delningsbefruktning"
      ],
      "correct": 1,
      "why": "Hos dessa djur sker befruktningen vanligtvis inuti honans kropp.",
      "teacher": true
    },
    {
      "id": "q3",
      "topic": "livscykel",
      "question": "Vad skiljer ofullständig från fullständig förvandling?",
      "options": [
        "Vid ofullständig liknar nymfen den vuxna; fullständig har ägg, larv, puppa och vuxen.",
        "Vid fullständig hoppar insekten över puppan.",
        "Det finns ingen skillnad."
      ],
      "correct": 0,
      "why": "Gräshoppan har nymf och ingen puppa. Fjärilen har larv och puppa.",
      "teacher": true
    },
    {
      "id": "q4",
      "topic": "energi",
      "question": "Hur andas insekter, till exempel myror?",
      "options": [
        "Med lungor i bröstkorgen",
        "Endast genom huden",
        "Med små luftrör som kallas trakéer"
      ],
      "correct": 2,
      "why": "Insekter har trakéer som leder luft genom kroppen.",
      "teacher": true
    },
    {
      "id": "q5",
      "topic": "sinnen",
      "question": "Vilken särskild sinnesförmåga har ormar enligt texten?",
      "options": [
        "De hör ultraljud med yttre öron.",
        "De saknar yttre öron men känner vibrationer i marken.",
        "De har ett extra lager som gör att de kan se i totalt mörker."
      ],
      "correct": 1,
      "why": "Ormar uppfattar vibrationer genom kroppen.",
      "teacher": true
    },
    {
      "id": "q6",
      "topic": "miljo",
      "question": "Varför lever djur i så olika miljöer?",
      "options": [
        "Alla djur har exakt samma egenskaper.",
        "De har anpassningar som hjälper dem i sin miljö.",
        "Djur behöver varken föda eller vatten."
      ],
      "correct": 1,
      "why": "Anpassningar hjälper dem att klara exempelvis kyla och rovdjur.",
      "teacher": false
    },
    {
      "id": "q7",
      "topic": "utseende",
      "question": "Vad hjälper kamouflage ett djur med?",
      "options": [
        "Att synas extra tydligt",
        "Att smälta in i sin miljö",
        "Att hålla kroppstemperaturen exakt"
      ],
      "correct": 1,
      "why": "Det kan skydda från fiender eller hjälpa vid jakt.",
      "teacher": false
    },
    {
      "id": "q8",
      "topic": "utseende",
      "question": "Varför har vissa djur starka varningsfärger?",
      "options": [
        "För att skrämma bort andra genom att visa att de kan vara giftiga eller farliga",
        "För att kamouflera sig i snö",
        "För att göra fotosyntes"
      ],
      "correct": 0,
      "why": "Varningsfärger signalerar att det kan vara farligt att äta djuret.",
      "teacher": false
    },
    {
      "id": "q9",
      "topic": "utseende",
      "question": "Hur hjälper giraffens långa hals?",
      "options": [
        "Den kan gräva djupare",
        "Den kan nå blad högt i träd",
        "Den kan simma snabbare"
      ],
      "correct": 1,
      "why": "Lång hals ger tillgång till blad högt upp.",
      "teacher": false
    },
    {
      "id": "q10",
      "topic": "grupper",
      "question": "Vilka fem grupper är ryggradsdjur?",
      "options": [
        "Fiskar, groddjur, kräldjur, fåglar och däggdjur",
        "Maskar, maneter, snäckor, flugor och krabbor",
        "Insekter, blötdjur, maskar, fåglar och svampar"
      ],
      "correct": 0,
      "why": "De fem ryggradsdjursgrupperna har alla ryggrad.",
      "teacher": false
    },
    {
      "id": "q11",
      "topic": "grupper",
      "question": "Var sitter insektens skelett?",
      "options": [
        "Inuti ryggraden",
        "På kroppens utsida",
        "Inuti lungorna"
      ],
      "correct": 1,
      "why": "Insekter har ett hårt yttre skelett.",
      "teacher": false
    },
    {
      "id": "q12",
      "topic": "energi",
      "question": "Vad bildas vid fotosyntes?",
      "options": [
        "Syre och energirik näring",
        "Bara koldioxid",
        "Fjädrar och fjäll"
      ],
      "correct": 0,
      "why": "Solljus, vatten och koldioxid används för att tillverka näring; syre frigörs.",
      "teacher": false
    },
    {
      "id": "q13",
      "topic": "energi",
      "question": "Vad använder myran antennerna till?",
      "options": [
        "Att simma",
        "Att känna av omgivningen",
        "Att flyga"
      ],
      "correct": 1,
      "why": "Antenner är insekters sinnesorgan.",
      "teacher": false
    },
    {
      "id": "q14",
      "topic": "energi",
      "question": "Vad har råttan som myran saknar?",
      "options": [
        "Yttre skelett",
        "Trakéer",
        "Lungor och ryggrad"
      ],
      "correct": 2,
      "why": "Råttan är ett däggdjur med lungor och ryggrad.",
      "teacher": false
    },
    {
      "id": "q15",
      "topic": "livscykel",
      "question": "Vilken ordning har en fjärils fullständiga förvandling?",
      "options": [
        "Ägg → puppa → nymf → vuxen",
        "Ägg → larv → puppa → vuxen",
        "Ägg → nymf → vuxen"
      ],
      "correct": 1,
      "why": "Fjärilen har både larv- och puppstadium.",
      "teacher": false
    },
    {
      "id": "q16",
      "topic": "livscykel",
      "question": "Vad är en nymf?",
      "options": [
        "En ung insekt som liknar den vuxna",
        "En fiskunge",
        "Samma sak som puppa"
      ],
      "correct": 0,
      "why": "En nymf liknar den vuxna insekten och ömsar hud när den växer.",
      "teacher": false
    },
    {
      "id": "q17",
      "topic": "daggdjur",
      "question": "Vad är särskilt typiskt för däggdjur?",
      "options": [
        "De andas med gälar",
        "Honorna diar sina ungar med mjölk",
        "Alla däggdjur lägger ägg"
      ],
      "correct": 1,
      "why": "Att dia ungar med mjölk är ett viktigt kännetecken.",
      "teacher": false
    },
    {
      "id": "q18",
      "topic": "daggdjur",
      "question": "Vilket av dessa är ett däggdjur?",
      "options": [
        "Blåval",
        "Haj",
        "Manet"
      ],
      "correct": 0,
      "why": "Blåvalen andas luft med lungor och ger mjölk till sin unge.",
      "teacher": false
    },
    {
      "id": "q19",
      "topic": "daggdjur",
      "question": "Hur hjälper kattdjurets mjuka tassar?",
      "options": [
        "Det kan smyga tyst",
        "Det kan tillverka solljus",
        "Det kan känna elektriska signaler"
      ],
      "correct": 0,
      "why": "Tysta steg gör det lättare att komma nära bytet.",
      "teacher": false
    },
    {
      "id": "q20",
      "topic": "faglar",
      "question": "Varför har många fåglar lätta, luftfyllda ben?",
      "options": [
        "Det underlättar flygning",
        "Det hjälper dem att andas med gälar",
        "Det gör att de aldrig fryser"
      ],
      "correct": 0,
      "why": "Ett lätt skelett hjälper vid flygningen.",
      "teacher": false
    },
    {
      "id": "q21",
      "topic": "faglar",
      "question": "Vilket påstående om fjädrar är rätt?",
      "options": [
        "De används bara till att se fina ut",
        "De hjälper både vid flygning och som skydd mot kyla",
        "De gör att alla fåglar måste flytta"
      ],
      "correct": 1,
      "why": "Fjädrar är viktiga för flygning, styrning och skydd.",
      "teacher": false
    },
    {
      "id": "q22",
      "topic": "faglar",
      "question": "Varför flyttar många fåglar till varmare områden?",
      "options": [
        "För att maten blir svårare att hitta under vintern",
        "För att deras ryggar slutar fungera",
        "För att deras näbbar blir för korta"
      ],
      "correct": 0,
      "why": "Brist på mat är en viktig orsak till flyttning.",
      "teacher": false
    },
    {
      "id": "q23",
      "topic": "sinnen",
      "question": "Vilket sinne använder fladdermöss för att hitta byten i mörker?",
      "options": [
        "Ultraljud och ekon",
        "Simblåsa",
        "Fotosyntes"
      ],
      "correct": 0,
      "why": "De sänder ut ljud och tolkar ekona.",
      "teacher": false
    },
    {
      "id": "q24",
      "topic": "sinnen",
      "question": "Vad kan hajar uppfatta från andra djur?",
      "options": [
        "Bara färger",
        "Svaga elektriska signaler",
        "Årsringar i fjäll"
      ],
      "correct": 1,
      "why": "Hajar kan känna svaga elektriska signaler.",
      "teacher": false
    },
    {
      "id": "q25",
      "topic": "fiskar",
      "question": "Vad använder fiskar för att ta upp syre från vattnet?",
      "options": [
        "Lungor",
        "Gälar",
        "Antenner"
      ],
      "correct": 1,
      "why": "Gälar tar upp löst syre ur vattnet.",
      "teacher": false
    },
    {
      "id": "q26",
      "topic": "fiskar",
      "question": "Vad hjälper simblåsan många fiskar med?",
      "options": [
        "Att sväva på ett visst djup",
        "Att ha ungar på land",
        "Att höra ultraljud"
      ],
      "correct": 0,
      "why": "Genom gasmängden kan fisken reglera sin flytförmåga.",
      "teacher": false
    },
    {
      "id": "q27",
      "topic": "fiskar",
      "question": "Hur kan man uppskatta en fisks ålder?",
      "options": [
        "Genom att räkna årsringar på fjällen",
        "Genom att titta på fenans färg",
        "Genom att lyssna på fiskens läten"
      ],
      "correct": 0,
      "why": "Årsringar i fjällen kan visa hur gammal fisken är.",
      "teacher": false
    },
    {
      "id": "q28",
      "topic": "fiskar",
      "question": "Vad kallas fiskarnas fortplantning?",
      "options": [
        "Puppa",
        "Lek",
        "Kamouflage"
      ],
      "correct": 1,
      "why": "Vid lek lägger honan ofta rom som befruktas i vattnet.",
      "teacher": false
    },
    {
      "id": "q29",
      "topic": "fiskar",
      "question": "Vad kallas fiskägg och hanens spermievätska?",
      "options": [
        "Rom och mjölke",
        "Larv och puppa",
        "Fjäll och gälar"
      ],
      "correct": 0,
      "why": "Rom är fiskägg och mjölke innehåller spermier.",
      "teacher": false
    }
  ],
  "trueFalse": [
    {
      "id": "s0",
      "topic": "miljo",
      "text": "Djur finns bara på land.",
      "correct": false,
      "why": "Djur finns även djupt i haven och i luften."
    },
    {
      "id": "s1",
      "topic": "miljo",
      "text": "Anpassningar kan hjälpa djur att överleva i kyla eller hetta.",
      "correct": true,
      "why": "Egenskaper utvecklas under lång tid."
    },
    {
      "id": "s2",
      "topic": "utseende",
      "text": "Kamouflage kan hjälpa ett rovdjur att smyga på sitt byte.",
      "correct": true,
      "why": "Det är inte bara bytesdjur som har nytta av kamouflage."
    },
    {
      "id": "s3",
      "topic": "utseende",
      "text": "Varningsfärger gör att djur alltid smälter in i naturen.",
      "correct": false,
      "why": "Varningsfärger är ofta tydliga och ska märkas."
    },
    {
      "id": "s4",
      "topic": "grupper",
      "text": "Ungefär 95 procent av alla djurarter är ryggradslösa.",
      "correct": true,
      "why": "De flesta djurarter saknar ryggrad."
    },
    {
      "id": "s5",
      "topic": "grupper",
      "text": "Spindlar räknas till ryggradsdjuren.",
      "correct": false,
      "why": "Spindlar är ryggradslösa leddjur."
    },
    {
      "id": "s6",
      "topic": "grupper",
      "text": "De första ryggradsdjuren utvecklades i vatten.",
      "correct": true,
      "why": "Ryggradsdjur har sitt ursprung i vattnet."
    },
    {
      "id": "s7",
      "topic": "energi",
      "text": "Växter använder solljus för att tillverka näring.",
      "correct": true,
      "why": "Det sker genom fotosyntes."
    },
    {
      "id": "s8",
      "topic": "energi",
      "text": "Djur kan skapa sin egen mat av solljus precis som växter.",
      "correct": false,
      "why": "Djur måste äta andra organismer."
    },
    {
      "id": "s9",
      "topic": "energi",
      "text": "En myra andas med lungor som en råtta.",
      "correct": false,
      "why": "Myran har trakéer; råttan har lungor."
    },
    {
      "id": "s10",
      "topic": "energi",
      "text": "En råttas hjärta har fyra rum.",
      "correct": true,
      "why": "Däggdjur har ett hjärta med fyra rum."
    },
    {
      "id": "s11",
      "topic": "livscykel",
      "text": "Vid yttre befruktning möts ägg och spermier oftast i vatten.",
      "correct": true,
      "why": "Det är vanligt hos många fiskar och groddjur."
    },
    {
      "id": "s12",
      "topic": "livscykel",
      "text": "En fjäril går från ägg till larv till puppa till vuxen.",
      "correct": true,
      "why": "Det är fullständig förvandling."
    },
    {
      "id": "s13",
      "topic": "livscykel",
      "text": "En gräshoppa måste bli puppa innan den blir vuxen.",
      "correct": false,
      "why": "Gräshoppor har ofullständig förvandling utan puppa."
    },
    {
      "id": "s14",
      "topic": "daggdjur",
      "text": "Människan och blåvalen är däggdjur.",
      "correct": true,
      "why": "Båda diar sina ungar och andas med lungor."
    },
    {
      "id": "s15",
      "topic": "daggdjur",
      "text": "Alla däggdjur lägger ägg.",
      "correct": false,
      "why": "De flesta föder levande ungar; näbbdjuret är ett undantag."
    },
    {
      "id": "s16",
      "topic": "daggdjur",
      "text": "Kattdjur använder vassa tänder när de äter kött.",
      "correct": true,
      "why": "Tänderna är anpassade för att slita kött."
    },
    {
      "id": "s17",
      "topic": "faglar",
      "text": "Fjädrar kan hjälpa fåglar att hålla värmen.",
      "correct": true,
      "why": "Fjädrarna skyddar mot kyla och vind."
    },
    {
      "id": "s18",
      "topic": "faglar",
      "text": "Alla fåglar flyttar från Sverige varje vinter.",
      "correct": false,
      "why": "Stannfåglar finns kvar året om."
    },
    {
      "id": "s19",
      "topic": "faglar",
      "text": "En fågels näbbform kan berätta vad den äter.",
      "correct": true,
      "why": "Näbb och fötter är anpassade till föda och miljö."
    },
    {
      "id": "s20",
      "topic": "sinnen",
      "text": "Ugglor kan se perfekt i totalt mörker.",
      "correct": false,
      "why": "De ser mycket bra i svagt ljus, men behöver ljus för att se."
    },
    {
      "id": "s21",
      "topic": "sinnen",
      "text": "Fladdermöss kan använda ultraljud för att hitta byten.",
      "correct": true,
      "why": "De tolkar ekon från ljuden."
    },
    {
      "id": "s22",
      "topic": "sinnen",
      "text": "Ormar kan känna vibrationer i marken.",
      "correct": true,
      "why": "De saknar yttre öron men kan uppfatta vibrationer."
    },
    {
      "id": "s23",
      "topic": "sinnen",
      "text": "Hajar kan känna svaga elektriska signaler.",
      "correct": true,
      "why": "Det hjälper dem att upptäcka djur."
    },
    {
      "id": "s24",
      "topic": "fiskar",
      "text": "Fiskar tar upp syre ur vattnet med gälar.",
      "correct": true,
      "why": "Gälar hjälper fiskar att andas under vatten."
    },
    {
      "id": "s25",
      "topic": "fiskar",
      "text": "Alla fiskar har simblåsa.",
      "correct": false,
      "why": "Många benfiskar har det, men till exempel hajar saknar simblåsa."
    },
    {
      "id": "s26",
      "topic": "fiskar",
      "text": "Man kan ibland uppskatta fiskars ålder genom årsringar på fjällen.",
      "correct": true,
      "why": "Ringarna kan spegla fiskens ålder."
    },
    {
      "id": "s27",
      "topic": "fiskar",
      "text": "Rom är fiskhanens spermievätska.",
      "correct": false,
      "why": "Rom är ägg; mjölke innehåller spermier."
    }
  ],
  "open": [
    {
      "id": "o0",
      "topic": "faglar",
      "question": "Beskriv fåglarnas anpassningar. Hur är skelettet och fjädrarna anpassade för ett liv i luften, och hur hjälper de vid flygningen?",
      "check": [
        "Lätt skelett med delvis luftfyllda ben",
        "Fjädrar hjälper att flyga och styra",
        "Fjädrar skyddar också mot kyla, vind och vatten"
      ],
      "model": "Många fåglar har lätta ben med luftfyllda hålrum, så att kroppen inte blir för tung att flyga med. Fjädrarna gör att fågeln kan få lyftkraft och styra i luften. De skyddar också mot kyla, vind och vatten.",
      "teacher": true
    },
    {
      "id": "o1",
      "topic": "utseende",
      "question": "Jämför kamouflage med varningsfärger. Vad är skillnaden? Ge exempel och förklara hur de hjälper djuret.",
      "check": [
        "Kamouflage gör djuret mindre synligt",
        "Varningsfärger syns tydligt och varnar",
        "Ge exempel och förklara nyttan för djuret"
      ],
      "model": "Kamouflage gör att djuret smälter in, som en isbjörn i snön. Det kan gömma sig eller komma nära ett byte. Varningsfärger är tvärtom starka färger som berättar för andra djur att djuret kan vara giftigt eller farligt, så att det inte attackeras.",
      "teacher": true
    },
    {
      "id": "o2",
      "topic": "fiskar",
      "question": "Förklara hur man kan ta reda på en fisks ålder och hur simblåsan hjälper en fisk att röra sig uppåt och nedåt i vattnet.",
      "check": [
        "Årsringar på fjällen kan visa ålder",
        "Simblåsan innehåller gas",
        "Gasvolymen påverkar flytförmågan och vilket djup fisken kan hålla"
      ],
      "model": "Man kan uppskatta fiskens ålder genom att räkna årsringar på fjällen. Många benfiskar har en gasfylld simblåsa. Genom att förändra gasmängden kan fisken ändra sin flytförmåga och lättare hålla sig på ett visst djup.",
      "teacher": true
    },
    {
      "id": "o3",
      "topic": "daggdjur",
      "question": "Jämför kattdjur och insekter. Hur skiljer sig skelett, andning och sinnen åt?",
      "check": [
        "Kattdjur har inre skelett med ryggrad; insekter har yttre skelett",
        "Kattdjur andas med lungor; insekter med trakéer",
        "Kattdjur använder syn, hörsel och lukt; insekter bland annat antenner"
      ],
      "model": "Kattdjur är däggdjur med ryggrad och ett inre skelett, medan insekter saknar ryggrad och har ett yttre skelett. Kattdjur andas med lungor men insekter med trakéer. Kattdjur har bra mörkersyn, hörsel och luktsinne för jakt, medan insekter bland annat använder antenner för att känna av omgivningen.",
      "teacher": true
    },
    {
      "id": "o4",
      "topic": "grupper",
      "question": "Vilken skillnad är det mellan ryggradslösa djur och ryggradsdjur? Nämn minst tre djur i varje grupp.",
      "check": [
        "Skillnaden är om de har ryggrad eller inte",
        "Tre ryggradslösa exempel",
        "Tre ryggradsdjursexempel"
      ],
      "model": "Ryggradslösa har ingen ryggrad, till exempel myra, spindel och snigel. Ryggradsdjur har ryggrad och inre skelett, till exempel fisk, groda och katt.",
      "teacher": false
    },
    {
      "id": "o5",
      "topic": "energi",
      "question": "Förklara varför växter behöver solljus och varför djur måste äta. Använd orden fotosyntes och syre.",
      "check": [
        "Växter gör näring genom fotosyntes med solljus",
        "Djur äter för att få energirik mat",
        "Djur använder syre vid cellandningen"
      ],
      "model": "Växter använder solljus, vatten och koldioxid för att tillverka näring genom fotosyntes och släpper ut syre. Djur kan inte göra detta, utan måste äta växter eller djur. Djur använder syre när de frigör energi ur maten.",
      "teacher": false
    },
    {
      "id": "o6",
      "topic": "livscykel",
      "question": "Jämför fullständig och ofullständig förvandling med en fjäril och en gräshoppa.",
      "check": [
        "Fjäril: ägg, larv, puppa, vuxen",
        "Gräshoppa: ägg, nymf, vuxen",
        "Förklara att nymfen liknar den vuxna och saknar puppstadium"
      ],
      "model": "Fjärilen har fullständig förvandling: ägg, larv, puppa, vuxen. Gräshoppan har ofullständig förvandling: ägg, nymf, vuxen. Nymfen liknar en liten vuxen insekt och växer genom att ömsa hud. Gräshoppan blir aldrig puppa.",
      "teacher": false
    },
    {
      "id": "o7",
      "topic": "livscykel",
      "question": "Vad är skillnaden mellan inre och yttre befruktning? Ge två exempel på djurgrupper.",
      "check": [
        "Inre sker inne i honans kropp",
        "Yttre sker utanför, ofta i vattnet",
        "Exempel: däggdjur/fåglar respektive fiskar/groddjur"
      ],
      "model": "Vid inre befruktning möts ägg och spermie inne i honans kropp, till exempel hos däggdjur och fåglar. Vid yttre befruktning möts de utanför kroppen, ofta i vatten som hos många fiskar och groddjur.",
      "teacher": false
    },
    {
      "id": "o8",
      "topic": "sinnen",
      "question": "Ge tre exempel på djur med särskilda sinnen och förklara hur sinnet hjälper dem.",
      "check": [
        "Ge tre olika djur",
        "Beskriv vilka sinnen de har",
        "Förklara nyttan vid jakt eller överlevnad"
      ],
      "model": "Fladdermöss använder ultraljud och ekon för att hitta insekter. Ormar känner vibrationer i marken för att uppfatta rörelser. Hajar uppfattar svaga elektriska signaler som kan avslöja ett byte.",
      "teacher": false
    },
    {
      "id": "o9",
      "topic": "daggdjur",
      "question": "Varför är blåval och fladdermus båda däggdjur, trots att de lever så olika?",
      "check": [
        "De andas med lungor",
        "Honorna ger mjölk till ungarna",
        "De är jämnvarma däggdjur"
      ],
      "model": "Både blåvalen och fladdermusen är jämnvarma ryggradsdjur som andas luft med lungor. Deras honor kan dia ungar med mjölk, även om en lever i havet och en kan flyga.",
      "teacher": false
    }
  ]
};
