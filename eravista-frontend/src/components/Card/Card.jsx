import React, { useEffect, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import "./Card.scss";

function Card(props) {
  const [extend, setExtend] = useState(false);

  useEffect(() => {
    if (props.display) {
      setExtend(false);
    }
  }, [props.display]);

  const toggleDetail = async () => {
    setExtend((value) => !value);
  };

  const className = `card ${extend ? "extend" : ""} ${
    props.display ? "" : "collapse"
  } `;

  const refs = props.currentEvent?.refs;
  console.log(refs);
  return (
    <div className={className}>
      <div className={`card__content ${extend ? "extend" : ""}`}>
        <div className={"card__label"}>
          {props.currentEvent?.year}, {props.currentEvent?.date}{" "}
        </div>
        <div className={"card__detail"}>
          {props.currentEvent?.description}

          {refs &&
            refs
              .filter((ref) => !ref.link.includes("#cite_ref"))
              .map((ref, i) => (
                <a href={ref.link} target="_blank">
                  [{i + 1}]
                </a>
              ))}
        </div>
      </div>
      <button
        className={"card__more-button"}
        onClick={() => void toggleDetail()}
      >
        <i class="fa-solid fa-chevron-down"></i>
      </button>
    </div>
  );
}

export default Card;
