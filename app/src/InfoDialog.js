import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from "@material-ui/core/styles";
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
class InfotDialog extends React.Component {
    state = {
        open: false,
        title: 'title',
        description: 'description'
    };

    handleClickOpen = (title, description) => {
        const data = this.state;
        data.open = true;
        data.title = title;
        data.description = description;
        this.setState( data );
    };

    handleClose = () => {
        this.setState( {open:false} );    
    };

    render() {
        const data = this.state;
        return (<div>
            <Dialog
                open={data.open}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{data.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {data.description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>)
    }
}


export default withStyles(styles)(InfotDialog);