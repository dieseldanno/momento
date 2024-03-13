const textInput = document.querySelector(".text-input");
const dateInput = document.querySelector(".date-input");
const startTimeInput = document.querySelector(".start-time-input");
const stopTimeInput = document.querySelector(".stop-time-input");
const addEventBtn = document.querySelector(".add-event-btn");
const eventsList = document.querySelector(".events-list");

// Get userId from localStorage
let userId = JSON.parse(localStorage.getItem("userOnline")).userId;

// Display events for current user
let events = JSON.parse(localStorage.getItem("events")) || [];

// Function for creating event
function createEvent(event) {
  let eventItem = document.createElement("div");
  eventItem.classList.add("event-item");
  eventItem.innerHTML = `
    <b><p>${event.eventDetail}</p></b>
    <p>Date: ${event.eventDate}</p>
    <p>Time: ${event.startTime} - ${event.stopTime}</p>
    <i class="fa-solid fa-trash-can delete-btn"></i>
  `;
  eventsList.appendChild(eventItem);
  eventsList.style.display = "block";

  // Trigger deleteBtn
  const deleteBtn = eventItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => deleteEvent(event, eventItem));
}

// Function for deleting
function deleteEvent(event, eventItem) {
  const eventIndex = events.findIndex(
    (e) =>
      e.userId === event.userId &&
      e.eventDate === event.eventDate &&
      e.startTime === event.startTime &&
      e.stopTime === event.stopTime
  );

  if (eventIndex !== -1) {
    events.splice(eventIndex, 1);

    eventItem.remove();
    localStorage.setItem("events", JSON.stringify(events));

    sortAndDisplayEvents(events);
  }
}

// Function for overlapping
function checkOverlap(newEvent) {
  const overlappingEvents = events.filter((event) => {
    return (
      event.userId === userId &&
      event.eventDate === newEvent.eventDate &&
      // If new event starts within or after existing event, but doesn't entirely cover it
      ((newEvent.startTime >= event.startTime &&
        newEvent.startTime < event.stopTime &&
        newEvent.stopTime > event.stopTime) ||
        // If new event stops within or before existing event, but doesn't entirely cover it
        (newEvent.stopTime > event.startTime &&
          newEvent.stopTime <= event.stopTime &&
          newEvent.startTime < event.startTime) ||
        // If new event entirely covers existing event
        (newEvent.startTime <= event.startTime &&
          newEvent.stopTime >= event.stopTime))
    );
  });

  return overlappingEvents.length > 0;
}
// Function for checking past events
function pastEvents(event) {
  const eventDate = new Date(event.eventDate);
  const currentDate = new Date();
  return eventDate < currentDate;
}

// Function for sorting
function sortAndDisplayEvents(events) {
  // Sort events based on date ascending
  const sortedEvents = events
    .filter((event) => event.userId === userId)
    .sort((event1, event2) => {
      const date1 = new Date(event1.eventDate);
      const date2 = new Date(event2.eventDate);

      // Compare dates, then time
      if (date1 < date2) {
        return -1; // Event 1 first
      } else if (date1 > date2) {
        return 1; // Event 2 first
      } else {
        // If same date, check time
        const time1 = new Date(`0001-01-01T${event1.startTime}`);
        const time2 = new Date(`0001-01-01T${event2.startTime}`);
        // Compare start times
        return time1 < time2 ? -1 : time1 > time2 ? 1 : 0;
      }
    });

  eventsList.innerHTML = "";

  // Display events
  sortedEvents.forEach((event) => {
    createEvent(event);

    if (pastEvents(event)) {
      const eventItem = eventsList.lastChild;
      eventItem.style.textDecoration = "line-through";
      eventItem.style.color = "grey";

      // Remove events from one week ago
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      if (new Date(event.eventDate) < oneWeekAgo) {
        eventItem.remove();
      }
    }
  });
}

addEventBtn.addEventListener("click", (event) => {
  event.preventDefault();

  let eventDetail = textInput.value.trim();
  let eventDate = dateInput.value;
  let startTime = startTimeInput.value;
  let stopTime = stopTimeInput.value;

  console.log("stored events: ", events);

  if (!eventDetail || !eventDate || !startTime || !stopTime) {
    alert("Please fill in all the fields");
    return;
  }

  let newEvent = {
    userId,
    eventDetail,
    eventDate,
    startTime,
    stopTime,
  };

  if (checkOverlap(newEvent)) {
    alert("You already have plans on that time, choose different time");
    return;
  }

  events.push(newEvent);
  localStorage.setItem("events", JSON.stringify(events));

  sortAndDisplayEvents(events);

  textInput.value = "";
  dateInput.value = "";
  startTimeInput.value = "";
  stopTimeInput.value = "";
});

sortAndDisplayEvents(events);

calendarBtn = document.querySelector(".calendar-desktop");
calendarModal = document.querySelector(".wrapper-calendar");
calendarBtn.addEventListener("click", () => {
  calendarModal.classList.add("open");
});

window.addEventListener("click", (event) => {
  if (event.target == calendarModal) {
    calendarModal.classList.remove("open");
  }
});
