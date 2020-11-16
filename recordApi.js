/**
 * 5050game
 *
 * Flip a coin game.
 */
(function() {
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs();

        /**
         * !record win
         * !record loss
         * !record undo
         * !record set 0-0
         */
        if (command.equalsIgnoreCase("record")) {
            var action = args[0].toLowerCase();
            var overrideRecord = "";
            if (args.length == 2) {
                overrideRecord = args[1];
            }

            var priorRecord = $.getIniDbString('streamRecords', "priorRecord", "0-0");
            var currentRecord = $.getIniDbString('streamRecords', "currentRecord", "0-0");
            
            var winCount = currentRecord.split("-")[0];
            var loseCount = currentRecord.split("-")[1];

            var newRecord = "";
            switch (action) {
                case "win":
                    winCount += 1;
                    newRecord = winCount + "-" + loseCount;
                    $.say("GG on that win! We're now " + newRecord + "!");
                break;

                case "loss":
                    loseCount += 1;
                    newRecord = winCount + "-" + loseCount;
                    $.say("Tough breaks on that loss! We're now " + newRecord + "!");
                break;

                case "undo":
                    newRecord = priorRecord;
                    $.say("Record change reverted. We're now " + newRecord + "!");
                break;

                case "set":
                    newRecord = overrideRecord;
                    $.say("Record override applied. We're now " + newRecord + "!");
                break;
                
                default:
                break;
            }

            if (newRecord.length > 0) {
                $.setIniDbString("streamRecords", "priorRecord", currentRecord);
                $.setIniDbString("streamRecords", "currentRecord", newRecord);
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./custom/recordApi.js')) {
            $.registerChatCommand('./custom/recordApi.js', 'record', 2);
        }
    });
})();

