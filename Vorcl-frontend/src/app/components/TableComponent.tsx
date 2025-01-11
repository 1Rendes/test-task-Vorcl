import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/table';
import { TableComponentProps } from './types';

const TableComponent: React.FC<TableComponentProps> = ({
  stocks,
  page,
  documentsPerPage,
}) => {
  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>#</TableColumn>
        <TableColumn>Symbol</TableColumn>
        <TableColumn>Name</TableColumn>
        <TableColumn>Capitalization</TableColumn>
        <TableColumn>Price</TableColumn>
        <TableColumn>Price change per day</TableColumn>
        <TableColumn>Price change per month</TableColumn>
      </TableHeader>
      <TableBody>
        {stocks.map(({ symbol, name, marketCap }, i) => (
          <TableRow key={i}>
            <TableCell>{(page - 1) * documentsPerPage + i + 1}</TableCell>
            <TableCell>{symbol}</TableCell>
            <TableCell>{name}</TableCell>
            <TableCell>{marketCap}</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
