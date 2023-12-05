import React from "react";
import "./Card.scss";
import { useNavigate } from "react-router-dom";

function Card(props) {
  const navigate = useNavigate();

  const refs = props.currentEvent?.refs?.map((ref) =>
    ref
      ? ref.link && ref.link.includes("#cite_ref")
        ? {
            ...ref,
            link: undefined,
          }
        : ref
      : {
          ...ref,
          link: undefined,
        }
  );

  const year = props.currentEvent?.year;
  return (
    <div className={`card ${props.display ? "" : "collapse"} `}>
      <button
        className="card__edit"
        onClick={() => {
          navigate(`/edit/${props.currentEvent._id}`);
        }}
      >
        <i class="fa-solid fa-pen"></i>
        <span>Edit</span>
      </button>
      <div className={`card__content`}>
        <div className={"card__label"}>
          {year?.includes("?") ? "???" : year}, {props.currentEvent?.date}{" "}
        </div>
        <div className={"card__detail"}>
          {props.currentEvent?.description}

          <div className="card__detail-more">
            {refs && refs.length > 0 && (
              <div className="card__detail-refs">
                <div className="card__detail-refs-label">Read</div>
                <ul className="card__detail-refs-container">
                  {refs.map((ref, i) => (
                    <li>
                      <a
                        href={
                          ref.link
                            ? ref.link.includes("/wiki/")
                              ? `https://en.wikipedia.org/${ref.link}`
                              : ref.link
                            : undefined
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {ref.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
