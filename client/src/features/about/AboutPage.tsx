import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import agent from "../../app/api/agent";
import { useState } from "react";

//Page for testing error handling
export default function AboutPage() {

    const [validationErrors, setValidationErrors] = useState<string[]>([])

    function getValidationEror() {
        agent.TestErrors.getValidationError().then(() => console.log('shouldnt see this')).catch(error => setValidationErrors(error));
    }

    return (
        <Container>
            <Typography gutterBottom variant="h2">
                Errors For Test
            </Typography>
            <ButtonGroup>
                <Button variant='contained' onClick={() => agent.TestErrors.get400Error().catch(error => console.log(error))}>get400Error </Button>
                <Button variant='contained' onClick={() => agent.TestErrors.get401Error().catch(error => console.log(error))}>get401Error </Button>
                <Button variant='contained' onClick={() => agent.TestErrors.get404Error().catch(error => console.log(error))}>get404Error </Button>
                <Button variant='contained' onClick={() => agent.TestErrors.get500Error().catch(error => console.log(error))}> get500Error</Button>
                <Button variant='contained' onClick={getValidationEror}>getValidationError </Button>
            </ButtonGroup>
            {validationErrors.length > 0 &&
                <Alert severity='error'>
                    <AlertTitle>Validation Errors</AlertTitle>
                    <List>
                        {validationErrors.map(error => (
                            <ListItem key={error}>
                                <ListItemText>{error}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Alert>}
        </Container>

    )

}