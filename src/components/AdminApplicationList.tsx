import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMerchantApplications, updateMerchantApplicationStatus, approveMerchant } from '@/lib/api';
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
import { toast } from 'sonner';

const AdminApplicationList = () => {
  const queryClient = useQueryClient();
  
  const { data: applications, isLoading } = useQuery({
    queryKey: ['merchantApplications'],
    queryFn: getMerchantApplications,
  });

  const approveMutation = useMutation({
    mutationFn: async (applicationId: number) => {
      const application = applications?.find(app => app.id === applicationId);
      if (!application) throw new Error('Application not found');
      
      // Update application status
      await updateMerchantApplicationStatus(applicationId, 'approved');
      // Approve merchant
      await approveMerchant(application.merchant_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantApplications'] });
      toast.success('Merchant application approved successfully');
    },
    onError: (error) => {
      toast.error('Failed to approve merchant: ' + error.message);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (applicationId: number) => 
      updateMerchantApplicationStatus(applicationId, 'rejected'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantApplications'] });
      toast.success('Application rejected');
    },
    onError: (error) => {
      toast.error('Failed to reject application: ' + error.message);
    },
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
          {applications?.map((application) => (
            <TableRow key={application.id}>
              <TableCell>{application.merchant.name}</TableCell>
              <TableCell>{application.merchant.email}</TableCell>
              <TableCell>{application.merchant.website}</TableCell>
              <TableCell>
                <Badge variant={
                  application.status === 'approved' ? 'default' :
                  application.status === 'rejected' ? 'destructive' :
                  'secondary'
                }>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {application.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => approveMutation.mutate(application.id)}
                        disabled={approveMutation.isPending}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => rejectMutation.mutate(application.id)}
                        disabled={rejectMutation.isPending}
                      >
                        Reject
                      </Button>
                    </>
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