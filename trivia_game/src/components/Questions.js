import React, { useEffect, useState, useContext } from "react";
import { myContext } from "../context/GlobalContext";
import Loader from "../utils/Loader";
import Shimmer from "../utils/Shimmer";

const Questions = ({
  loadingStatus,
  changeLoadig,
  disableAndEnableButton,
  setNextButtonDisable,
  selectedCategory,
}) => {
  const { data, dispatch, fetchData } = useContext(myContext);
  const {
    incorrect_answers = [],
    correct_answer = "",
    question = "",
    category = "",
  } = data?.result || {};
  const [optionSelected, setOptionSelected] = useState({
    isSelected: false,
    selectedAnswer: "",
  });
  const [suffledOption, setSuffledOption] = useState([]);

  const shuffleArray = (array) => {
    const shuffledArray = [...array, correct_answer];

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledArray[i];
      shuffledArray[i] = shuffledArray[j];
      shuffledArray[j] = temp;
    }
    setSuffledOption(shuffledArray);
  };

  const handleAnswerClick = (valueSelected) => {
    setOptionSelected((prevState) => ({
      ...prevState,
      isSelected: true,
      selectedAnswer: valueSelected,
    }));
    valueSelected === correct_answer
      ? dispatch({ type: "correct" })
      : dispatch({ type: "incorrect" });
    setNextButtonDisable(false);
  };

  useEffect(() => {
    const fetchDataWrapper = async () => {
      changeLoadig(true);
      await fetchData(selectedCategory);
      changeLoadig(false);

      shuffleArray(incorrect_answers);
      setOptionSelected({ isSelected: false, selectedAnswer: "" });
    };
    fetchDataWrapper();
  }, [selectedCategory]);

  useEffect(() => {
    if (data?.result) {
      disableAndEnableButton();
      shuffleArray(incorrect_answers);
      setOptionSelected({ isSelected: false, selectedAnswer: "" });
    }
    setNextButtonDisable(true);
  }, [data]);

  const optionToShow = loadingStatus ? (
    <Shimmer />
  ) : data?.result ? (
    suffledOption.map((option, index) => (
      <div key={"optn" + index} className="answer-container">
        <p
          className={
            optionSelected.isSelected
              ? option === correct_answer
                ? "answer correct disabled-paragraph"
                : "answer incorrect disabled-paragraph"
              : "answer"
          }
          onClick={() => handleAnswerClick(option)}
          dangerouslySetInnerHTML={{
            __html: `${option}
                  ${
                    optionSelected.isSelected &&
                    optionSelected.selectedAnswer === option
                      ? `<span class="answer-status">${
                          option === correct_answer ? "✔" : "✘"
                        }</span>`
                      : ""
                  }`,
          }}
        ></p>
      </div>
    ))
  ) : (
    <div className="no-question-container">
      <p className="no-question-message">
        No question available. <br /> Click "Restart" or "Skip" to start the
        game.
      </p>
    </div>
  );

  return (
    <div className="container twidth make-flex">
      <p id="category" className="category-text">
        Category: {category}
      </p>
      <p
        id="question"
        className="question-text"
        dangerouslySetInnerHTML={{
          __html: loadingStatus ? "Loading..." : question,
        }}
      ></p>
      <div className="optnContainer make-flex">{optionToShow}</div>
    </div>
  );
};

export default Questions;
