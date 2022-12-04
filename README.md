# Create a Form Kit in React Example

## Provide a Form UI Kit

```tsx
<FormKitProvider kit={MaterialFormKit}>
  <App />
</FormKitProvider>
```

## Create a Schema

```tsx
const schema = object({
  name: string().label('Name').required(),
  age: number().label('Age').required().positive().integer(),
  email: string()
    .label('Email')
    .meta({
      description: 'Your personal email.',
    })
    .required()
    .email(),
});
```

## Render Your Form in Your Layout of Choice

```tsx
function App() {
  const form = useForm(
    schema,
    {
      name: 'John',
    },
    async (v) => {
      console.log('Submitting...', v);
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
      </Stack>
    </Container>
  );
}
```

## Template Information

Created using this template: https://github.com/jsjoeio/react-ts-vitest-template
