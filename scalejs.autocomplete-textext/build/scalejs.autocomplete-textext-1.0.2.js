
/*global define*/
define('scalejs.autocomplete-textext/autocomplete',[
    'scalejs!core',
    'knockout',
    'jQuery',
    'scalejs.mvvm'
], function (
    core,
    ko,
    $
) {
    var unwrap = ko.utils.unwrapObservable,
       isObservable = ko.isObservable,
       computed = ko.computed,
       has = core.object.has;

    function setPlugins(options) {
        plugins = options.plugins || 'autocomplete';

        //suggestions plugin will break the functionality so remove it and warn the user if it exists.
        if (plugins.indexOf('suggestions') !== -1) {
            core.log.warn('Autocomplete binding does not support suggestions plugin');
            plugins.replace('suggestions', '');
        }

        //if user specifies their own plugins but forgets to specify autocomplete do it for them
        if (plugins.indexOf('autocomplete') === -1) {
            plugins = plugins + ' autocomplete'
        }

        //if the limit tags to dataSource option is set to true then ensure tags is included
        if (options.limitTags && plugins.indexOf('tags') === -1) {
            plugins = plugins + 'tags'
        }

        return plugins;
    }

    function bindToDataSource(element, autocomplete, dataSource, options) {
        autocomplete.bind('getSuggestions', function (e, data) {
            var list = unwrap(dataSource),
                textext = $(e.target).textext()[0],
                query = (data ? data.query : '') || '';

            $(this).trigger('setSuggestions', {
                result: textext.itemManager().filter(list, query)
            });
        });

        //limit tags custom binding
        if (options.limitTags) {
            if (has(options.eventHandlers, 'isTagAllowed'))
                core.log.warn('isTagAllowed event handler will be overwritten');

            autocomplete.bind('isTagAllowed', function (e, data) {
                data.result = $.inArray(data.tag, unwrap(dataSource)) !== -1
            });
        }

        if (isObservable(dataSource)) {
            computed({
                read: function () {
                    autocomplete.bind('getSuggestions', function (e, data) {
                        var list = unwrap(dataSource),
                            textext = $(e.target).textext()[0],
                            query = (data ? data.query : '') || '';

                        $(this).trigger('setSuggestions', {
                            result: textext.itemManager().filter(list, query)
                        });
                    });

                    //limit tags custom binding
                    if (options.limitTags) {
                        autocomplete.bind('isTagAllowed', function (e, data) {
                            data.result = $.inArray(data.tag, unwrap(dataSource)) !== -1
                        });
                    }

                },
                disposeWhenNodeIsRemoved: element
            });
        }
    }

    function setEventHandlers(autocomplete, eventHandlers) {
        for (var event in eventHandlers) {
            autocomplete.bind(event, eventHandlers[event]);
        }
    }

    function init(
        element,
        valueAccessor,
        allBindingAccessor,
        viewModel,
        bindingContext
    ) {
        var b = allBindingAccessor(),
            options = b.autocomplete,
            dataSource = options.dataSource,
            autocomplete;

        options.plugins = setPlugins(options);
        autocomplete = $(element).textext(options);
        if (has(options.eventHandlers)) setEventHandlers(autocomplete, options.eventHandlers);
        bindToDataSource(element, autocomplete, dataSource, options);

    }

    return {
        init: init
    };
});


/*global define*/
define('scalejs.autocomplete-textext',[
    'knockout',
    './scalejs.autocomplete-textext/autocomplete',
    'jQuery',
    'textext'
], function (
    ko,
    autocomplete
) {
    
    ko.bindingHandlers.autocomplete = autocomplete;
});

