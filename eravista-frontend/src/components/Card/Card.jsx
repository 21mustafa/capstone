import React, { useEffect, useState } from "react";
import "./Card.scss";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";

function Card(props) {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "scroll";
  }, []);

  const toggleDetail = async () => {
    props.setExtend((value) => !value);
  };

  const className = `card ${props.extend ? "extend" : ""} ${
    props.display ? "" : "collapse"
  } `;

  const refs = props.currentEvent?.refs?.filter(
    (ref) => ref.link && !ref.link.includes("#cite_ref")
  );

  const year = props.currentEvent?.year;

  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      <div className={`card__content ${props.extend ? "extend" : ""}`}>
        <div className={"card__label"}>
          {year?.includes("?") ? "???" : year}, {props.currentEvent?.date}{" "}
        </div>
        <div className={"card__detail"}>
          {props.currentEvent?.description}

          <div className="card__detail-video">
            <div className="card__detail-video-label">Learn More</div>
            <div className="card__detail-video-container">
              <iframe
                width={"100%"}
                height={"100%"}
                src="https://www.youtube.com/embed/OfggDiyTWug?si=kXd4wEZV2ZBT8vS1"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
          </div>
          {/* 
          <div className="card__detail-picture">
            <div className="card__detail-picture-label">View Photos</div>
            <div className="card__detail-picture-container">
              <Carousel showThumbs={false} width={"44rem"}>
                <div className="card__detail-picture-item">
                  <img src="https://picsum.photos/300/300" />
                </div>
                <div className="card__detail-picture-item">
                  <img src="https://picsum.photos/300/300" />
                </div>
                <div className="card__detail-picture-item">
                  <img src="https://picsum.photos/300/300" />
                </div>
                <div className="card__detail-picture-item">
                  <img src="https://picsum.photos/300/300" />
                </div>
                <div className="card__detail-picture-item">
                  <img src="https://picsum.photos/300/300" />
                </div>
              </Carousel>
            </div>
          </div> */}

          {refs && refs.length > 0 && (
            <div className="card__detail-refs">
              <div className="card__detail-refs-label">Read</div>
              <ul className="card__detail-refs-container">
                {refs.map((ref, i) => (
                  <li>
                    <a
                      href={
                        ref.link.includes("/wiki/")
                          ? `https://en.wikipedia.org/${ref.link}`
                          : ref.link
                      }
                      target="_blank"
                    >
                      {ref.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {props.extend && (
          <button
            className="card__edir"
            onClick={() => navigate(`/edit/${props.currentEvent.id}`)}
          >
            Edit
          </button>
        )}
      </div>
      <button
        className={"card__more-button"}
        onClick={(e) => {
          e.stopPropagation();
          void toggleDetail();
        }}
      >
        <i class="fa-solid fa-chevron-down"></i>
      </button>
    </div>
  );
}

export default Card;
