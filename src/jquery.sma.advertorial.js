// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "smaAdvertorial",
			defaults = {
				clientId: 		"",
				categoryId: 	"",
				language: 		"",
				limit: 			0,
				api_endpoint: 	""
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {

				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example below
				this.getData();
			},
			getData: function() {

				var self = this;

				//Send Request	
				$.ajax({
					method: "GET",
					url: this.settings.api_endpoint,
					data: { 
						clientId: 	this.settings.clientId,
						categoryId: this.settings.categoryId,
						language: 	this.settings.language,
						limit: 		this.settings.limit
					}
				})
				.done(function( msg ) {

					$(self.element).append("<ul id='smaAdvertorial-list'></ul>");

					var deals = JSON.parse(msg);
					
					for(var deal in deals){
						if (deals.hasOwnProperty(deal)) {	

							$("#smaAdvertorial-list").append("<li><a href=\""+deals[deal].data_provider_deeplink+"\">"+deals[deal].price+"&euro; "+deals[deal].outbound_city_name+" ("+deals[deal].outbound_departure_airport_code+") &rarr; "+deals[deal].inbound_city_name+" ("+deals[deal].inbound_departure_airport_code+") "+deals[deal].outbound_departure_date+" - "+deals[deal].inbound_departure_date+"</a></li>");

						}
					}

				});

			}
		} );

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );
