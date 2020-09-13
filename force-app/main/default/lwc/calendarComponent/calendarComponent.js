import { LightningElement, wire } from 'lwc';
import FullCalendarResource from '@salesforce/resourceUrl/fullcalendar';
import fetchEvents from '@salesforce/apex/FullCalendarEventController.fetchEvents';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

export default class CalendarComponent extends LightningElement {

    fullCalendarInitialised = false;
    defaultEvents = [
        {
            title: 'Conference',
            start: '2020-09-14',
            end: '2020-09-15'
        },
        {
            title: 'Lunch',
            start: '2020-09-15T13:00:00',
            end: '2020-09-15T14:00:00'
        },
        {
            title: 'BBQ @ John\'s',
            start: '2020-09-17T18:00:00',
            end: '2020-09-17T22:30:00'
        },
        {
            title: 'Chiropractor appointment',
            start: '2020-09-18T07:00:00',
            end: '2020-09-18T07:30:00'
        }
    ];
    calendarOptions = {
        plugins: [ "timeGrid" ],
        header: false,
        defaultDate: '2020-09-14'
    };

    renderedCallback() {
        if (this.fullCalendarInitialised) return;
        this.fullCalendarInitialised = true;

        Promise.all([
            loadScript(this, FullCalendarResource + "/packages/core/main.js"),
            loadStyle(this, FullCalendarResource + "/packages/core/main.css")
        ])
        .then(() => {
            Promise.all([
                loadScript(this, FullCalendarResource + "/packages/daygrid/main.js"),
                loadScript(this, FullCalendarResource + "/packages/timegrid/main.js"),
                loadStyle(this, FullCalendarResource + "/packages/daygrid/main.css"),
                loadStyle(this, FullCalendarResource + "/packages/timegrid/main.css")
            ])
            .then(() => this.initCalendar(this.defaultEvents));
        })
        .catch(err => console.error({ message: "There was an error", err }));
    }

    initCalendar(events) {
        const ele = this.template.querySelector('div.fullcalendar');
        const calendar = new FullCalendar.Calendar(ele, { ...this.calendarOptions, events });
        calendar.render();
    }

    @wire(fetchEvents)
    getEvents(obj) {
        // Example of code if there were events data from Salesforce
        const { data } = obj;

        if (data && data.length < 0) {
            let events = data.map(event => (
                {
                    id: event.whoId,
                    title: event.Subject,
                    startDateTime: event.StartDateTime,
                    endDateTime: event.EndDateTime
                }
            ));

            this.initCalendar(events);
        } else {
            console.log('There was no data');
        }
    }
}