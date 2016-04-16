var mongoose = require('./database');
var _ = require('lodash');

var User    = require('./../models/user');
var Article = require('./../models/article');
var scraper = require('./../controllers/helpers/articles.scraper.js');


// console.log(scraper);

// console.log(scraper.getCanonicalUrls(definedArticleUrls()));

var users;
var articles;

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
    return Article.remove({});
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
            // console.log("SCRAPED DATA:", articleDataObjsArray);
            articleDataObjsArray.forEach(article => {article.addedBy = _.sampleSize(users, 2); /*console.log("SCRAPED ARTICLE: ", "\n", article);*/});
            return Article.create(articleDataObjsArray);
          })
          .catch(function(err) {
            console.log("SCRAPER ERR", err)
          });
      });
  })
  .then(function(createdArticles) {
    articles = createdArticles;
    createdArticles.forEach(article => {
      Promise.all(article.addedBy.forEach(user => {
        User.findByIdAndUpdate(user._id, {$push: {articles: article}}, {new: true}).exec();
      }));
    });
  })
  .then(function() {
    return User.find({});
  })
  .then(function(updatedUsers) {
    // articles = createdArticles;
    users = updatedUsers;
    console.log("LOGGING THE UPDATED USERS......");
    updatedUsers.forEach((user, i) => console.log("user " + i + ": " + "\n" + user));
    // console.log("LOGGING THE CREATED ARTICLES......");
    // articles.forEach((article, i) => console.log("article " + i + ": " + "\n" + article));
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
    "http://www.cnn.com/2016/03/30/tech/nasa-super-earth-temperatures/index.html",
    "http://www.latimes.com/politics/la-pol-ca-marijuana-regulator-20160408-story.html",
    "http://www.latimes.com/politics/la-pol-sac-paid-family-leave-california-20160411-story.html",
    "http://www.latimes.com/sports/lakers/la-sp-kobe-last-game-pictures-20160413-photogallery.html"/*,
    "http://www.latimes.com/sports/lakers/la-sp-lakers-what-does-kobe-bryant-mean-to-you-responses-20160410-story.html",
    "http://www.newyorker.com/cartoons/bob-mankoff/the-world-of-william-hamilton",
    "http://www.newyorker.com/culture/cultural-comment/beverly-cleary-age-100",
    "http://www.newyorker.com/magazine/2012/08/06/fussbudget",
    "http://www.newyorker.com/magazine/2016/04/11/gay-talese-the-voyeurs-motel",
    "http://www.newyorker.com/magazine/2016/04/18/a-radical-attempt-to-save-the-reefs-and-forests",
    "http://www.newyorker.com/magazine/2016/04/18/considering-female-rule",
    "http://www.newyorker.com/magazine/2016/04/18/maggie-nelsons-many-selves",
    "http://www.newyorker.com/news/amy-davidson/ted-cruz-meets-new-york-values",
    "http://www.newyorker.com/news/daily-comment/bill-clinton-eternal-campaigner",
    "http://www.newyorker.com/news/news-desk/no-answers-in-the-murder-of-berta-caceres",
    "http://www.nytimes.com/2016/03/13/opinion/sunday/the-superior-social-skills-of-bilinguals.html",
    "http://www.nytimes.com/2016/04/06/world/europe/panama-papers-iceland.html",
    "http://www.nytimes.com/2016/04/08/fashion/mens-style/luka-sabbat-fashion-influencer.html",
    "http://www.nytimes.com/2016/04/09/world/europe/pope-francis-amoris-laetitia.html",
    "http://www.nytimes.com/2016/04/12/opinion/international/whats-missing-from-the-syria-peace-talks.html",
    "http://www.nytimes.com/2016/04/12/science/a-new-zealand-penguin-hard-to-spot-is-harder-to-preserve.html",
    "http://www.nytimes.com/politics/first-draft/2016/04/07/bernie-sanders-and-hillary-clinton-spar-over-presidential-qualifications/",
    "https://www.washingtonpost.com/news/worldviews/wp/2016/04/08/how-global-tax-evasion-keeps-poor-countries-poor/"*/
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
