# Project Overview

This project uses a web-based application which reads RSS feeds. The purpose of the project is to use [Jasmine](http://jasmine.github.io/) to test the behavior of existing and future features.

# Steps to access the project

1. Download the repository
2. Open index.html in a browser
3. The Jasmine results appear at the bottom of the page
4. Please click around and use features. (Default link behavior has been disabled for some of the testing. If you'd like to follow the links, please right click or open them in a new tab.)

# Basic tests check that

1. Each entry in allFeeds has a non-empty URL defined.
2. Each entry has a non-empty name also defined.
3. The menu is hidden by default.
4. Clicking the menu icon in turn hides and shows the menu.
5. When loadFeed() is called, 1+ .entry can be found in .feed container.
6. Content changes when a new feed is loaded.


# Additional tests check that

1. Each feed-entry begins 'unread'.
2. A 'visited' link gets flagged as 'read'.
3. loadNextFeed and loadPreviousFeed load new feeds.
4. The Back and Next arrows call the correct functions.
5. Clicking the Reload button refreshes the current feed.
6. Feeds appear via a small jQuery .show() animation.
7. Favoriting a new feed adds it to a list of favorite feeds.
8. Removing a feed removes it from the favorites list.

# Future

Some of the intended features are cosmetic at the moment, e.g. favoriting feeds only changes the front-end interface until the page is refreshed. Ideally I would like to come back and incorporate functionality to save user interaction.

# Background

1. [Raw project assets](http://github.com/udacity/frontend-nanodegree-feedreader).

## Why this Project?

Testing is an important part of the development process and many organizations practice a standard of development known as "test-driven development". This is when developers write tests first, before they ever start developing their application. All the tests initially fail and then they start writing application code to make these tests pass.

## What will I learn?

In this project I will explore Jasmine to write a number of tests against a pre-existing application. These will test the underlying business logic of the application as well as the event handling and DOM manipulation.

## How will this help my career?

* Writing effective tests requires analyzing multiple aspects of an application including the HTML, CSS and JavaScript - an extremely important skill when changing teams or joining a new company.
* Good tests give you the ability to quickly analyze whether new code breaks an existing feature within your codebase, without having to manually test all of the functionality.