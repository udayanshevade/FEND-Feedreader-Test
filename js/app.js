/* app.js
 *
 * This is our RSS feed reader application. It uses the Google
 * Feed Reader API to grab RSS feeds as JSON object we can make
 * use of. It also uses the Handlebars templating library and
 * jQuery.
 */

// The names and URLs to all of the feeds we'd like available.
var inactivity;
var currentID = 0;
var allFeeds = [
    {
        name: 'Udacity Blog',
        url: 'http://blog.udacity.com/feeds/posts/default?alt=rss',
        favoriteStatus: 'none'
    }, {
        name: 'CSS Tricks',
        url: 'http://css-tricks.com/feed',
        favoriteStatus: 'none'
    }, {
        name: 'HTML5 Rocks',
        url: 'http://feeds.feedburner.com/html5rocks',
        favoriteStatus: 'none'
    }, {
        name: 'Linear Digressions',
        url: 'http://feeds.feedburner.com/udacity-linear-digressions',
        favoriteStatus: 'none'
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
    var visibility = classStatus ? 'open' : 'closed';
    return visibility;
}

// cycles through available feeds
function cycleFeeds(cb) {
    loadNextFeed(cb);
}

function loadNextFeed(cb) {
    (currentID < allFeeds.length - 1) ? currentID++ : currentID = 0;
    loadFeed(currentID, cb);
}

function loadPreviousFeed(cb) {
    (currentID > 0) ? currentID-- : currentID = allFeeds.length - 1;
    loadFeed(currentID, cb);
}

var favoriteFeed;

/* This function starts up our application. The Google Feed
 * Reader API is loaded asynchonously and will then call this
 * function when the API is loaded.
 */
function init() {
    // Load the first feed we've defined (index of 0).
    loadFeed(0);
}

/* This function performs everything necessary to load a
 * feed using the Google Feed Reader API. It will then
 * perform all of the DOM operations required to display
 * feed entries on the page. Feeds are referenced by their
 * index position within the allFeeds array.
 * This function all supports a callback as the second parameter
 * which will be called after everything has run successfully.
 */
function loadFeed(id, cb) {
    var feedUrl = allFeeds[id].url,
        feedName = allFeeds[id].name,
        feed = new google.feeds.Feed(feedUrl);

    currentID = id;

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
            var $container = $('.feed'),
                $title = $('.header-title'),
                entries = result.feed.entries,
                entriesLen = entries.length,
                entryTemplate = Handlebars.compile($('.tpl-entry').html());

            $container.css('display', 'none');
            $title.html(feedName);   // Set the header text
            $container.empty();      // Empty out all previous entries

            /* Loop through the entries we just loaded via the Google
             * Feed Reader API. We'll then parse that entry against the
             * entryTemplate (created above using Handlebars) and append
             * the resulting HTML to the list of entries on the page.
             */
            entries.forEach(function(entry) {
                $container.append(entryTemplate(entry));
            });

            // animate the container
            $container.show(300);

            if (!allFeeds[id].entries) {
                allFeeds[id].entries = [];
                entries.forEach(function(entry) {
                    entry.status = 'unread';
                    allFeeds[id].entries.push(entry);
                });
            }

            // clear interval to avoid repetition
            clearInterval(inactivity);
            // restart inactivity interval
            inactivity = setInterval(cycleFeeds, 15000);
        }

        if (cb) {
            cb();
        }
    });
}

/* Google API: Loads the Feed Reader API and defines what function
 * to call when the Feed Reader API is done loading.
 */
google.load('feeds', '1');
google.setOnLoadCallback(init);

/* All of this functionality is heavily reliant upon the DOM, so we
 * place our code in the $() function to ensure it doesn't execute
 * until the DOM is ready.
 */
$(function() {
    var container = $('.feed');
    var feedList = $('.feed-list');
    var favoriteList = $('.favorite-list');
    var feedItemTemplate = Handlebars.compile($('.tpl-feed-list-item').html());
    var feedId = 0;
    var menuIcon = $('.menu-icon-link');
    var backNav = $('#back-arrow');
    var nextNav = $('#next-arrow');
    var refresh = $('#refresh');
    var favoriteOption = '<i class="fa fa-heart favorite-option"></i>';
    var subtractOption = '<i class="fa fa-times subtract-option"></i>';

    favoriteFeed = function(feed) {
        if (feed.favoriteStatus !== 'favorite') {
            feed.favoriteStatus = 'favorite';

            favoriteList.append(feedItemTemplate(feed));
            $('.favorite-list > li:last-of-type').append(subtractOption);
        }
    };


    /* Loop through all of our feeds, assigning an id property to
     * each of the feeds based upon its index within the array.
     * Then parse that feed against the feedItemTemplate (created
     * above using Handlebars) and append it to the list of all
     * available feeds within the menu.
     */
    allFeeds.forEach(function(feed) {
        feed.id = feedId;
        feedList.append(feedItemTemplate(feed));
        $('.feed-list > li:last-of-type').append(favoriteOption);

        feedId++;
    });

    /* When a link in our feedList is clicked on, we want to hide
     * the menu, load the feed, and prevent the default action
     * (following the link) from occuring.
     */
    feedList.on('click', 'a', function() {
        var item = $(this);

        $('body').addClass('menu-hidden');
        loadFeed(item.data('id'));
        return false;
    });

    /* When the menu icon is clicked on, we need to toggle a class
     * on the body to perform the hiding/showing of our menu.
     */
    menuIcon.click(function() {
        $('body').toggleClass('menu-hidden');
    });

    /* When the navigation buttons are pressed, the corresponding
     * feed is loaded on the page.
     */
    backNav.click(function() {
        loadPreviousFeed();
    });
    nextNav.click(function() {
        loadNextFeed();
    });
    refresh.click(function() {
        loadFeed(currentID);
    });


    /* When an add-favorites button is pressed, its associated
     * feed is favorited.
     */
    $('.app-menu').on('click', '.favorite-option', function() {
        var item = $(this);
        var link = $(this).siblings('a');
        var id = link.data('id');
        var feed = allFeeds[id];
        favoriteFeed(feed);
    });

     /* When an subtract button is pressed, its associated
     * feed is unfavorited.
     */
    $('.app-menu').on('click', '.subtract-option', function() {
        var item = $(this);
        var link = $(this).siblings('a');
        var id = link.data('id');
        var feed = allFeeds[id];
        feed.favoriteStatus = 'none';
        item.parent().remove();
    });

    $('#add-current').click(function() {
        var feed = allFeeds[currentID];

        favoriteFeed(feed);
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
