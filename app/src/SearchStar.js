import React from "react";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";

import FormHelperText from "@material-ui/core/FormHelperText";

import { withStyles } from "@material-ui/core/styles";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import InfoDialog from "./InfoDialog";


const styles = theme => ({
  cssLabel: {
    color: "white"
  },
  cssUnderline: {
    "&:after": {
      borderBottomColor: "white"
    }
  },
  cssFocused: {}
});

class SearchStarForm extends React.Component {
  state = {
    data: { starId: 0 }
  };

  idRef = React.createRef();
  dialog = React.createRef();

  handleValue = event => {
    const { data } = this.state;
    data[event.target.name] = event.target.value;
    this.setState({ data });
  };

  handleBlur = event => {
    const { name, value } = event.target;
    if (name === "starId") {
      // set true as second parameter to onBlur required validation
      this.idRef.current.validate(value);
    }
  };
  showInfo = (title, desc) => {
    this.dialog.current.handleClickOpen(title, desc);
  }
  handleSubmit = (event) => {
    event.preventDefault()

    try {
      window.Client.lookUp(this.state.data.starId)
        .then(resp => {
          this.showInfo('Search:', resp.name);
        })
        .catch(resp => {
          console.log(resp);
          this.showInfo('Search', resp.name);
        });

    } catch (e) {
      console.log(e);
      this.showInfo('Error', "Can't find star");
    }
    e.target.reset();
  };
  render() {
    const { classes } = this.props;

    const { data } = this.state;
    return (
      <ValidatorForm
        onSubmit={this.handleSubmit}
        instantValidate={false}
      >
        <div>
          <FormControl>
            <TextValidator
              ref={this.idRef}
              name="starId"
              label="Star id"
              value={data.starId}
              onBlur={this.handleBlur}
              onChange={this.handleValue}
              validators={["required", 'minNumber:0']}
              errorMessages={["star id is required", "Id should be positive integer"]}
            />
            <FormHelperText id="star-id-text">This is positive integer.</FormHelperText>
          </FormControl>
        </div>

        <Button type="submit" color="secondary" variant="contained">Look Up</Button>
        <InfoDialog ref={this.dialog} />
      </ValidatorForm>
    );
  }
}

export default withStyles(styles)(SearchStarForm);