import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitMerchantApplication } from '@/lib/api';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MerchantFormData {
  name: string;
  email: string;
  website: string;
}

const MerchantApplicationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<MerchantFormData>();

  const onSubmit = async (data: MerchantFormData) => {
    try {
      setIsSubmitting(true);
      await submitMerchantApplication(data);
      toast.success('Application submitted successfully!');
      form.reset();
    } catch (error) {
      toast.error('Failed to submit application');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Rock Emporium Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contact@rockemporium.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://rockemporium.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </Form>
  );
};

export default MerchantApplicationForm;