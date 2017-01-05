var fs              = require('fs');
var XMLHttpRequest  = require("xmlhttprequest").XMLHttpRequest;
var xhr             = new XMLHttpRequest();
var RSS             = require('rss');
var schedule        = require('node-schedule');
var rule            = new schedule.RecurrenceRule();


var DONE  = 4; // ReadyState 4 means the request is done.
var OK    = 200; // Status 200 is a successful return.


rule.minute = 55; // Runs command every hour at 55 minuts past. E.g. 8:55, 9:55, 10:55

////////////////////
// Schedules the script to run at a specific time and date - defined in 'rule'.
////////////////////
var scriptRunner = schedule.scheduleJob(rule, function() {

  ////////////////////
  // Vanilla Javascript AJAX
  ////////////////////
  xhr.open('GET', 'https://yoursite.com/file.json');

  ////////////////////
  // Reaching the server
  ////////////////////
  xhr.onreadystatechange = function() {

    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
        
        ////////////////////
        // Parses the raw JSON data to an Javascript Object
        // xhr only fetches plain text
        ////////////////////
        var posts = JSON.parse(xhr.responseText);

        // RSS Metadata Setup
        var feed = new RSS({
          title           : 'Title of your feed', // Title of the feed
          description     : 'Description of your feed', // Description of the feed
          site_url        : 'https://yourSite.com/', // Link to site the feed is hosted on
          feed_url        : 'https://yourSite.com/feed.xml', // optional - url to the XML feed
          image_url       : 'https://yourDomain/images/rss_image.png', // optional - image that RSS readers use when displaying your feed (feed thumbnail) 
          docs            : 'https://validator.w3.org/feed/docs/rss2.html', // optional & fixed - url for RSS documentation
          managingEditor  : 'editor@yourCompany', // optional - email address for the editor of the feed posts
          webMaster       : 'webMaster@yourCompany', // optional - email address for the webmaster
          copyright       : 'year© yourCompany', // optional
          language        : 'en', // optional - Full reference list: http://www.rssboard.org/rss-language-codes
          categories      : ['category 1', 'category 2', 'category 3'], // optional - e.g. design, news, 
          Pubdate         : 'Nov 29, 2016 04:00:00 GMT', // optional - date the RSS feed came online
          ttl             : '60', // optional - how many minutes the channel is cached before being refreshed from the source
          custom_namespaces: {
            'content' : 'http://purl.org/rss/1.0/modules/content/',
            'wfw'     : 'http://wellformedweb.org/CommentAPI/',
            'itunes'  : 'http://www.itunes.com/dtds/podcast-1.0.dtd',
            'dc'      : 'http://purl.org/dc/elements/1.1/',
            'media'   : 'http://www.rssboard.org/media-rss'
          }
        });

        for (var key in posts) {
          feed.item({
            title       : posts[key].title, // Post title
            url         : 'https://yourSite.com/' + posts[key].fullUrl, // Url to the full post
            description : posts[key].description, // Post description
            date        : posts[key].date, // optional - date of publication
            custom_elements: [{
              'media:content': {
                _attr: {
                  url       : posts[key].assetUrl + '?format=yourSize', // Fetches a specific image size in cases where there are multple versions of the same image. Sizes are defined as, e.g., 500w (500px width), 356h (356px height)
                  type      : posts[key].contentType, // e.g. image/jpeg, image/png, text/html
                  medium    : 'image',
                  isDefault : 'true',
                  width     : '500', // Defines the width of the image other services (e.g. Mailchimp) sets it as.
                  height    : 'auto' // Defines the height of the image other services (e.g. Mailchimp) sets it as.
                }
              }
            }]
          });
        }

        xml = feed.xml({indent: true}); // 'Indent = true' beautify the XML file

        fs.writeFile('feed.xml', xml, function(err){
          console.log('XML file successfully created! \n Check your root folder for \'feed.xml\' ');
        });

      }
    } else if (xhr.status != 200 && xhr.status != 0) {
        console.log('Something went wrong \n Error: ' + xhr.status);
      }
  }

    xhr.send(null); // Not mandatory on modern systems but better safe than sorry

});