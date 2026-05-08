import { redirect } from 'next/navigation';

// Root page redirects to the customer home inside the (customer) route group
export default function RootPage() {
  redirect('/home');
}
