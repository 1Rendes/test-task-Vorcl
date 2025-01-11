'use client';

import axios from 'axios';
import { useDebounce } from '../hooks/useDebounce';

const serverUrl = 'http://localhost:3001';
export const instance = axios.create({
  baseURL: serverUrl,
});

const Stock = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { data } = await instance.get('/stock', {
      params: {
        country: formData.get('country'),
        symbol: formData.get('symbol'),
        page: formData.get('page'),
      },
    });
    console.log(
      'Submitted data:',
      formData.get('country'),
      formData.get('symbol'),
    );
    console.log(data);
  };
  const debouncedSubmit = useDebounce((form: HTMLFormElement) => {
    form.requestSubmit();
  }, 1500);

  const handleChangeAndSubmit = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const form = event.target.form;
    if (form) debouncedSubmit(form);
  };
  return (
    <div>
      Stock
      <form onSubmit={handleSubmit}>
        <input type="text" name="country" onChange={handleChangeAndSubmit} />
        <input type="text" name="symbol" onChange={handleChangeAndSubmit} />
        <input type="text" name="page" onChange={handleChangeAndSubmit} />
      </form>
    </div>
  );
};

export default Stock;
