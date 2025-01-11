'use client';

import axios from 'axios';
import { useDebounce } from '../hooks/useDebounce';
import TableComponent from './TableComponent';
import { useState } from 'react';
import { Response, Stock } from './types';

const serverUrl = 'http://localhost:3001';
export const instance = axios.create({
  baseURL: serverUrl,
});

const Stocks = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [documentsPerPage, setDocumentsPerPage] = useState<number>(0);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const {
      data,
    }: {
      data: Response;
    } = await instance.get('/stock', {
      params: {
        country: formData.get('country'),
        symbol: formData.get('symbol'),
        page: formData.get('page') || 1,
      },
    });
    console.log(
      'Submitted data:',
      formData.get('country'),
      formData.get('symbol'),
      formData.get('page'),
    );
    console.log(data);
    setStocks(data.data.stocks);
    setTotalPages(data.data.totalPages);
    setPage(data.data.page);
    setDocumentsPerPage(data.data.documentsPerPage);
    return;
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
      <form onSubmit={handleSubmit}>
        <input type="text" name="country" onChange={handleChangeAndSubmit} />
        <input type="text" name="symbol" onChange={handleChangeAndSubmit} />
        <input type="text" name="page" onChange={handleChangeAndSubmit} />
      </form>
      <TableComponent
        page={page}
        stocks={stocks}
        documentsPerPage={documentsPerPage}
      />
    </div>
  );
};

export default Stocks;
