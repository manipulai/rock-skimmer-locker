import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMerchantApplications, updateMerchantApplicationStatus } from '@/lib/api';
import type { MerchantAdmin } from '@/types/database';
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
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const AdminApplicationList = forwardRef((props, ref) => {
  const queryClient = useQueryClient();
  
  const { data: applications, isLoading, error, refetch } = useQuery<MerchantAdmin[]>({
    queryKey: ['merchantApplications'],
    queryFn: async () => {
      try {
        const data = await getMerchantApplications();
        console.log('Raw data from getMerchantApplications:', data);
        
        if (!data || data.length === 0) {
          console.log('No applications found');
          return [];
        }
        
        const mappedData = (data as any[]).map(app => ({
          id: app.id,
          status: app.status,
          notes: app.notes,
          created_at: app.created_at,
          merchant_application_id: app.merchant_application_id,
          rock_id: app.rock_id,
          merchant: {
            id: app.merchant.id,
            name: app.merchant.name,
            email: app.merchant.email,
            website: app.merchant.website,
            is_approved: app.merchant.is_approved,
            created_at: app.merchant.created_at
          }
        }));
        
        console.log('Mapped data:', mappedData);
        return mappedData as MerchantAdmin[];
      } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }
    },
    // Disable automatic fetching - only fetch when explicitly triggered
    enabled: false,
    refetchOnWindowFocus: false,
    staleTime: 0
  });

  // Expose the refetch function to the parent component
  useImperativeHandle(ref, () => ({
    refetch: async () => {
      console.log('Refetching merchant applications from parent component');
      return refetch();
    }
  }));

  // State to track local application status changes
  const [localApplicationStatus, setLocalApplicationStatus] = useState<Record<number, string>>({});
  
  const approveMutation = useMutation({
    mutationFn: async (applicationId: number) => {
      try {
        console.log('Approving application:', applicationId);
        await updateMerchantApplicationStatus(applicationId, 'approved');
        // Update local status immediately
        setLocalApplicationStatus(prev => ({
          ...prev,
          [applicationId]: 'approved'
        }));
      } catch (error) {
        console.error('Error in approveMutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantApplications'] });
      queryClient.invalidateQueries({ queryKey: ['rocks'] }); // Also invalidate rocks query
      toast.success('Merchant application approved successfully');
    },
    onError: (error: unknown) => {
      console.error('Approve mutation error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error('Failed to approve merchant: ' + errorMessage);
    },
  });

  const unapproveMutation = useMutation({
    mutationFn: async (applicationId: number) => {
      try {
        console.log('Unapproving application:', applicationId);
        await updateMerchantApplicationStatus(applicationId, 'pending');
        // Update local status immediately
        setLocalApplicationStatus(prev => ({
          ...prev,
          [applicationId]: 'pending'
        }));
      } catch (error) {
        console.error('Error in unapproveMutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantApplications'] });
      queryClient.invalidateQueries({ queryKey: ['rocks'] }); // Also invalidate rocks query
      toast.success('Merchant application unapproved successfully');
    },
    onError: (error: unknown) => {
      console.error('Unapprove mutation error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error('Failed to unapprove merchant: ' + errorMessage);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (applicationId: number) => {
      try {
        console.log('Rejecting application:', applicationId);
        await updateMerchantApplicationStatus(applicationId, 'rejected');
        // Update local status immediately
        setLocalApplicationStatus(prev => ({
          ...prev,
          [applicationId]: 'rejected'
        }));
      } catch (error) {
        console.error('Error in rejectMutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantApplications'] });
      queryClient.invalidateQueries({ queryKey: ['rocks'] }); // Also invalidate rocks query
      toast.success('Application rejected');
    },
    onError: (error: unknown) => {
      console.error('Reject mutation error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error('Failed to reject application: ' + errorMessage);
    },
  });

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
    return <div>Error loading applications: {(error as Error).message}</div>;
  }

  if (!applications || applications.length === 0) {
    return <div>No merchant applications found.</div>;
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
                {/* Use local status if available, otherwise use the fetched status */}
                <Badge variant={
                  (localApplicationStatus[application.id] || application.status) === 'approved' ? 'default' :
                  (localApplicationStatus[application.id] || application.status) === 'rejected' ? 'destructive' :
                  'secondary'
                }>
                  {((localApplicationStatus[application.id] || application.status).charAt(0).toUpperCase() + 
                    (localApplicationStatus[application.id] || application.status).slice(1))}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {/* Use local status for conditional rendering */}
                  {(localApplicationStatus[application.id] || application.status) === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => approveMutation.mutate(application.id)}
                        disabled={approveMutation.isPending}
                      >
                        {approveMutation.isPending ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => rejectMutation.mutate(application.id)}
                        disabled={rejectMutation.isPending}
                      >
                        {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                      </Button>
                    </>
                  )}
                  {(localApplicationStatus[application.id] || application.status) === 'approved' && (
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => unapproveMutation.mutate(application.id)}
                      disabled={unapproveMutation.isPending}
                    >
                      {unapproveMutation.isPending ? 'Unapproving...' : 'Unapprove'}
                    </Button>
                  )}
                  {(localApplicationStatus[application.id] || application.status) === 'rejected' && (
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => unapproveMutation.mutate(application.id)}
                      disabled={unapproveMutation.isPending}
                    >
                      {unapproveMutation.isPending ? 'Unapproving...' : 'Unapprove'}
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
});

export default AdminApplicationList;
