import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (<Container component={Paper} sx={{ height: 400 }}>

        <Typography align='center' gutterBottom variant='h3'> The thing you are searching is not there.</Typography>
        <Divider></Divider>
        <Button fullWidth component={Link} to='/catalog'>Go Back To Store</Button>
    </Container>)
}