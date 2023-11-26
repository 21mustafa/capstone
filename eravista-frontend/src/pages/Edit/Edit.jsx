import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TimelineContext } from "../../context/TimelineContext";
import "./Edit.scss";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";
import { useDropzone } from "react-dropzone";

function PhotoUploader(props) {
  const onDrop = useCallback((acceptedFiles) => {
    void saveFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const saveFiles = async (acceptedFiles) => {
    props.setPhotos(acceptedFiles);
  };

  return (
    <div {...getRootProps()} className="uploader">
      <input {...getInputProps()} />
      <span>
        Drop your images here or click here to select from your computer{" "}
      </span>
      <img src={props.src} />
    </div>
  );
}

function Edit() {
  const params = useParams();
  const navigate = useNavigate();
  const timeline = useContext(TimelineContext);
  const [event, setEvent] = useState(null);

  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [refList, setRefList] = useState([]);

  const [reference, setReference] = useState({});
  const [photos, setPhotos] = useState([]);

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
      setNotes(data.eventData.notes);
      setPhotos(data.eventData.images);
      // TODO delete this
      setEvent({
        ...data.eventData,
        refs,
        century: data.centuries.century,
        year: data.centuryEvents.year,
      });
      setReference({});
    }
  }, [timeline]);

  const getData = (overrideImages) => {
    for (let centuries of timeline) {
      for (let centuryEvents of centuries.events) {
        for (let eventData of centuryEvents.events) {
          if (params.id === eventData._id) {
            eventData.notes = notes;
            eventData.description = description;
            eventData.refs = refList;
            eventData.images = overrideImages ? overrideImages : photos;

            delete centuries["__v"];
            return centuries;
          }
        }
      }
    }
  };

  const saveImages = async (acceptedFiles) => {
    const formData = new FormData();

    for (let file of acceptedFiles) {
      formData.append("photos", file);
    }

    const response = await axios.post("/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { data: filenames } = response;
    const data = getData([...photos, ...filenames]);
    await axios.put("/", data);
    setPhotos((prevPhotos) => [...prevPhotos, ...filenames]);
  };

  const deleteImage = async (fileName) => {
    await axios.delete(`/image?fileName=${fileName}`);
    const filteredImages = [...photos].filter((photo) => photo !== fileName);
    const data = getData(filteredImages);
    await axios.put("/", data);
    setPhotos(filteredImages);
  };

  return event ? (
    <div className="edit">
      <button className="edit__close" onClick={() => navigate("/")}>
        <i class="fa-solid fa-x"></i>
      </button>
      <h1 className="edit__header">
        <span>{event.date}</span>
        <span className="edit__header-year">{event.year}</span>
      </h1>

      <div className="edit__short-description">{description}</div>

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

      <div className="edit_image">
        <div className="edit__label">Images</div>

        <div className="edit__image-upload">
          <PhotoUploader
            setPhotos={(images) => {
              saveImages(images);
            }}
          />
          <div className="edit__image-list-container">
            {photos &&
              photos.map((image) => {
                return (
                  <div className="edit__image-item">
                    <img
                      src={`http://127.0.0.1:8000/uploads/${image}`}
                      alt=""
                    />
                    <button onClick={() => deleteImage(image)}>
                      <i class="fa-solid fa-x"></i>
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="edit__ref">
        <div className="edit__label">References</div>
        <ol className="edit__ref-list">
          {refList.map((ref) => (
            <li className="edit__ref-item">
              <div className="edit__ref-item-content">
                <a
                  href={
                    ref.link
                      ? ref.link.includes("/wiki/")
                        ? `https://en.wikipedia.org/${ref.link}`
                        : ref.link
                      : undefined
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
