import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@weed-ui/table";

export default function Demo() {
  return (
    <div className="w-full max-w-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flight</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Gate</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>LH789</TableCell>
            <TableCell>EUR Europa 1</TableCell>
            <TableCell>Z23</TableCell>
            <TableCell className="text-wheat">Delayed</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>UA567</TableCell>
            <TableCell>NTK New Tokyo</TableCell>
            <TableCell>C8</TableCell>
            <TableCell className="text-sage">Departed</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>XX123</TableCell>
            <TableCell>KBA Kuiper Alpha</TableCell>
            <TableCell>22</TableCell>
            <TableCell className="text-ochre">On Time</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
