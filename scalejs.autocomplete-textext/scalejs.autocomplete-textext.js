/*global define*/
define([
    'knockout',
    './scalejs.autocomplete-textext/autocomplete',
    'jQuery',
    'textext'
], function (
    ko,
    autocomplete
) {
    'use strict';
    ko.bindingHandlers.autocomplete = autocomplete;
});

