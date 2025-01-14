'use client';

import axios from 'axios';
import { useDebounce } from '../hooks/useDebounce';
import { useEffect, useState } from 'react';
import { Response, Stock } from './types';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Input,
  getKeyValue,
} from '@nextui-org/react';
import toast from 'react-hot-toast';

const serverUrl = 'http://localhost:3001';
export const instance = axios.create({
  baseURL: serverUrl,
});

const Stocks = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const firstPage = 1;
  const pauseBeforeRequestInMs = 1000;
  const [documentsPerPage, setDocumentsPerPage] = useState(0);
  const [countryFilter, setCountryFilter] = useState('');
  const [symbolFilter, setSymbolFilter] = useState('');

  const fetchStocks = async (country: string, symbol: string, page: number) => {
    try {
      const {
        data,
      }: {
        data: Response;
      } = await instance.get('/stock', {
        params: {
          country,
          symbol,
          page: page || 1,
        },
      });
      console.log(data);

      setStocks(data.data.stocks);
      setTotalPages(data.data.totalPages);
      setDocumentsPerPage(data.data.documentsPerPage);
      return;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          toast.error('API-requests limit exceeded, try in one minute again.');
        } else {
          toast.error(error.response?.data?.message || 'An error occurred');
        }
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  const handlePageChange = async (newPage: number) => {
    await fetchStocks(countryFilter, symbolFilter, newPage);
    setPage(newPage);
  };

  const handleCountryChange = (e: React.BaseSyntheticEvent) => {
    debouncedFiltersChange(e);
  };
  const handleSymbolChange = (e: React.BaseSyntheticEvent) => {
    debouncedFiltersChange(e);
  };
  const debouncedFiltersChange = useDebounce((e: React.BaseSyntheticEvent) => {
    setPage(firstPage);
    if (e.target.name === 'country') {
      setCountryFilter(e.target.value.trim());
      fetchStocks(e.target.value, symbolFilter, firstPage);
    } else {
      setSymbolFilter(e.target.value.trim());
      fetchStocks(countryFilter, e.target.value, firstPage);
    }
  }, pauseBeforeRequestInMs);

  useEffect(() => {
    fetchStocks(countryFilter, symbolFilter, firstPage);
  }, []);

  const inputStyles = [
    'px-[18px]',
    'rounded-[12px]',
    'text-[14px]',
    'border-[2px] border-solid border-[#A1A1AA]',
    'group-hover:bg-[#121212]',
  ];

  const headerColumns = [
    { name: '#', uid: 'id' },
    { name: 'Symbol', uid: 'symbol' },
    { name: 'Name', uid: 'name' },
    { name: 'Capitalization', uid: 'marketCap' },
    { name: 'Price', uid: 'price' },
    { name: 'Price change per day', uid: 'percentPerDay' },
    { name: 'Price change per month', uid: 'percentPerMonth' },
  ];
  let stockId = 0;
  let stockIndex = 0;

  return (
    <div>
      <Table
        removeWrapper
        selectionMode="single"
        aria-label="stocksTable"
        topContent={
          <div className="flex flex-col gap-[27px] mx-[auto] w-[282px] mt-[60px] mb-[80px]">
            <Input
              placeholder="Enter your country"
              onChange={handleCountryChange}
              size="sm"
              classNames={{
                inputWrapper: inputStyles,
              }}
              name="country"
            ></Input>
            <Input
              placeholder="Enter symbol or name"
              onChange={handleSymbolChange}
              size="sm"
              classNames={{
                inputWrapper: inputStyles,
              }}
              name="symbol"
            ></Input>
          </div>
        }
        bottomContent={
          <div className="flex w-full justify-center ">
            <Pagination
              isCompact
              showControls
              showShadow
              classNames={{
                cursor: 'shadow-lg',
                base: 'h-[72px] flex items-center',
              }}
              color="primary"
              total={totalPages}
              initialPage={firstPage}
              page={page}
              onChange={handlePageChange}
            />
          </div>
        }
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              className="text-center text-white text-[14px] font-normal"
              key={column.uid}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={'No rows to display.'} items={stocks}>
          {(item) => {
            stockIndex++; //didn't find how to pull index from this method, created my own index
            stockId = (page - 1) * documentsPerPage + stockIndex;
            item.id = stockId;
            return (
              <TableRow key={item._id}>
                {(columnKey) => {
                  const cellValue = getKeyValue(item, columnKey);
                  if (
                    columnKey === 'percentPerDay' ||
                    columnKey === 'percentPerMonth'
                  ) {
                    return (
                      <TableCell
                        className={`text-center text-[14px] ${cellValue >= 0 ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {cellValue + '%'}
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell className="text-center text-[14px]">
                        {cellValue}
                      </TableCell>
                    );
                  }
                }}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
};

export default Stocks;
