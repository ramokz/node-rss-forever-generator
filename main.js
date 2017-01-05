var fs              = require('fs');
var XMLHttpRequest  = require("xmlhttprequest").XMLHttpRequest;
var xhr             = new XMLHttpRequest();
var RSS             = require('rss');
var schedule        = require('node-schedule');
var rule            = new schedule.RecurrenceRule();


var DONE  = 4; // ReadyState 4 means the request is done
var OK    = 200; // Status 200 is a successful return


rule.minute = 55; // Runs command every hour at 55 minuts past. E.g. 8:55, 9:55, 10:55

////////////////////
// Schedules the script to run at a specific time and date - defined in 'rule'
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
          title           : 'Title of your feed',
          description     : 'Description of your feed',
          site_url        : 'https://yourSite.com/',
          feed_url        : 'https://yourSite.com/feed.xml',
          image_url       : 'https://yourDomain/images/rss_image.png', // Optional - Thumbnail
          docs            : 'https://validator.w3.org/feed/docs/rss2.html', // Optional
          managingEditor  : 'editor@yourCompany', // Optional
          webMaster       : 'webMaster@yourCompany', // Optional
          copyright       : 'year© yourCompany', // Optional
          language        : 'en', // Optional - Reference: http://www.rssboard.org/rss-language-codes // Optional
          categories      : ['category 1', 'category 2', 'category 3'], // Optional - E.g. design, news, cooking
          Pubdate         : 'Nov 29, 2016 04:00:00 GMT', // Optional - Date the RSS feed came online
          ttl             : '60', // Optional - How many minutes the channel is cached before being refreshed from the source
          custom_namespaces: { // Defines the media:content used below. This is required to make images defined in media:content to appear in some RSS aggregators
            'content' : 'http://purl.org/rss/1.0/modules/content/',
            'wfw'     : 'http://wellformedweb.org/CommentAPI/',
            'itunes'  : 'http://www.itunes.com/dtds/podcast-1.0.dtd',
            'dc'      : 'http://purl.org/dc/elements/1.1/',
            'media'   : 'http://www.rssboard.org/media-rss'
          }
        });

        for (var key in posts) {
          feed.item({
            title       : posts[key].title,
            description : posts[key].description, // Post description
            url         : 'https://yourSite.com/' + posts[key].fullUrl, // Url to the full post
            date        : posts[key].date, // Optional - Date of publication,
            custom_elements: [{
              'media:content': {
                _attr: {
                  url       : posts[key].assetUrl + '?format=yourSize', // '?format=' fetches a specific image size in cases where there are multple images in different sizes
                  type      : posts[key].contentType, // Optional - E.g. image/jpeg, image/png, text/html // Optional
                  medium    : 'image', // Optional
                  isDefault : 'true', // Optional
                  width     : '500', // Optional - Desired output width of image
                  height    : 'auto' // Optional - Desired output height of image
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