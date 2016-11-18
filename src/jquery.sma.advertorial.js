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
				clientId: "",
				categoryId: "",
				language: "",
				limit: 0,
				mode: "list",
				datesVisible: false,
				apiEndpoint: "",
				textLabels: {
					"EL": [
						"Βρήκαμε ότι το φθηνότερο αεροπορικό εισιτήριο " +
						"με επιστροφή από OUTBOUND_CITY_NAME " +
						"προς INBOUND_CITY_NAME για τις διακοπές των " +
						"Χριστουγέννων είναι από OUTBOUND_DEPARTURE_DATE " +
						"έως INBOUND_DEPARTURE_DATE με μόλις PRICE Ευρώ. " +
						"Πατήστε <a href=\"DATA_PROVIDER_DEEPLINK\">εδώ</a> " +
						"για περισσότερες πληροφορίες.",
						" Αν πάλι, σας φαντάζει ένα ταξίδι από OUTBOUND_CITY_NAME " +
						"προς INBOUND_CITY_NAME ως ένας Χριστουγεννιάτικος " +
						"προορισμός, το χαμηλότερο αεροπορικό εισιτήριο με " +
						"επιστροφή που εντοπίσαμε είναι από OUTBOUND_DEPARTURE_DATE " +
						"μέχρι INBOUND_DEPARTURE_DATE με μόλις PRICE Ευρώ. " +
						"Είστε μόνο ένα κλικ μακρυά, πατώντας " +
						"<a href=\"DATA_PROVIDER_DEEPLINK\">εδώ</a>.",
						" Τέλος, με μόλις PRICE Ευρώ, εντοπίσαμε το φθηνότερο " +
						"αεροπορικό εισιτήριο με επιστροφή από OUTBOUND_CITY_NAME " +
						"προς INBOUND_CITY_NAME από OUTBOUND_DEPARTURE_DATE " +
						"μέχρι INBOUND_DEPARTURE_DATE. Εκμεταλλευτείτε την ευκαρία " +
						"πατώντας <a target=\"_blank\" href=\"DATA_PROVIDER_DEEPLINK\">εδώ</a>."
					],
					"EN": [
						"We have identified that the cheapest return air " +
						"ticket from OUTBOUND_CITY_NAME to INBOUND_CITY_NAME " +
						"for the Christmas holidays is from OUTBOUND_DEPARTURE_DATE " +
						"until INBOUND_DEPARTURE_DATE for only PRICE Euros. " +
						"Click <a href=\"DATA_PROVIDER_DEEPLINK\">here</a> for " +
						"more information.",
						" If a trip to INBOUND_CITY_NAME from OUTBOUND_CITY_NAME " +
						"sounds like a appealing Christmas destination, the " +
						"cheapest return air ticket that we have found is from " +
						"OUTBOUND_DEPARTURE_DATE until INBOUND_DEPARTURE_DATE for " +
						"only PRICE Euros. You are just a click away, by clicking " +
						"<a href=\"DATA_PROVIDER_DEEPLINK\">here</a>.",
						" Finally, for only PRICE Euros, we spotted out the cheapest " +
						"return air ticket from OUTBOUND_CITY_NAME to INBOUND_CITY_NAME " +
						"from OUTBOUND_DEPARTURE_DATE until INBOUND_DEPARTURE_DATE. Take " +
						"advantage of this Christmas deal, by clicking " +
						"<a target=\"_blank\" href=\"DATA_PROVIDER_DEEPLINK\">here</a>."
					]
				}
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
				$.ajax( {
					method: "GET",
					url: this.settings.apiEndpoint,
					data: {
						clientId:	this.settings.clientId,
						categoryId:	this.settings.categoryId,
						language:	this.settings.language,
						limit:		this.settings.limit
					}
				} )
				.done( function( msg ) {

					var deals = JSON.parse( msg );

					if ( self.settings.mode === "list" ) {

						$( self.element ).append( "<ul id='smaAdvertorial-list'></ul>" );

						for ( var deal in deals ) {
							if ( deals.hasOwnProperty( deal ) ) {

								$( "#smaAdvertorial-list" ).append(
									"<li>" +
									"<a target=\"_blank\" href=\"" +
									deals[ deal ].DATA_PROVIDER_DEEPLINK + "\">" +
									deals[ deal ].PRICE + "&euro; " +
									deals[ deal ].OUTBOUND_CITY_NAME +
									" &rarr; " +
									deals[ deal ].INBOUND_CITY_NAME + " " +
									deals[ deal ].OUTBOUND_DEPARTURE_DATE + " - " +
									deals[ deal ].INBOUND_DEPARTURE_DATE + "</a>" +
									"</li>"
								);

							}
						}
					}else if ( self.settings.mode === "text" ) {

						if ( self.settings.limit > 3 ) {

							//Max 3 deals supported on text mode.
							self.settings.limit = 3;
						}

						for ( var i = 0; i < self.settings.limit; i++ ) {

							$( self.element ).append(
								self.settings.textLabels[ self.settings.language ][ i ].
									replace( "DATA_PROVIDER_DEEPLINK",
										deals[ i ].DATA_PROVIDER_DEEPLINK ).
									replace( "PRICE",
										deals[ i ].PRICE ).
									replace( "OUTBOUND_CITY_NAME",
										( deals[ i ].OUTBOUND_CITY_NAME ).
											replace( "ς", "" ) ).
									replace( "OUTBOUND_DEPARTURE_AIRPORT_CODE",
										deals[ i ].OUTBOUND_DEPARTURE_AIRPORT_CODE ).
									replace( "INBOUND_CITY_NAME",
										( deals[ i ].INBOUND_CITY_NAME ).
											replace( "ς", "" ) ).
									replace( "INBOUND_DEPARTURE_AIRPORT_CODE",
										deals[ i ].INBOUND_DEPARTURE_AIRPORT_CODE ).
									replace( "OUTBOUND_DEPARTURE_DATE",
										deals[ i ].OUTBOUND_DEPARTURE_DATE ).
									replace( "INBOUND_DEPARTURE_DATE",
										deals[ i ].INBOUND_DEPARTURE_DATE )
							);

						}

					}else if ( self.settings.mode === "cards" ) {

						$( self.element ).append(
							"<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\">" +
							"  <tr>" +
							"    <td style=\"" +
							"     position: relative;" +
							"     width: 328px;" +
							"     height:135px;" +
							"     background-image:url('" + deals[ 0 ].INBOUND_CITY_IMG + "')\">" +
							"      <span style=\"" +
							"       position: absolute;" +
							"       top:20px;" +
							"       left:20px;" +
							"       font-family:Arial;" +
							"       font-size:25px;" +
							"       text-shadow: 2px 2px #000000;" +
							"       color:#FFFFFF;" +
							"       font-weight:bold\">" +
										deals[ 0 ].INBOUND_CITY_NAME +
							"      </span>" +
							( function( ) {
								if ( self.settings.datesVisible ) {
									return (

									"<span style=\"" +
									" position: absolute;" +
									" top:50px;" +
									" left:20px;" +
									" font-family:Arial;" +
									" font-size:22px;" +
									" text-shadow: 2px 2px #000000;" +
									" color:#FFFFFF;" +
									" font-weight:bold\">" +
										deals[ 0 ].OUTBOUND_DEPARTURE_DATE + " - " +
										deals[ 0 ].INBOUND_DEPARTURE_DATE +
									"</span>"

									);
								}
							} )() +
							"      <span style=\"" +
							"       position: absolute;" +
							"       bottom:0px;" +
							"       right:10px;" +
							"       font-family:Arial;" +
							"       font-size:60px;" +
							"       text-shadow: 2px 2px #000000;" +
							"       color:#FFFFFF;" +
							"       font-weight:bold\">" +
										deals[ 0 ].PRICE_ROUNDED + "&euro;" +
							"      </span>" +
							"      <a target=\"_blank\" href=\"" +
										deals[ 0 ].DATA_PROVIDER_DEEPLINK + "\"" +
							"        <div style=\"" +
							"         position: absolute;" +
							"         left:0px;" +
							"         top:0px;" +
							"         width:328px;" +
							"         height:135px;" +
							"         background-color:transparent\">" +
							"        </div>" +
							"      </a>" +
							"    </td>" +
							"    <td style=\"width:10px\" ></td>" +
							"    <td style=\"" +
							"     position: relative;" +
							"     width: 328px;" +
							"     height:135px;" +
							"     background-image:url('" + deals[ 1 ].INBOUND_CITY_IMG + "')\">" +
							"      <span style=\"" +
							"       position: absolute;" +
							"       top:20px;" +
							"       left:20px;" +
							"       font-family:Arial;" +
							"       font-size:25px;" +
							"       text-shadow: 2px 2px #000000;" +
							"       color:#FFFFFF;" +
							"       font-weight:bold\">" +
										deals[ 1 ].INBOUND_CITY_NAME +
							"      </span>" +
							( function( ) {
								if ( self.settings.datesVisible ) {
									return (

									"<span style=\"" +
									" position: absolute;" +
									" top:50px;" +
									" left:20px;" +
									" font-family:Arial;" +
									" font-size:22px;" +
									" text-shadow: 2px 2px #000000;" +
									" color:#FFFFFF;" +
									" font-weight:bold\">" +
										deals[ 1 ].OUTBOUND_DEPARTURE_DATE + " - " +
										deals[ 1 ].INBOUND_DEPARTURE_DATE +
									"</span>"

									);
								}
							} )() +
							"      <span style=\"" +
							"       position: absolute;" +
							"       bottom:0px;" +
							"       right:10px;" +
							"       font-family:Arial;" +
							"       font-size:60px;" +
							"       text-shadow: 2px 2px #000000;" +
							"       color:#FFFFFF;" +
							"       font-weight:bold\">" +
										deals[ 1 ].PRICE_ROUNDED + "&euro;" +
							"      </span>" +
							"      <a target=\"_blank\" href=\"" +
										deals[ 1 ].DATA_PROVIDER_DEEPLINK + "\"" +
							"        <div style=\"" +
							"         position: absolute;" +
							"         left:0px;" +
							"         top:0px;" +
							"         width:328px;" +
							"         height:135px;" +
							"         background-color:transparent\">" +
							"        </div>" +
							"      </a>" +
							"    </td>" +
							"  </tr>" +
							"  <tr colspan=\"3\" style=\"height:10px\"></tr>" +
							"  <tr>" +
							"    <td style=\"" +
							"     position: relative;" +
							"     width: 328px;" +
							"     height:135px;" +
							"     background-image:url('" + deals[ 2 ].INBOUND_CITY_IMG + "')\">" +
							"      <span style=\"" +
							"       position: absolute;" +
							"       top:20px;" +
							"       left:20px;" +
							"       font-family:Arial, Helvetica, sans-serif;" +
							"       font-size:25px;" +
							"       text-shadow: 2px 2px #000000;" +
							"       color:#FFFFFF;" +
							"       font-weight:bold\">" +
										deals[ 2 ].INBOUND_CITY_NAME +
							"      </span>" +
							( function( ) {
								if ( self.settings.datesVisible ) {
									return (

									"<span style=\"" +
									" position: absolute;" +
									" top:50px;" +
									" left:20px;" +
									" font-family:Arial;" +
									" font-size:22px;" +
									" text-shadow: 2px 2px #000000;" +
									" color:#FFFFFF;" +
									" font-weight:bold\">" +
										deals[ 2 ].OUTBOUND_DEPARTURE_DATE + " - " +
										deals[ 2 ].INBOUND_DEPARTURE_DATE +
									"</span>"

									);
								}
							} )() +
							"      <span style=\"" +
							"       position: absolute;" +
							"       bottom:0px;" +
							"       right:10px;" +
							"       font-family:Arial, Helvetica, sans-serif;" +
							"       font-size:60px;" +
							"       text-shadow: 2px 2px #000000;" +
							"       color:#FFFFFF;" +
							"       font-weight:bold\">" +
										deals[ 2 ].PRICE_ROUNDED + "&euro;" +
							"      </span>" +
							"      <a target=\"_blank\" href=\"" +
										deals[ 2 ].DATA_PROVIDER_DEEPLINK + "\"" +
							"        <div style=\"" +
							"         position: absolute;" +
							"         left:0px;" +
							"         top:0px;" +
							"         width:328px;" +
							"         height:135px;" +
							"         background-color:transparent\">" +
							"        </div>" +
							"      </a>" +
							"    </td>" +
							"    <td style=\"width:10px\" ></td>" +
							"    <td style=\"" +
							"     position: relative;" +
							"     width: 328px;" +
							"     height:135px;" +
							"     background-image:url('" + deals[ 3 ].INBOUND_CITY_IMG + "')\">" +
							"      <span style=\"" +
							"       position: absolute;" +
							"       top:20px;" +
							"       left:20px;" +
							"       font-family:Arial, Helvetica, sans-serif;" +
							"       font-size:25px;" +
							"       text-shadow: 2px 2px #000000;" +
							"       color:#FFFFFF;" +
							"       font-weight:bold\">" +
										deals[ 3 ].INBOUND_CITY_NAME +
							"      </span>" +
							( function( ) {
								if ( self.settings.datesVisible ) {
									return (

									"<span style=\"" +
									" position: absolute;" +
									" top:50px;" +
									" left:20px;" +
									" font-family:Arial;" +
									" font-size:22px;" +
									" text-shadow: 2px 2px #000000;" +
									" color:#FFFFFF;" +
									" font-weight:bold\">" +
										deals[ 3 ].OUTBOUND_DEPARTURE_DATE + " - " +
										deals[ 3 ].INBOUND_DEPARTURE_DATE +
									"</span>"

									);
								}
							} )() +
							"      <span style=\"" +
							"       position: absolute;" +
							"       bottom:0px;" +
							"       right:10px;" +
							"       font-family:Arial, Helvetica, sans-serif;" +
							"       font-size:60px;" +
							"       text-shadow: 2px 2px #000000;" +
							"       color:#FFFFFF;" +
							"       font-weight:bold\">" +
										deals[ 3 ].PRICE_ROUNDED + "&euro;" +
							"      </span>" +
							"      <a target=\"_blank\" href=\"" +
										deals[ 3 ].DATA_PROVIDER_DEEPLINK + "\"" +
							"        <div style=\"" +
							"         position: absolute;" +
							"         left:0px;" +
							"         top:0px;" +
							"         width:328px;" +
							"         height:135px;" +
							"         background-color:transparent\">" +
							"        </div>" +
							"      </a>" +
							"    </td>" +
							"  </tr>" +
							"</table>"
						);

					}

				} );

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
