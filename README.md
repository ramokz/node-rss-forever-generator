# Scheduled RSS Generator


## Prerequisites

- [Node.js](https://nodejs.org/en/) - alternatively install using [Homebrew](http://brew.sh/)
- Remote server - unless you want to run it on your own machine (**Not recommended**)


## Installation

Change to your desired directory
```
cd your-folder-path
```

Clone files from github
```
git clone git@github.com:MarcusSkov node-rss-forever-generator
```

Install the dependencies
```
npm install
```


## Adding data source

Set a path to your data source, i.e. where the data is fetched from
``` js
xhr.open('GET', 'https://yoursite.com/file.json');
```

Grab the data you want in your feed. In this example a json file formated as plain text is converted to a javascript object.
``` js
var posts = JSON.parse(xhr.responseText);
```

## Setting up RSS template

### Channel
Define the RSS channel; parent content for all the RSS posts.
The content here is usually static.

``` js
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
```

### Posts
Add your data source to the feed.item.
In the example below we're just pulling the information from a json file.

``` js
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
```

### _Further information_
[node-rss documentation](https://www.npmjs.com/package/node-rss)

## Set a schedule
This tells the script how often it should run.
Can be anything from every minute to a specific time and day of the week.

The following example will run on Fridays at 6:55pm.
``` js
rule.minute     = 55; // Runs at 55 minutes past the hour
rule.hour       = 18; // Runs at 18 or 6pm
rule.dayOfWeek  =  5; // Runs on Fridays (0 = Monday, 6 = Sunday)
```
_Note:_ Only one rule is required.

### _Further information_
[node-schedule documentation](https://www.npmjs.com/package/node-schedule)


## Running tasks
Once all the RSS formatting is set up and a schedule has been declared, simply start the server with _forever_.

### Starting forever
```
forever start forever.js
```
Once forever is running you can close terminal and it will continue running until you tell it to stop.

### Stopping forever
```
forever stopall
```

_or_

```
forever stop forever.js
```

### _Further information_
[forever documentation](https://www.npmjs.com/package/forever)

If everything has been formatted correctly you should have a newly generated XML file in your root folder of the repository. Open it in your browser and you have your very own, continuously generated, RSS feed.

## Optional forever settings
If you want to have a bit more control over forever you can use forever-monitor to, e.g., make the script run a fixed number of times.

### _Further information_
[forever-monitor documentation](https://www.npmjs.com/package/forever-monitor)