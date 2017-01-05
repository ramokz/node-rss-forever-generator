# Scheduled RSS Generator


## Prerequisites

- [Node.js](https://nodejs.org/en/)
- Remote server - Unless you want to run it on your own machine (**Not recommended**)


## Installation

Change to your desired directory
```
cd your-folder-path
```

Download the files
```
git clone git@github.com:MarcusSkov node-rss-forever-generator
```

Install dependencies
```
npm install
```


## Adding data source

Inside
```
main.js
```

Set a path to your data source, i.e. where the data is fetched from
``` js
xhr.open('GET', 'https://yoursite.com/file.json');
```

Grabbing the data that fills out the content in the feed. In this example a json file formated as plain text is converted to a javascript object.
``` js
var posts = JSON.parse(xhr.responseText);
```

## Setting up RSS template

### Channel

``` js
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
          custom_namespaces: { // Defines the media:content used below. This is required to make images defined in media:content to appear in some RSS readers
            'content' : 'http://purl.org/rss/1.0/modules/content/',
            'wfw'     : 'http://wellformedweb.org/CommentAPI/',
            'itunes'  : 'http://www.itunes.com/dtds/podcast-1.0.dtd',
            'dc'      : 'http://purl.org/dc/elements/1.1/',
            'media'   : 'http://www.rssboard.org/media-rss'
          }
        });
```

### Posts

``` js
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
```

### _Further information_
[node-rss documentation](https://www.npmjs.com/package/node-rss)

## Set a schedule
This tells the script how often it should run.
Can be anything from every minute to a specific day and time of the week.

The following example will run on Fridays at 6:55pm.
``` js
rule.minute     = 55; // runs at 55 minutes past the hour
rule.hour       = 18; // runs at 18 or 6pm
rule.dayOfWeek  =  5; // runs on Fridays (0 = Monday, 6 = Sunday)
```
Note: Only one rule is required.

### _Further information_
[node-schedule documentation](https://www.npmjs.com/package/node-schedule)



## Running tasks
Once all the RSS formatting is setup and a schedule has been set it's time to start the server using _forever_ 

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
[forever documentaiton](https://www.npmjs.com/package/forever)

If everything has been formatted correctly you should have a newly generated RSS feed in your root folder of the repository.