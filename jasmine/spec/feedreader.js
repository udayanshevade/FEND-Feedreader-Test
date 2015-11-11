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
            expect(allFeeds.length).not.toEqual(0);
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
         });
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
            // boolean test for whether menu has hidden class
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
        describe(', once clicked,', function() {
            beforeEach(function() {
                $menuIcon.click();
            });

            it('opens if closed', function() {
                expect(checkMenuVisibility(isMenuHidden)).toBe('open');
            });

            it('closes if open', function() {
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
        var random

        beforeEach(function(done) {
            loadFeed(0, done);
            randomFeed = allFeeds[0];
        });

        // checks if at least 1 .entry element exists in the .feed container
        it('include at least one .entry element', function(done) {
            // expect returned array of elements to be more than one
            expect($('.feed .entry').length).toBeGreaterThan(0);
            done();
        });


        // checks initial status of entries
        it('begin as unread', function(done) {
            // read initial status of sample loaded feed
            expect(randomFeed.entries[1].status).toEqual('unread');
            done();
        });

        // checks read status of entries
        it('get flagged as read if clicked', function(done) {
            // click chosen sample feed
            $('.entry-link')[1].click();
            // read status of the entry after clicked
            expect(randomFeed.entries[1].status).toEqual('read');
            done();
        });
    });

    /* TODO: Write a new test suite named "New Feed Selection"

        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
    describe('New Feed Selection', function() {

        var $content,
            $changedContent;

        // start with first loaded content
        beforeAll(function(done) {
            loadFeed(0, done);
        });

        // load new feed before each test
        beforeEach(function(done) {
            // cache content of feed
            $content = $('.feed .entry');
            // load next feed
            loadFeed(1, done);
        });

        // reset content at the end of the test suite
        afterAll(function(done) {
            loadFeed(0, done);
        });

        // check if loaded content is actually different
        it('changes content', function(done) {
            // look up entries again
            $changedContent = $('.feed .entry');
            console.log($content, $changedContent);
            // check if new content does not match previous reference
            expect($changedContent).not.toBe($content);
            done();
        });

                // back arrow loads previous feed
        it('loads previous feed if \'back\' arrow is pressed', function(done) {
            // simulate clicking the back arrow
            $('#back-arrow').click();
            $changedContent = $('.feed .entry');
            expect($changedContent).not.toBe($content);
            done();
        });

        // back arrow loads previous feed
        it('loads next feed if \'next\' arrow is pressed', function(done) {
            // simulate clicking the back arrow
            $('#next-arrow').click();
            $changedContent = $('.feed .entry');
            expect($changedContent).not.toBe($content);
            done();
        });

    });


    // new test suite to describe what inactivity does
    describe('Inactivity', function() {

        beforeEach(function() {
            // creates spy to track loadFeed
            spyOn(window, 'loadFeed');
            // installs clock for interval testing
            jasmine.clock().install();
        });

        // restores functionality
        afterEach(function() {
            // restores original timer functions
            jasmine.clock().uninstall();
        });

        // tests whether cycleFeeds gets called according to interval
        it('causes feeds to cycle periodically', function(done){
            setInterval(function() {
                loadFeed(0, done);
            }, 25000);
            // just before 3 intervals
            jasmine.clock().tick(55000);
            // callback count should be 2
            expect(loadFeed.calls.count()).toEqual(2);
            done();
        });

        // tests whether interval is reset when active
        it('resets due to activity', function(done) {
            // forward mock clock to just before callback
            jasmine.clock().tick(20000);
            // simulates menu click
            $('.feed-list').click();
            // forwards clock past original time of callback
            jasmine.clock().tick(10000);
            // callback should not have occurred
            expect(window.loadFeed).not.toHaveBeenCalled();
            done();
        });
    });



    // new test suite to describe transitions
    describe('Transitions', function() {
        //
    });

}());
