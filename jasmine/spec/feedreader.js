/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* Tests each feed in the allFeeds object and ensures
         * each has a URL defined and the URL is not empty
         */
        it('have non-empty URLs', function() {
            expect(allFeeds.every(checkURL)).toBe(true);
        });

        /* Tests each feed in the allFeeds object and ensures
         * each has a name defined and the name is not empty
         */
         it('have non-empty names', function() {
            expect(allFeeds.every(checkName)).toBe(true);
         })
    });




    /*
     * Second test suite for the menu
     */
    describe('The menu', function(){

        var $body,
            $menuIcon,
            isMenuHidden;


        // assigns necessary variables before each test
        beforeEach(function() {
            $body = $('body');
            $menuIcon = $('.menu-icon-link');
            isMenuHidden = $body.hasClass('menu-hidden');
        });


        /*
         * Checks if menu is hidden on start
         */
        it('is hidden by default', function() {
            expect(isMenuHidden).toBe(true);
        });


         /*
          * Nested test suite to check click results
          */
        describe('once the menu icon clicked', function() {

            beforeEach(function() {
                $menuIcon.click();
            });

            it('opens properly while the menu is closed', function() {
                expect(checkMenuVisibility(isMenuHidden)).toBe('open');
            });

            it('closes properly while the menu is open', function() {
                expect(checkMenuVisibility(isMenuHidden)).toBe('closed');
            });
        });

    });

    /*
     * Test suite for initial entries
     */

    describe('Initial Entries', function() {
        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test wil require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */

        beforeEach(function(done) {
            loadFeed(0, done);
        });

        // checks if at least 1 .entry element exists in the .feed container
        it('include at least one .entry element', function(done) {
            expect($('.feed .entry').length).toBeGreaterThan(0);
            done();
        });

    });

    /* TODO: Write a new test suite named "New Feed Selection"

        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
    describe('New Feed Selection', function() {

        var $content;
        var $changedContent;

        beforeEach(function(done) {
            $('.feed').empty();
            loadFeed(0, done);
            $content = $('.feed .entry');
            loadFeed(1, done);
        });

        it('changes content', function(done) {
            $changedContent = $('.feed .entry');
            expect($changedContent).not.toBe($content);
            loadFeed(0, done);
            done();
        });
    });


    // new test suite to describe what inactivity does
    describe('Inactivity', function() {
        var specFeedreader,
            specInactivity;

        beforeEach(function() {
            // creates spy to track Feedreader.prototype.cycleFeeds
            spyOn(Feedreader.prototype, 'cycleFeeds');
            // instantiates new feedreader for testing
            specFeedreader = new Feedreader();
            // installs clock for interval testing
            jasmine.clock().install();
            // defines new interval
            specInactivity = setInterval(specFeedreader.cycleFeeds, 15000);
        });

        afterEach(function() {
            // restores original timer functions
            jasmine.clock().uninstall();
            // clears interval
            clearInterval(specInactivity);
        });

        it('causes cycles to feed periodically', function(){
            jasmine.clock().tick(40000);
            expect(specFeedreader.cycleFeeds.calls.count()).toEqual(2);
        });
    });

}());
