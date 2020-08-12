import React, { useEffect, useContext } from "react";

import { Card } from "semantic-ui-react";
import { EventsContext } from "../../common/context/EventContext";
import EventCard from "./EventCard";
import Axios from "axios";

const Events = (props) => {
  const { eventInfo, setEventInfo } = useContext(EventsContext);

  const url =
    "https://www.eventbriteapi.com/v3/organizations/464741062423/events/?token=2SWITQPH72SPNCSRK7OW";

  useEffect(() => {
    console.log("effective currently");
    Axios.get(url, {})
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        console.log(data);
        setEventInfo(data);
        console.log();
      })
      .catch((e) => {
        console.log(e);
      });
  }, [setEventInfo]);

  return (
    <div>
      <Card.Group itemsPerRow={3}>
        {eventInfo.events === undefined
          ? null
          : eventInfo.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
      </Card.Group>
    </div>
  );
};

export default Events;
