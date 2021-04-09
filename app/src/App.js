import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Client from './Client';
import AddStarForm from './AddStar';
import SearchStarForm from './SearchStar';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
        Star Notary DAPP
            {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function App() {
    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    The magic has been started
                </Typography>
                <AddStarForm />
                <br/>
                <div>Search:</div>
                <SearchStarForm />
                <Copyright />
            </Box>
        </Container>
    );
}