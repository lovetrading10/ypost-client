import React, { useState, useEffect, useRef } from "react";
import ReactAudioPlayer from "react-audio-player";
import { useSelector } from "react-redux";
import { toggleReaction } from "../api/card";

import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/animation.css";
import styles from "./letter.module.css";
import CanvasDraw from "react-canvas-draw";
import canvas_styles from "../pages/write/write.module.css";

const randNum = (a, b) => {
  return Math.random() * (b - a) + a;
};

const MemoryLetter = ({ letterContent, status }) => {
  const userVal = useSelector((state) => state.state.userInfo);

  const [reactions, setReactions] = useState(null); // total reactions
  const [reactionToggle, setReactionToggle] = useState(false); // whether user has voted

  const drawing_ref = useRef(null);
  const [width, setWidth] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    if (drawing_ref && drawing_ref.current && letterContent.drawing) {
      drawing_ref.current.loadSaveData(letterContent.drawing);
    }
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }

    if (status === "public") {
      setReactions(letterContent.reactions);
      if (userVal.reactions.includes(letterContent._id)) {
        setReactionToggle(true);
      }
    }
  }, [letterContent, userVal]);

  // reaction toggler
  const reactionControl = async () => {
    if (reactionToggle === true) {
      // already voted
      setReactions(reactions - 1);
      setReactionToggle(false);
      await toggleReaction(letterContent._id, -1);
    } else {
      // increase
      setReactions(reactions + 1);
      setReactionToggle(true);
      await toggleReaction(letterContent._id, 1);
    }
  };

  // style={width > 500 ? rotateStyle : {}}

  if (!letterContent) return null;
  return (
    <div ref={ref} className="memoryCard fade-in">
      <div className="w-100 d-flex flex-row justify-content-between">
        <div className="body textMain">
          Dear {letterContent.recipient.split(" ")[0]},
        </div>
        {status === "public" && (
          <React.Fragment>
            {userVal.receivedCards.some(
              (card) => card["_id"] === letterContent._id
            ) ? (
              <div className={styles.statusFor}>For me</div>
            ) : userVal.sentCards.some(
                (card) => card["_id"] === letterContent._id
              ) ? (
              <div className={styles.statusFrom}>From me</div>
            ) : null}
          </React.Fragment>
        )}
      </div>
      <br />
      <div className="body textMain">{letterContent.message}</div>
      {letterContent.drawing &&
        JSON.parse(letterContent.drawing).lines.length > 0 && (
          <CanvasDraw
            ref={drawing_ref}
            lazyRadius={0}
            brushRadius={5}
            hideGrid={true}
            canvasWidth={"100%"}
            canvasHeight={200}
            className={canvas_styles.canvas}
            disabled={true}
          />
        )}
      {letterContent.audioUrl ? (
        <React.Fragment>
          <br />
          <ReactAudioPlayer src={letterContent.audioUrl} controls />
          <br />
        </React.Fragment>
      ) : null}
      <br />
      <div className="body textMain" style={{ textAlign: "right" }}>
        {letterContent.author ? letterContent.author : "Anonymous :)"}
      </div>
      {status === "public" && (
        <div className="w-100 d-flex flex-row justify-content-between mt-1">
          <div />
          <div
            className={`body textMain ${styles.reactionWrapper} ${
              reactionToggle ? styles.reactionTrue : styles.reactionFalse
            }`}
            onClick={() => reactionControl()}
          >
            {reactions === 0 ? null : (
              <React.Fragment>{reactions}</React.Fragment>
            )}
            <span style={{ opacity: reactions === 0 ? 0.7 : 1 }}>🧡</span>
          </div>
        </div>
      )}
      {letterContent.sticker && (
        <div style={{ display: "flex" }}>
          {letterContent.sticker.map((sticker) => (
            <span style={{ margin: "auto" }} key={sticker}>
              <img
                src={sticker}
                alt="sticker"
                width={Math.min(
                  150,
                  (width - 56 - letterContent.sticker.length * 20) /
                    letterContent.sticker.length
                )}
                className={styles.placedSticker}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryLetter;
