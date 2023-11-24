import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TimelineContext } from "../../context/TimelineContext";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Edit.scss";

function Edit() {
  const params = useParams();
  const navigate = useNavigate();
  const timeline = useContext(TimelineContext);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "scroll";
  }, []);

  useEffect(() => {
    let found = false;
    for (let centuries of timeline) {
      for (let centuryEvents of centuries.events) {
        for (let eventData of centuryEvents.events) {
          if (params.id === eventData.id) {
            found = true;
            const refs = eventData.refs.filter(
              (ref) => ref.link && !ref.link.includes("#cite_ref")
            );
            setEvent({
              ...eventData,
              refs,
              century: centuries.century,
              year: centuryEvents.year,
            });
          }
          if (found) break;
        }
        if (found) break;
      }
      if (found) break;
    }
  }, [timeline]);

  return event ? (
    <div className="edit">
      <button className="edit__close" onClick={() => navigate("/")}>
        <i class="fa-solid fa-x"></i>
      </button>
      <h1 className="edit__header">
        <span>{event.date}</span>
        <span className="edit__header-year">{event.year}</span>
      </h1>
      <div className="edit__short-description" role="textbox" contenteditable>
        {event.description}
      </div>

      <div>
        <div className="edit__label">Notes</div>
        <div className="edit__long-description" role="textbox" contenteditable>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla odit
          esse quas autem voluptate omnis animi incidunt? Aliquam quaerat quos
          incidunt deserunt adipisci laborum, impedit asperiores. Odio debitis
          ratione impedit. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Earum obcaecati temporibus ea est soluta neque at illo nam
          provident vitae dolores optio, eveniet iusto corrupti? Placeat ratione
          recusandae at officiis! Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. At blanditiis voluptates cum aut, hic ipsum magni
          sit dolorem, ullam, labore dicta laborum debitis dolorum quaerat sint
          id iusto molestias esse? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Perspiciatis obcaecati similique dolor nihil tempore
          expedita esse nam, in beatae consectetur. Odio veniam sapiente amet
          voluptatum fugiat quam a commodi fuga.
        </div>
      </div>

      <div className="edit__video">
        <label>
          <span className="edit__label">Video</span>
          <input
            className="edit__video-url"
            type="text"
            value="https://www.youtube.com/embed/OfggDiyTWug?si=kXd4wEZV2ZBT8vS1"
          />
        </label>

        <iframe
          src="https://www.youtube.com/embed/OfggDiyTWug?si=kXd4wEZV2ZBT8vS1"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      <div className="edit__ref">
        <div className="edit__label">References</div>
        <ol className="edit__ref-list">
          {event.refs.map((ref) => (
            <li className="edit__ref-item">
              <a
                href={
                  ref.link.includes("/wiki/")
                    ? `https://en.wikipedia.org/${ref.link}`
                    : ref.link
                }
              >
                {ref.name}
              </a>
            </li>
          ))}
        </ol>

        <div className="edit__ref-new">
          <div className="edit__ref-new-fields">
            <label className="edit__ref-new-field">
              <span>Reference Title</span>
              <input placeholder="Enter a title" />
            </label>
            <label className="edit__ref-new-field">
              <span>Reference URL</span>
              <input placeholder="Enter an URL" />
            </label>
          </div>
          <button className="edit__ref-add" onClick={() => {}}>
            <span className="edit__ref-add-icon">+</span>Add Reference
          </button>
        </div>
      </div>

      <div className="edit__action">
        <button
          className="edit__action-button--main"
          onClick={() => navigate("/")}
        >
          Save
        </button>
        <button className="edit__action-button" onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div>Loading</div>
  );
}

export default Edit;
