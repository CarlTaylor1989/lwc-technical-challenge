public with sharing class FullCalendarEventController {

    @AuraEnabled(cacheable=true)
    public static List<Event> fetchEvents() {
        return [SELECT WhoId, Subject, StartDateTime, EndDateTime FROM Event ORDER BY CreatedDate DESC];
    }
}