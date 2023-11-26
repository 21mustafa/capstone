import "./Filter.scss";
import React, { useEffect, useState } from "react";

const FilterSection = (props) => {
  return (
    <div className="filter__section">
      <div className="filter__section-label">{props.label}</div>

      <div className="filter__section-list">
        {props.elements.map(({ label, value }) => {
          return (
            <div className="filter__section-item">
              <input
                type="radio"
                id={label}
                value={label}
                name={props.name}
                checked={props.checked === label}
                onChange={(e) => {
                  props.onChange(e.target.value);
                }}
              />
              <label for={label}>
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
    if (props.timeline && props.open) {
      setCenturyFilter(props.timeline[0]?.century);
      setYearFilter(props.timeline[0]?.events[0]?.year);
      setEventFilter(props.timeline[0]?.events[0]?.events[0].date);
    }
  }, [props.timeline, props.open]);

  useEffect(() => {
    if (eventFilter) {
      props.goToEvent(eventFilter);
    }
  }, [eventFilter]);
  return (
    <div className={`filter ${props.open ? "filter--open" : ""}`}>
      <FilterSection
        elements={
          props.timeline
            ? props.timeline.map((element) => ({ label: element.century }))
            : []
        }
        name={"century"}
        checked={centuryFilter}
        onChange={(value) => {
          setCenturyFilter(value);
          setYearFilter(
            props.timeline?.find((element) => element.century === value)
              .events[0]?.year
          );
          setEventFilter(
            props.timeline?.find((element) => element.century === value)
              .events[0].events[0].date
          );
        }}
        label="Select a cenutury"
      />

      {centuryFilter && (
        <FilterSection
          elements={
            props.timeline
              ? props.timeline
                  .find((element) => element.century === centuryFilter)
                  .events.map((element) => ({ label: element.year }))
              : []
          }
          name={"year"}
          checked={yearFilter}
          onChange={(value) => {
            setYearFilter(value);
            setEventFilter(
              props.timeline
                ?.find((element) => element.century === centuryFilter)
                .events?.find((element) => element.year === value).events[0]
                .date
            );
          }}
          label="Select a year"
        />
      )}

      {centuryFilter && yearFilter && (
        <FilterSection
          elements={
            props.timeline
              ? props.timeline
                  .find((element) => element.century === centuryFilter)
                  .events.find((element) => element.year === yearFilter)
                  .events.map((element) => ({
                    label: element.date,
                    value: element.description,
                  }))
              : []
          }
          name={"event"}
          checked={eventFilter}
          onChange={(value) => setEventFilter(value)}
          label={"Select an event"}
        />
      )}
    </div>
  );
}

export default Filter;
