import { app } from './app';

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server is running! => https://localhost:${process.env.PORT}/`),
);
