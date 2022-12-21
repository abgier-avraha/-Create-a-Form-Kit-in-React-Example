import { person } from '@jsonforms/examples';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Card, CardContent, Container, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { ErrorObject } from 'ajv';
import { useState } from 'react';

const { schema, uischema, data: initialData } = person;

// TODO: replace all material ui elements in node_modules/@jsonforms/material-renderers with react-native-paper

// TODO: how to make a form creator where you can
// - Select a widget to drag and drop
// - Edit the title
// - Edit the description
// - Decide the UI Schema for an element ref

function App() {
  const [data, setData] = useState<object>(initialData);
  const [errors, setErrors] = useState<ErrorObject[] | undefined>();

  return (
    <Container>
      <Stack gap={4}>
        <Typography variant="h4">JSON Forms Test</Typography>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={data}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ data, errors }) => {
            setData(data);
            setErrors(errors);
          }}
        />

        <Stack gap={2}>
          <Typography variant="h5">Debug</Typography>
          <Card>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Value
              </Typography>
              <Typography fontFamily="courier" variant="subtitle1">
                {JSON.stringify(data)}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Errors
              </Typography>
              <Typography fontFamily="courier" variant="subtitle1">
                {JSON.stringify(errors)}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Schema
              </Typography>
              <Typography fontFamily="courier" variant="subtitle1">
                {JSON.stringify(schema)}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                UI Schema
              </Typography>
              <Typography fontFamily="courier" variant="subtitle1">
                {JSON.stringify(uischema)}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
}
export default App;
