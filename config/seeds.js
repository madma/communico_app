var mongoose = require('./database');

var User    = require('./../models/user');
var Article = require('./../models/article');
var scraper = require('./../controllers/helpers/articles.scraper.js');

// console.log(scraper);

// console.log(scraper.getCanonicalUrls(definedArticleUrls()));

var users;
var articles;
var rawLinks = [
    "http://nymag.com/thecut/2016/04/black-girls-rock-is-the-celebration-we-deserve.html",
    "http://www.businessinsider.com/how-to-buy-class-mens-dress-shoes-2016-4",
    "http://remezcla.com/culture/96-year-old-wwii-vet-oldest-usc-grad/",
    "http://m.nydailynews.com/new-york/cruz-bronx-school-visit-canceled-students-plan-walkout-article-1.2590946?cid=bitly"
  ];

/*
 * Seed the database.
 */

console.log("Removing users...");
User.remove({})
  .then(function() {
    console.log("Creating users: "); // like console.log!
    return User.create(definedUsers());
  })
  .then(function(createdUsers) {
    users = createdUsers; // save the users list!
    console.log("Database seeded with " + users.length  + " users.");
  })
  .then(function() {
    console.log("Removing articles...");
    Article.remove({});
  })
  .then(function() {
    var articleUrls;
        // returnedArticles;
    return scraper
      .getCanonicalUrls(definedArticleUrls())
      .then(function(canonicalUrls) {
        articleUrls = canonicalUrls;
        console.log("THE CANONICAL LINKS ARE: ", articleUrls);
      })
      .then(function() {
        console.log("ADDING ARTICLES TO DB!");
        return scraper
        .scrapeArticles(articleUrls)
          .then(function(articleDataObjsArray) {
            console.log("SCRAPED DATA:", articleDataObjsArray);
            // articleData.addedBy = [req.user._id];
            return Article.create(articleDataObjsArray);
          })
          .catch(function(err) {
            console.log("SCRAPER ERR", err)
          });
      });
  })
  .then(function(createdArticles) {
    articles = createdArticles;
    console.log("LOGGING THE CREATED USERS......");
    users.forEach((user, i) => console.log("user " + i + ": " + "\n" + user));
    console.log("LOGGING THE CREATED ARTICLES......");
    articles.forEach((article, i) => console.log("article " + i + ": " + "\n" + article));
    closeMongoConnection();
  })
  .catch(function(err) {
    console.log("Error: ", err);
    closeMongoConnection();
  });


function closeMongoConnection() {
  mongoose.connection.close(function(err) {
    if (err) console.log(err);
    process.exit(0);
  });
}



function definedArticleUrls() {
  return [
    "http://www.nytimes.com/2016/04/08/fashion/mens-style/luka-sabbat-fashion-influencer.html?hp&action=click&pgtype=Homepage&clickSource=story-heading&module=photo-spot-region&region=top-news&WT.nav=top-news&mtrref=www.nytimes.com&gwh=442D2D8A8A6F408E18CFA65E568D2EB3&gwt=pay",
    "https://www.washingtonpost.com/news/worldviews/wp/2016/04/08/how-global-tax-evasion-keeps-poor-countries-poor/?hpid=hp_hp-top-table-main_taxevasion-wv-645am%3Ahomepage%2Fstory",
    "http://www.latimes.com/politics/la-pol-ca-marijuana-regulator-20160408-story.html",
    "http://www.nytimes.com/2016/04/06/world/europe/panama-papers-iceland.html?hp&action=click&pgtype=Homepage&clickSource=story-heading&module=first-column-region&region=top-news&WT.nav=top-news&_r=0"
  ];
}

function definedUsers() {
  return [
    {
      firstName:              "Michael",
      lastName:               "Duran",
      username:               "madma",
      email:                  "michael@m-a-d.work",
      password:               "12345",
      passwordConfirmation:   "12345"
    },
    {
      firstName:              "Michael",
      lastName:               "Duran",
      username:               "md",
      email:                  "md@email.com",
      password:               "12345",
      passwordConfirmation:   "12345"
    },
    {
      firstName:              "Michael",
      lastName:               "Monge",
      username:               "mm",
      email:                  "mm@email.com",
      password:               "12345",
      passwordConfirmation:   "12345"
    },
    {
      firstName:              "Michael",
      lastName:               "Cheema",
      username:               "mc",
      email:                  "mc@email.com",
      password:               "12345",
      passwordConfirmation:   "12345"
    },
    {
      firstName:              "Michael",
      lastName:               "DuranMonge",
      username:               "mdm",
      email:                  "mdm@email.com",
      password:               "12345",
      passwordConfirmation:   "12345"
    },
    {
      firstName:              "Michael",
      lastName:               "DuranMongeCheema",
      username:               "mdmc",
      email:                  "mdmc@email.com",
      password:               "12345",
      passwordConfirmation:   "12345"
    }
  ];
 }


// User
//   .remove({})
//   .then(() => {
//     return Article.remove({})
//   })
//   .then(function() {
//     console.log('All users removed…');

//     return User.create({
//       firstName: 'Manuel',
//       lastName:  'Noriega',
//       username:  'panamaniac',
//       email:     'mn@mannybaby.com.pa'
//     });
//   })
//   .then(function(manny) {
//     user = manny;
//     return Article.create({
//       title:        "How secret offshore money helps fuel Miami's luxury real-estate boom",
//       author:       'Nicholas Nehamas',
//       description:  'People accused of corruption are setting up offshore companies and funneling ' +
//                     'cash into Miami condos and mansions, according to a massive leak of secret ' +
//                     'documents called the "Panama Papers." That’s raising fears of money laundering ' +
//                     'in luxury South Florida real estate.',
//       publisher:    'Miami Herald',
//       url:          'http://www.miamiherald.com/news/business/real-estate-news/article69248462.html',
//       text:         '…',
//       thumbnailImg: 'http://www.miamiherald.com/news/business/real-estate-news/djs21o-ShellGames.jpg/ALTERNATES/LANDSCAPE_1140/ShellGames.jpg',
//       publishedOn:  Date.parse('April 3, 2016 2:00 PM'),
//       subjects:     ['miami', 'panama papers', 'real estate', 'luxury', 'condos', 'offshore companies',
//                      'money laundering', 'dirty money', 'florida', 'drug trafficking', 'corruption',
//                      'mossack fonseca', 'south florida', 'brazil', 'sunny isles', 'brickell', 'miami beach',
//                      'crime', 'housing', 'home', 'paulo octavio', 'helder zebral', 'joaquim barbosa',
//                      'brasilia', 'secret shell game'],
//       addedBy:      manny
//     });
//   })
//   .then(function(article) {
//     // console.log(article);
//     // console.log(user);


//   })


//   // END OF THE ROAD
//   .then(function() {
//     return mongoose.connection.close();
//   })
//   .then(function() {
//     process.exit(0);
//   });
