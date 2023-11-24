import wiki from "wikijs";
import { parse } from "node-html-parser";
import { v4 as uuidv4 } from "uuid";

const parseHtml = async () => {
  const pageInfo = await wiki().page("Timeline_of_Canadian_history");
  const html = await pageInfo.html();

  return parse(html);
};

const parseCenturyPage = (root) => {
  const centuryMoreInfo = root.querySelectorAll('[role="note"]');

  const links = [];

  for (let info of centuryMoreInfo) {
    const link = info.getElementsByTagName("a")[0];
    if (link) {
      const title = link.getAttribute("title");
      if (title.includes("century")) {
        links.push({
          century: link.getAttribute("title"),
          link: link.getAttribute("href"),
        });
      }
    }
  }

  return links;
};

const removeLinkIdentifier = (text) => {
  return text.replace(/[0-9]*&#[0-9]+;/g, "");
};

const removeNewLineIdentifier = (text) => {
  return text.replaceAll(/\n/g, "");
};

const getReferenceLinks = (refElement, eventElement, root) => {
  const linkNodes = [];
  if (refElement) {
    linkNodes.push(...refElement.getElementsByTagName("sup"));
  }
  if (eventElement) {
    linkNodes.push(...eventElement.getElementsByTagName("sup"));
  }

  const refs = [];

  if (linkNodes.length > 0) {
    for (let linkNode of linkNodes) {
      const idNode = linkNode.getElementsByTagName("a")[0];
      if (idNode) {
        const id = idNode.getAttribute("href");
        const citeElement = root.getElementById(id.replace("#", ""));
        if (citeElement) {
          const citeNode = citeElement.getElementsByTagName("cite")[0];
          if (citeNode) {
            const citeText = removeLinkIdentifier(citeNode.innerText);
            const citeLinkNode = citeNode.getElementsByTagName("a")[0];
            let citeLink;
            if (citeLinkNode) {
              citeLink = citeLinkNode.getAttribute("href");
            }
            refs.push({
              name: citeText,
              link: citeLink,
            });
          } else {
            const citeText = removeLinkIdentifier(citeElement.innerText);
            const citeLinkNode = citeElement.getElementsByTagName("a")[0];
            let citeLink;
            if (citeLinkNode) {
              citeLink = citeLinkNode.getAttribute("href");
            }
            refs.push({
              name: citeText,
              link: citeLink,
            });
          }
        }
      }
    }
  }

  return refs;
};

export const parseTimeline = async () => {
  const timeline = [];
  const root = await parseHtml();

  const centuryLinks = parseCenturyPage(root);

  const tables = root.querySelectorAll("table.wikitable");
  const labels = root
    .querySelectorAll("h2")
    .filter(
      (element) =>
        element.innerText.includes("century") ||
        element.innerText.includes("Prehistory")
    );

  const centuryElementsCount = labels.length;

  // Prehistory, nth century...
  for (let i = 0; i < centuryElementsCount; i++) {
    const table = tables[i];
    const century = labels[i].innerText.replace("[edit]", "");

    const tableRows = table.getElementsByTagName("tr");
    let yearElement;
    let dateElement;
    let eventElement;
    let refElement;
    let spanCount;

    const events = [];

    for (let tableRow of tableRows) {
      const tableData = tableRow.getElementsByTagName("td");
      if (tableData.length > 0 && tableData[0].getAttribute("rowspan")) {
        spanCount = +tableData[0].getAttribute("rowspan");
      }

      if (tableData && tableData.length > 0) {
        if (tableData.length === 4) {
          yearElement = tableData[0];
          dateElement = tableData[1];
          eventElement = tableData[2];
          refElement = tableData[3];
        } else {
          if (spanCount > 0) {
            dateElement = tableData[0];
            eventElement = tableData[1];
            refElement = tableData[2];
          } else {
            yearElement = tableData[0];
            dateElement = tableData[1];
            eventElement = tableData[2];
          }
        }

        const year = removeNewLineIdentifier(yearElement.innerText);
        const date = removeNewLineIdentifier(dateElement.innerText);
        const event = removeNewLineIdentifier(
          removeLinkIdentifier(eventElement.innerText)
        );

        // get references from ref column
        const refs = getReferenceLinks(refElement, eventElement, root);

        events.push({
          year,
          date,
          event,
          refs,
        });
      }

      spanCount && (spanCount -= 1);
    }

    const centuryLink = centuryLinks.find((element) =>
      element.century.toLowerCase().includes(century.toLowerCase())
    );

    const finalEvents = [];
    const revertEvents = events.reverse();
    let yearIndex = 0;
    let eventIndex = 0;
    for (let event of revertEvents) {
      const obj = finalEvents.find((item) => item.year === event.year);

      if (obj) {
        finalEvents
          .find((item) => item.year === event.year)
          .events.push({
            description: event.event,
            refs: event.refs,
            date: event.date,
            index: eventIndex,
          });
        eventIndex++;
      } else {
        const eventObj = {
          year: event.year ? event.year : `?${event.date}`,
          events: [
            {
              description: event.event,
              refs: event.refs,
              date: event.date,
              videoURL: "",
              notes: "",
              index: 0,
            },
          ],
          index: yearIndex,
        };
        finalEvents.push(eventObj);
      }
    }

    timeline.push({
      century,
      links: centuryLink?.link,
      events: finalEvents,
      index: i,
    });
  }

  return timeline.reverse();
};
