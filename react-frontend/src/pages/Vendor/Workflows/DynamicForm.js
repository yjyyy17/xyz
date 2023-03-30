import React from "react";
import ReactDOM from "react-dom";
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Button,
} from "../../../mui";

const DynamicForm = ({
  questions,
  handleAnswerChange,
  answerData,
  onSubmit,
}) => {
  const [selectedOthersDropdown, setSelectedOthersDropdown] =
    React.useState(null);
  const [selectedOthersRadio, setSelectedOthersRadio] = React.useState(null);

  // function to handle RadioGroup and Select input change
  const handleSelectChange = (event, question) => {
    const answer = event.target.value;
    handleAnswerChange(question.questionID, answer);

    // check if the question has "Others" option and is currently selected
    if (answer === "Others" && question.type === "Dropdown") {
      setSelectedOthersDropdown(question);
    } else {
      // clear answer for the question if "Others" is not selected
      if (
        selectedOthersDropdown &&
        selectedOthersDropdown.questionID === question.questionID
      ) {
        handleAnswerChange(selectedOthersDropdown.questionID, answer);
        setSelectedOthersDropdown(null);
      }
    }
  };

  const handleRadioChange = (event, question) => {
    const answer = event.target.value;
    handleAnswerChange(question.questionID, answer);

    // check if the question has "Others" option and is currently selected
    if (answer === "Others" && question.type === "Radio") {
      setSelectedOthersRadio(question);
    } else {
      // clear answer for the question if "Others" is not selected
      if (
        selectedOthersRadio &&
        selectedOthersRadio.questionID === question.questionID
      ) {
        handleAnswerChange(selectedOthersRadio.questionID, answer);
        setSelectedOthersRadio(null);
      }
    }
  };

  // function to handle TextField input change
  const handleTextFieldChange = (event, question) => {
    const answer = event.target.value;
    handleAnswerChange(question.questionID, answer);
  };

  // render RadioGroup component
  const renderRadioGroup = (question) => {
    return (
      <Box m={2} key={question.questionID}>
        <Typography>{question.label}</Typography>
        <RadioGroup
          aria-label={question.label}
          name={question.label}
          onChange={(event) => handleRadioChange(event, question)}
        >
          {question.options.split(",").map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
        {selectedOthersRadio &&
          selectedOthersRadio.questionID === question.questionID && (
            <Box m={2}>
              <Typography>Please specify:</Typography>
              <TextField
                fullWidth
                onChange={(event) => handleTextFieldChange(event, question)}
              />
            </Box>
          )}
      </Box>
    );
  };

  // render Select component
  const renderSelect = (question) => {
    const answer = answerData.find(
      (ans) => ans.questionID === question.questionID
    );
    const value = answer ? answer.answer : question.options.split(",")[0];

    return (
      <Box m={2} key={question.questionID}>
        <Typography>{question.label}</Typography>
        <Select
          value={
            selectedOthersDropdown
              ? "Others"
              : value
          }
          onChange={(event) => handleSelectChange(event, question)}
          fullWidth
        >
          {question.options.split(",").map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        {selectedOthersDropdown && selectedOthersDropdown.questionID === question.questionID && (
          <Box m={2}>
            <Typography>Please specify:</Typography>
            <TextField
              fullWidth
              onChange={(event) => handleTextFieldChange(event, question)}
            />
          </Box>
        )}
      </Box>
    );
  };

  // render Text Input component
  const renderTextInput = (question) => {
    return (
      <Box m={2} key={question.questionID}>
        <Typography>{question.label}</Typography>
        <TextField
          fullWidth
          onChange={(event) =>
            handleAnswerChange(question.questionID, event.target.value)
          }
        />
      </Box>
    );
  };

  // map through the questions array and render the appropriate component based on the question type
  const renderQuestion = (question) => {
    switch (question.type) {
      case "Radio":
        return renderRadioGroup(question);
      case "Dropdown":
        return renderSelect(question);
      default:
        return renderTextInput(question);
    }
  };

  return (
    <div>
      {questions
        .sort((a, b) => a.order - b.order)
        .map((question) => renderQuestion(question))}
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
};

export default DynamicForm;
