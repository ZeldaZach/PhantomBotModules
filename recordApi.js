/**
 * Handle Record Keeping
 */
(function() {
    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs();

        if (command.equalsIgnoreCase("record")) {
            var priorRecord = $.getIniDbString("streamRecords", "priorRecord", "0-0");
            var currentRecord = $.getIniDbString("streamRecords", "currentRecord", "0-0");

            var action = "";
            var overrideRecord = "";

            if (args.length == 0) {
                $.say("The current record is " + currentRecord);
                return;
            }

            if (args.length >= 1) {
                action = args[0].toLowerCase().trim();
            }

            if (args.length >= 2) {
                overrideRecord = args[1].toLowerCase().trim();
            }

            var winCount = parseInt(currentRecord.split("-")[0]);
            var lossCount = parseInt(currentRecord.split("-")[1]);

            var newRecord = "";

            if (action.equalsIgnoreCase("win")) {
                winCount += 1;
                newRecord = winCount + "-" + lossCount;
                $.say("GG on that win! We're now " + newRecord + "!");
            } else if (action.equalsIgnoreCase("loss") || action.equalsIgnoreCase("lose")) {
                lossCount += 1;
                newRecord = winCount + "-" + lossCount;
                $.say("Tough breaks on that loss! We're now " + newRecord + "!");
            } else if (action.equalsIgnoreCase("undo")) {
                newRecord = priorRecord;
                $.say("Record change reverted. We're really " + newRecord + "!");
            } else if (action.equalsIgnoreCase("set")) {
                newRecord = overrideRecord;
                $.say("Record override applied. We're now " + newRecord + "!");
            } else if (action.equalsIgnoreCase("reset")) {
                newRecord = "0-0";
                $.say("Record reset to" + newRecord + "!");
            } else {
                $.say("Default Case Hit: " + action);
                return;
            }

            $.setIniDbString("streamRecords", "priorRecord", currentRecord);
            $.setIniDbString("streamRecords", "currentRecord", newRecord);
            return;
        }
    });

    /**
     * @event initReady
     * !record
     * !record win
     * !record loss
     * !record lose
     * !record undo
     * !record set 0-0
     * !record reset
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled("./custom/recordApi.js")) {
            $.registerChatCommand("./custom/recordApi.js", "record", 7);

            $.registerChatSubcommand("record", "win", 2);
            $.registerChatSubcommand("record", "loss", 2);
            $.registerChatSubcommand("record", "lose", 2);
            $.registerChatSubcommand("record", "undo", 2);
            $.registerChatSubcommand("record", "set", 2);
            $.registerChatSubcommand("record", "reset", 2);
        } else {
            $.unregisterChatCommand("record");

            $.unregisterChatSubcommand("record", "win");
            $.unregisterChatSubcommand("record", "loss");
            $.unregisterChatSubcommand("record", "lose");
            $.unregisterChatSubcommand("record", "undo");
            $.unregisterChatSubcommand("record", "set");
            $.unregisterChatSubcommand("record", "reset");
        }
    });
})();