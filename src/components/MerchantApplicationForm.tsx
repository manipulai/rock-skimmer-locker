import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  const schema = z.object({
    name: z.string().min(1, 'Business name is required'),
    email: z.string().email('Invalid email address'),
    website: z.string().url('Invalid website URL')
  });
  
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: '',
      email: '',
      website: ''
    },
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: MerchantFormData) => {
    try {
      setIsSubmitting(true);
      console.log('Form data being submitted:', data);
      
      const result = await submitMerchantApplication(data);
      console.log('Submission successful:', result);
      
      toast.success('Application submitted successfully!');
      form.reset();
    } catch (error) {
      console.error('Detailed form submission error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error?.constructor?.name
      });
      
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      toast.error(`Failed to submit application: ${errorMessage}`);
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