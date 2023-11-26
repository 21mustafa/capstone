import "./Filter.scss";
import React, { useEffect, useState } from "react";

const FilterSection = (props) => {
  return (
    <div className="filter__section">
      <div className="filter__section-label">{props.label}</div>

      <div className="filter__section-list">
        {props.elements.map(({ id, label, value }) => {
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
  }, [props.timeline, props.open]);

  useEffect(() => {
    if (eventFilter && props.open) {
      props.goToEvent(eventFilter);
    }
  }, [eventFilter, props.open]);

  return (
    <div className={`filter ${props.open ? "filter--open" : ""}`}>
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

          const event = props.timeline?.find(
            (element) => element.century === value
          ).events[0].events[0];
          setEventFilter({ id: event._id, value: event.date });
        }}
        label="Select a cenutury"
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
                  .events.find((element) => element._id === yearFilter.id)
                  .events.map((element) => ({
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
  );
}

export default Filter;
