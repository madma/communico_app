var mongoose = require('../config/database');

var User    = require('../models/user');
var Article = require('../models/article');

var user;

User
  .remove({})
  .then(() => {
    return Article.remove({})
  })
  .then(function() {
    console.log('All users removed…');

    return User.create({
      firstName: 'Manuel',
      lastName:  'Noriega',
      username:  'panamaniac',
      email:     'mn@mannybaby.com.pa'
    });
  })
  .then(function(manny) {
    user = manny;
    return Article.create({
      title:        "How secret offshore money helps fuel Miami's luxury real-estate boom",
      author:       'Nicholas Nehamas',
      description:  'People accused of corruption are setting up offshore companies and funneling ' +
                    'cash into Miami condos and mansions, according to a massive leak of secret ' +
                    'documents called the "Panama Papers." That’s raising fears of money laundering ' +
                    'in luxury South Florida real estate.',
      publisher:    'Miami Herald',
      url:          'http://www.miamiherald.com/news/business/real-estate-news/article69248462.html',
      text:         '…',
      thumbnailImg: 'http://www.miamiherald.com/news/business/real-estate-news/djs21o-ShellGames.jpg/ALTERNATES/LANDSCAPE_1140/ShellGames.jpg',
      publishedOn:  Date.parse('April 3, 2016 2:00 PM'),
      subjects:     ['miami', 'panama papers', 'real estate', 'luxury', 'condos', 'offshore companies',
                     'money laundering', 'dirty money', 'florida', 'drug trafficking', 'corruption',
                     'mossack fonseca', 'south florida', 'brazil', 'sunny isles', 'brickell', 'miami beach',
                     'crime', 'housing', 'home', 'paulo octavio', 'helder zebral', 'joaquim barbosa',
                     'brasilia', 'secret shell game'],
      addedBy:      manny
    });
  })
  .then(function(article) {
    // console.log(article);
    // console.log(user);


  })


  // END OF THE ROAD
  .then(function() {
    return mongoose.connection.close();
  })
  .then(function() {
    process.exit(0);
  });
