import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TimelineContext } from "../../context/TimelineContext";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Edit.scss";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";

function Edit() {
  const params = useParams();
  const navigate = useNavigate();
  const timeline = useContext(TimelineContext);
  const [event, setEvent] = useState(null);

  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  // const [videoURL, setVideoURL] = useState("");
  const [refList, setRefList] = useState([]);

  const [reference, setReference] = useState({});

  useEffect(() => {
    document.body.style.overflow = "scroll";
  }, []);

  const findTimeline = () => {
    for (let centuries of timeline) {
      for (let centuryEvents of centuries.events) {
        for (let eventData of centuryEvents.events) {
          if (params.id === eventData._id) {
            return {
              centuries,
              centuryEvents,
              eventData,
            };
          }
        }
      }
    }
  };

  useEffect(() => {
    const data = findTimeline();
    if (data) {
      const refs = data.eventData.refs.filter(
        (ref) => ref.link && !ref.link.includes("#cite_ref")
      );
      setDescription(data.eventData.description);
      setRefList(data.eventData.refs);
      // setVideoURL(data.eventData.videoURL);
      setNotes(data.eventData.notes);
      setEvent({
        ...data.eventData,
        refs,
        century: data.centuries.century,
        year: data.centuryEvents.year,
      });
      setReference({});
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

      <TextareaAutosize
        autoFocus
        className="edit__short-description"
        onChange={(event) => {
          const val = event.target.value;
          setDescription(val);
        }}
        value={description}
      />

      <div>
        <div className="edit__label">Notes</div>

        <TextareaAutosize
          autoFocus
          className="edit__long-description"
          onChange={(event) => {
            const val = event.target.value;
            setNotes(val);
          }}
          value={notes}
          placeholder={"..."}
        />
      </div>

      {/* <div className="edit__video">
        <label>
          <span className="edit__label">Video</span>

          <input
            autoFocus
            className="edit__video-url"
            onChange={(event) => {
              const val = event.target.value;
              setVideoURL(val);
            }}
            value={videoURL}
            placeholder={"Enter a video URL"}
          />
        </label>
        {videoURL && (
          <iframe
            src={videoURL}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        )}
      </div> */}

      <div className="edit__ref">
        <div className="edit__label">References</div>
        <ol className="edit__ref-list">
          {refList.map((ref) => (
            <li className="edit__ref-item">
              <div className="edit__ref-item-content">
                <a
                  href={
                    ref.link.includes("/wiki/")
                      ? `https://en.wikipedia.org/${ref.link}`
                      : ref.link
                  }
                >
                  {ref.name}
                </a>

                <button
                  className="edit__ref-delete"
                  onClick={() => {
                    const filteredList = [...refList].filter(
                      (refItem) =>
                        ref.name !== refItem.name && ref.link !== refItem.link
                    );
                    setRefList(filteredList);
                  }}
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </li>
          ))}
        </ol>

        <div className="edit__ref-new">
          <div className="edit__ref-new-fields">
            <label className="edit__ref-new-field">
              <span>Reference Title</span>
              <input
                placeholder="Enter a title"
                value={reference.name ? reference.name : ""}
                onChange={(e) =>
                  setReference({ ...reference, name: e.target.value })
                }
              />
            </label>
            <label className="edit__ref-new-field">
              <span>Reference URL</span>
              <input
                placeholder="Enter an URL"
                value={reference.link ? reference.link : ""}
                onChange={(e) =>
                  setReference({ ...reference, link: e.target.value })
                }
              />
            </label>
          </div>
          <button
            className="edit__ref-add"
            onClick={() => {
              setRefList([...refList, reference]);
              setReference({});
            }}
          >
            <span className="edit__ref-add-icon">+</span>Add Reference
          </button>
        </div>
      </div>

      <div className="edit__action">
        <button
          className="edit__action-button--main"
          onClick={async () => {
            const getData = () => {
              for (let centuries of timeline) {
                for (let centuryEvents of centuries.events) {
                  for (let eventData of centuryEvents.events) {
                    if (params.id === eventData._id) {
                      eventData.notes = notes;
                      eventData.description = description;
                      eventData.refs = refList;
                      // eventData.videoURL = videoURL;
                      return centuries;
                    }
                  }
                }
              }
            };

            const data = getData();
            await axios.put("/", data);
            navigate("/");
          }}
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
