/* app.js
 *
 * This is our RSS feed reader application. It uses the Google
 * Feed Reader API to grab RSS feeds as JSON object we can make
 * use of. It also uses the Handlebars templating library and
 * jQuery.
 */

// The names and URLs to all of the feeds we'd like available.
var inactivity,
    currentID = 0,
    allFeeds = [
    {
        name: 'Udacity Blog',
        url: 'http://blog.udacity.com/feeds/posts/default?alt=rss'
    }, {
        name: 'CSS Tricks',
        url: 'http://css-tricks.com/feed'
    }, {
        name: 'HTML5 Rocks',
        url: 'http://feeds.feedburner.com/html5rocks'
    }, {
        name: 'Linear Digressions',
        url: 'http://feeds.feedburner.com/udacity-linear-digressions'
    }
];

// checks every url element in allFeeds to see if it has a url
function checkURL(element, index, array) {
    return (typeof element['url'] === 'string' && element != '');
}

// checks every name element in allFeeds to see if it has a name
function checkName(element, index, array) {
    return (typeof element['name'] === 'string' && element != '');
}

// returns status of menu visibility
function checkMenuVisibility(classStatus) {
    if (classStatus === true) {
        return 'open';
    }
    else {
        return 'closed';
    }
}

var Feedreader = function() {
  // class for Feedreader functions
};

// cycles through available feeds
Feedreader.prototype.cycleFeeds = function() {
    if (currentID < allFeeds.length - 1) {
        currentID++;
    }
    else {
        currentID = 0;
    }
    this.loadFeed(currentID);
};

/* This function starts up our application. The Google Feed
 * Reader API is loaded asynchonously and will then call this
 * function when the API is loaded.
 */
Feedreader.prototype.init = function() {
    // Load the first feed we've defined (index of 0).
    this.loadFeed(0);
}

/* This function performs everything necessary to load a
 * feed using the Google Feed Reader API. It will then
 * perform all of the DOM operations required to display
 * feed entries on the page. Feeds are referenced by their
 * index position within the allFeeds array.
 * This function all supports a callback as the second parameter
 * which will be called after everything has run successfully.
 */
Feedreader.prototype.loadFeed = function(id, cb) {
    var feedUrl = allFeeds[id].url,
        feedName = allFeeds[id].name,
        feed = new google.feeds.Feed(feedUrl);

    clearInterval(inactivity);

    /* Load the feed using the Google Feed Reader API.
     * Once the feed has been loaded, the callback function
     * is executed.
     */
    feed.load(function(result) {
        if (!result.error) {
            /* If loading the feed did not result in an error,
             * get started making the DOM manipulations required
             * to display the feed entries on screen.
             */
            var container = $('.feed'),
                title = $('.header-title'),
                entries = result.feed.entries,
                entriesLen = entries.length,
                entryTemplate = Handlebars.compile($('.tpl-entry').html());

            title.html(feedName);   // Set the header text
            container.empty();      // Empty out all previous entries

            /* Loop through the entries we just loaded via the Google
             * Feed Reader API. We'll then parse that entry against the
             * entryTemplate (created above using Handlebars) and append
             * the resulting HTML to the list of entries on the page.
             */
            entries.forEach(function(entry) {
                container.append(entryTemplate(entry));
            });

            if (!allFeeds[id].entries) {
                allFeeds[id].entries = [];
                entries.forEach(function(entry) {
                    entry.status = 'unread';
                    allFeeds[id].entries.push(entry);
                });
            }

            // restart inactivity interval
            inactivity = setInterval(feedreader.cycleFeeds, 20000);
        }

        if (cb) {
            cb();
        }
    });
}

var feedreader = new Feedreader();
/* Google API: Loads the Feed Reader API and defines what function
 * to call when the Feed Reader API is done loading.
 */
google.load('feeds', '1');
google.setOnLoadCallback(feedreader.init);

/* All of this functionality is heavily reliant upon the DOM, so we
 * place our code in the $() function to ensure it doesn't execute
 * until the DOM is ready.
 */
$(function() {
    var container = $('.feed'),
        feedList = $('.feed-list'),
        feedItemTemplate = Handlebars.compile($('.tpl-feed-list-item').html()),
        feedId = 0,
        menuIcon = $('.menu-icon-link');

    /* Loop through all of our feeds, assigning an id property to
     * each of the feeds based upon its index within the array.
     * Then parse that feed against the feedItemTemplate (created
     * above using Handlebars) and append it to the list of all
     * available feeds within the menu.
     */
    allFeeds.forEach(function(feed) {
        feed.id = feedId;
        feedList.append(feedItemTemplate(feed));

        feedId++;
    });

    /* When a link in our feedList is clicked on, we want to hide
     * the menu, load the feed, and prevent the default action
     * (following the link) from occuring.
     */
    feedList.on('click', 'a', function() {
        var item = $(this);

        $('body').addClass('menu-hidden');
        feedreader.loadFeed(item.data('id'));
        return false;
    });

    /* When the menu icon is clicked on, we need to toggle a class
     * on the body to perform the hiding/showing of our menu.
     */
    menuIcon.on('click', function() {
        $('body').toggleClass('menu-hidden');
    });


    /* When an entry is clicked, set the 'unread' status
     * equal to 'read', allowing us to keep track.
     * Since the links are appended dynamically, use
     * $(document).on to catch the link clicks.
     */
    $(document).on('click', '.entry-link', function(e) {
        // prevent click behavior
        e.preventDefault();
        // cache the clicked url
        var currentURL = this.href;

        // loop through allFeeds
        for (var i = 0, allFeedsLen = allFeeds.length; i < allFeedsLen; i++) {

            // cache references
            var currentFeed = allFeeds[i],
                entries = currentFeed.entries;

            // check if the entries have been loaded before click
            if (entries) {
                // loop through entries
                for (var j = 0, entriesLen = entries.length; j < entriesLen; j++) {
                    // find the clicked url
                    if (entries[j].link === currentURL) {
                        // set its status in the feeds as 'read'
                        entries[j].status = 'read';
                    }
                }
            }
        }
        // prevent bubbling
        return false;
    });

}());
