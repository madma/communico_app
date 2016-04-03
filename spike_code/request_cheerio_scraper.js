var rp = require("request-promise");
var cheerio = require("cheerio");

// var options = {
//   uri: "http://www.nytimes.com/2016/03/13/opinion/sunday/the-superior-social-skills-of-bilinguals.html",
//   jar: true,
//   transform: body => cheerio.load(body)
// };

// rp(options)
//   .then(function($) {
//     var $description = $("[property='og:description']").attr("content");
//     console.log($description);
//   })
//   .catch(err => console.log("ERROR: ", err));

// var uris = [
//   "http://www.nytimes.com/2016/03/13/opinion/sunday/the-superior-social-skills-of-bilinguals.html",
//   "http://www.nytimes.com/politics/first-draft/2016/04/01/donald-trump-clears-air-with-g-o-p-leaders-and-chastises-his-aides/",
//   "http://www.nytimes.com/2016/04/05/science/tapeworms-and-other-parasites-can-make-good-guests.html",
//   "http://www.nytimes.com/2016/04/01/arts/design/zaha-hadid-architect-dies.html",
//   "http://www.nytimes.com/2016/03/30/dining/lilia-restaurant-review.html",
//   "http://www.nytimes.com/2016/04/01/books/beverly-cleary-nearing-100-is-to-be-celebrated-at-symphony-space.html",
//   "http://www.nytimes.com/2016/04/01/upshot/a-dodd-frank-watchdog-still-growls-on-a-slightly-tighter-leash.html",
//   "http://www.nytimes.com/2016/04/03/magazine/the-invisible-catastrophe.html",
//   "http://www.nytimes.com/2016/04/03/realestate/in-brooklyn-more-space-for-the-money.html",
//   "http://www.nytimes.com/2016/04/01/fashion/france-craftsmanship.html",
//   "http://www.nytimes.com/2016/04/03/business/juicero-juice-system-silicon-valley-interest.html",
//   "http://www.nytimes.com/2016/04/01/world/nuclear-security-summit-obama.html",
//   "http://www.nytimes.com/2016/04/01/world/europe/vojislav-seselj-war-crimes.html",
//   "http://www.nytimes.com/2016/04/01/world/europe/brussels-attacks-airport-security.html"
//   ];


function Options(uri) {
  this.uri = uri;
  this.jar = true;
}

Options.prototype.transform = body => cheerio.load(body);

function getDescription(opt) {
  var promise = rp(opt)
    .then(function($) {
      var $description = $("[property='og:description']").attr("content");
      console.log($description);
      return $description;
    });

    return promise;
}

// uris.map(uri => new Options(uri)).forEach(options => getDescription(options));

module.exports = {
  getDescription: getDescription,
  Options: Options
};


