## CONTENTS OF THIS FILE

 * Introduction
 * Requirements
 * Configuration

## INTRODUCTION

Star Rating is a simple module that provides star rating field and display formatter using Drupal 8's Field Type API.

Unlike Fivestar module and other voting/rating module, it supports neither end
user voting nor nice AJAX interface. It is intended for the rating only by the
author of the article (node). Of course, you may be able to do this with
Fivestar module and other voting/rating modules, but unlike most of them, it
does not require other modules such as voting API module. It's born to be simple
but good enough for those who want star rating only by authors.

For example, if you are creating a restaurant review website, and you want to
add three 5-star ratings (food, price and service) with different icon type for
each rating within a node, then this module would be the best match.

## REQUIREMENTS

This module requires no modules outside of Drupal core.

## CONFIGURATION

The module has no menu or modifiable settings. There is no configuration. When
enabled, the module will prevent the links from appearing. To get the links
back, disable the module and clear caches.
