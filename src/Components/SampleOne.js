import React, { useEffect, useState } from "react";
import OT from "@opentok/client";

const SampleOne = () => {
  const apiKey = "";
  const sessionId = "";
  const token = "";

  const handleError = (error) => {
    if (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  useEffect(() => {
    const initializeSession = () => {
      const session = OT.initSession(apiKey, sessionId);

      session.on("streamCreated", (event) => {
        session.subscribe(
          event.stream,

          "subscriber",

          {
            insertMode: "append",

            width: "100%",

            height: "100%",
          },

          handleError
        );
      });

      session.on("videoElementCreated", (event) => {
        const videoElement = event.element;

        videoElement.removeAttribute("autoplay");

        videoElement.addEventListener("loadedmetadata", () => {
          videoElement.play().catch((error) => {
            console.error("Failed to autoplay video", error);
          });
        });

        videoElement.addEventListener("ended", () => {
          session.disconnect();

          setTimeout(() => {
            initializeSession();
          }, 5000);
        });

        const videoContainer = document.createElement("div");

        videoContainer.appendChild(videoElement);

        document.getElementById("videos").appendChild(videoContainer);
      });

      session.connect(token, handleError);
    };

    initializeSession();
  }, []);

  return (
    <div id="videos">
      <div id="subscriber" style={{ width: "100%", height: "100vh" }}></div>
    </div>
  );
};

export default SampleOne;
