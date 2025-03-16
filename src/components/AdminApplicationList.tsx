import { useQuery } from '@tanstack/react-query';
import { getMerchants } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdminApplicationList = () => {
  const { data: merchants, isLoading } = useQuery({
    queryKey: ['merchants'],
    queryFn: () => getMerchants(false),
  });

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {merchants?.map((merchant) => (
            <TableRow key={merchant.id}>
              <TableCell>{merchant.name}</TableCell>
              <TableCell>{merchant.email}</TableCell>
              <TableCell>{merchant.website}</TableCell>
              <TableCell>
                <Badge variant={merchant.is_approved ? "default" : "secondary"}>
                  {merchant.is_approved ? 'Approved' : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  {!merchant.is_approved && (
                    <Button size="sm" variant="default">
                      Approve
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminApplicationList;