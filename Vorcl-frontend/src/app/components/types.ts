import { Dispatch, SetStateAction } from 'react';

export type Stock = {
  id: number;
  symbol: string;
  name: string;
  marketCap: number;
  country: string;
  updatedAt: string;
  createdAt: string;
  _id: string;
};

export interface TableComponentProps {
  stocks: Stock[];
  page: number;
  documentsPerPage: number;
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
}

type Data = {
  stocks: Stock[];
  totalPages: number;
  page: number;
  documentsPerPage: number;
};

export type Response = { status: number; message: string; data: Data };
