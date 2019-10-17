/**
 * MIT License
 * Copyright © 2019-Present Zachary Halpern (@ZeldaZach)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

 /**
  * puntCheck.js
  *
  * Implements '!punt' which can be used by chat to alert the streamer they made
  * a mistake.
  */

(function() {
    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs();

        if (command.equalsIgnoreCase("punt")) {
            // How many people have to !punt to trigger
            const how_many_to_punt = 4;

            // How long in between !punt should we reset the timer
            const punt_timeout_secounds = 300;
            
            // How to split arrays
            const arr_split = ",";    

            // Which people have !punted this cycle
            var people = $.inidb.GetString("settings", "", "punt_people");

            // How many !punters this cycle
            var counter = $.inidb.GetLong("settings", "", "punt_counter");

            // How many punts has streamer made in lifetime
            var total_punts = $.inidb.GetLong("settings", "", "punt_total");

            // Trigger time of last starting !punt
            var punt_time = new Date($.inidb.GetString("settings", "", "punt_time"));

            // Current execution time
            var now = new Date();

            // Time between last start of !punt and now
            var time_since_punt_seconds = Math.floor((now - punt_time)/1000);

            // If !punt timeout occurred, reset the last punt time
            if (time_since_punt_seconds >= punt_timeout_secounds) {
                $.inidb.SetString("settings", "", "punt_time", now.toString());
                counter = 0;
                people = "";
            }

            // If this user is already involved in the punt, don't re-count them
            if (people.includes(sender + arr_split)) {
                return;
            }

            if (counter == 0) {
                // Start the punt sequence!
                $.say("Uh-oh... did the streamer punt? Type !punt to confirm");

                people = people.concat(sender + arr_split);
                counter += 1;
            } else if (counter < how_many_to_punt - 1) {
                people = people.concat(sender + arr_split);
                counter += 1;
            } else {
                // We hit our goal! It is indeed a punt by the streamer
                counter = 0;
                people = "";
                total_punts += 1;
                $.inidb.SetLong("settings", "", "punt_total", total_punts);

                $.say("Darn, the streamer DID punt! Lifetime punts: " + total_punts);
            }

            $.inidb.SetString("settings", "", "punt_people", people);
            $.inidb.SetLong("settings", "", "punt_counter", counter);
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./custom/puntCheck.js')) {
            $.registerChatCommand('./custom/puntCheck.js', 'punt', 7);
        }
    });
})();
