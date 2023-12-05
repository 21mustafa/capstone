import "./Filter.scss";
import React, { useEffect, useState } from "react";

const FilterSection = (props) => {
  return (
    <div className="filter__section">
      <div className="filter__section-label">{props.label}</div>

      <div className="filter__section-list">
        {props.elements?.map(({ id, label, value }) => {
          return (
            <div className="filter__section-item">
              <input
                type="radio"
                id={id}
                value={label}
                name={props.name}
                checked={props.checked?.id === id}
                onChange={() => {
                  props.onChange({
                    id,
                    value: label,
                  });
                }}
              />
              <label for={id}>
                {label.includes("?") ? "-" : label}{" "}
                {value && (
                  <span className="filter__section-item-label">{value}</span>
                )}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function Filter(props) {
  const [centuryFilter, setCenturyFilter] = useState();
  const [yearFilter, setYearFilter] = useState();
  const [eventFilter, setEventFilter] = useState();

  useEffect(() => {
    if (props.timeline && props.open && !eventFilter) {
      const century = props.timeline[0];
      setCenturyFilter({ id: century._id, value: century.century });

      const year = props.timeline[0]?.events[0];
      setYearFilter({ id: year._id, value: year.year });

      const date = props.timeline[0]?.events[0]?.events[0];
      setEventFilter({ id: date._id, value: date.date });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.timeline, props.open]);

  useEffect(() => {
    if (eventFilter && props.open) {
      props.goToEvent(eventFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventFilter, props.open]);

  return (
    <div className={`filter ${props.open ? "filter--open" : ""}`}>
      <div className="filter--desktop">
        <FilterSection
          elements={
            props.timeline
              ? props.timeline.map((element) => ({
                  id: element._id,
                  label: element.century,
                }))
              : []
          }
          name={"century"}
          checked={centuryFilter}
          onChange={({ id, value }) => {
            setCenturyFilter({ id, value });

            const year = props.timeline?.find(
              (element) => element.century === value
            ).events[0];
            setYearFilter({
              id: year._id,
              value: year.year,
            });

            const event = year.events[0];
            setEventFilter({ id: event._id, value: event.date });
          }}
          label="Select a cenutry"
        />

        {centuryFilter && (
          <FilterSection
            elements={
              props.timeline
                ? props.timeline
                    .find((element) => element._id === centuryFilter.id)
                    .events.map((element) => ({
                      label: element.year,
                      id: element._id,
                    }))
                : []
            }
            name={"year"}
            checked={yearFilter}
            onChange={({ id, value }) => {
              setYearFilter({ id, value });
              const event = props.timeline
                ?.find((element) => element._id === centuryFilter.id)
                .events?.find((element) => element._id === id).events[0];
              setEventFilter({
                id: event._id,
                value: event.date,
              });
            }}
            label="Select a year"
          />
        )}

        {centuryFilter && yearFilter && (
          <FilterSection
            elements={
              props.timeline
                ? props.timeline
                    .find((element) => element._id === centuryFilter.id)
                    ?.events.find((element) => element._id === yearFilter.id)
                    ?.events.map((element) => ({
                      id: element._id,
                      label: element.date,
                      value: element.description,
                    }))
                : []
            }
            name={"event"}
            checked={eventFilter}
            onChange={({ id, value }) => setEventFilter({ id, value })}
            label={"Select an event"}
          />
        )}
      </div>
      <div className="filter--mobile">
        <div className="filter__select">
          <label for="century-select" className="filter__select-label">
            <span>Select a century</span>
            <select
              name="century"
              id="century-select"
              onChange={(e) => {
                const centuryID = e.target.value;
                const century = props.timeline.find(
                  (century) => century._id === centuryID
                );
                setCenturyFilter({ id: centuryID, value: century.century });

                const year = century?.events[0];
                setYearFilter({ id: year._id, value: year.year });

                const event = year?.events[0];
                setEventFilter({ id: event._id, value: event.date });
              }}
            >
              {props.timeline?.map((century) => (
                <option
                  value={century._id}
                  selected={century._id === centuryFilter?.id}
                >
                  {century.century}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="filter__select">
          <label for="year-select">
            <span>Select a year</span>
            <select
              name="year"
              id="year-select"
              onChange={(e) => {
                const yearID = e.target.value;
                const year = props.timeline
                  .find((century) => century._id === centuryFilter.id)
                  .events.find((element) => element._id === yearID);
                setYearFilter({ id: yearID, value: year.year });

                const event = year?.events[0];
                setEventFilter({ id: event._id, value: event.date });
              }}
            >
              {props.timeline
                ?.find((element) => element._id === centuryFilter?.id)
                ?.events?.map((year) => (
                  <option
                    value={year._id}
                    selected={year._id === yearFilter?.id}
                  >
                    {year.year}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <div className="filter__select">
          <label for="event-select">
            <span>Select a event</span>
            <select
              name="event"
              id="event-select"
              onChange={(e) => {
                const eventID = e.target.value;
                const event = props.timeline
                  .find((century) => century._id === centuryFilter.id)
                  .events.find((element) => element._id === yearFilter.id)
                  .events.find((element) => element._id === eventID);
                setEventFilter({ id: event._id, value: event.date });
              }}
            >
              {props.timeline
                ?.find((element) => element._id === centuryFilter?.id)
                ?.events?.find((element) => element._id === yearFilter.id)
                ?.events?.map((event) => (
                  <option
                    value={event._id}
                    selected={event._id === eventFilter?.id}
                  >
                    {event.date ? event.date : "Event"}
                  </option>
                ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Filter;
