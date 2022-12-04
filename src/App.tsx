import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Container, Stack } from '@mui/system';
import { date, number, object, string } from 'yup';
import { useFormKit } from './form-kit/FormKit';
import { useForm } from './form-kit/useForm';

const testSchema = object({
  name: string().label('Name').required(),
  age: number().label('Age').required().positive().integer(),
  email: string()
    .label('Email')
    .meta({
      description: 'Your personal email.',
    })
    .required()
    .email(),
  website: string()
    .label('Website')
    .meta({
      description: 'Your personal website.',
      placeholder: 'https://my-site.com',
    })
    .notRequired()
    .url(),
  dob: date()
    .label('Date of Birth')
    .default(() => new Date('01 January 1990 00:00 UTC'))
    .required(),
  founded: date()
    .label('Founding Date')
    .meta({
      description: 'The date the residence was founded.',
    })
    .required(),
});

function App() {
  const form = useForm(
    testSchema,
    {
      name: 'John',
    },
    async (v) => {
      await delay(1000);
      console.log(v);
    },
    (error) => {
      console.error('Submission failed', error);
    }
  );
  const { FormKit } = useFormKit();

  return (
    <Container>
      <Stack gap={2}>
        <Typography variant="h2">Form Test</Typography>
        <Stack gap={2}>
          <Stack direction="row" gap={2}>
            <FormKit.Text {...form.fields.name} />
            <FormKit.Integer {...form.fields.age} />
          </Stack>
          <FormKit.Text {...form.fields.email} />
          <FormKit.Text {...form.fields.website} />
          <FormKit.Date {...form.fields.dob} />
          <FormKit.Date {...form.fields.founded} />
          <FormKit.SubmitButton {...form.submitButtonProps} />
        </Stack>

        <Stack gap={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            Debug
          </Typography>
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
                {JSON.stringify(form.state)}
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
                {JSON.stringify(form.errors)}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default App;
