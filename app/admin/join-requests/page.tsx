import { PageIntro, SiteShell } from '@/components/site-shell';
import { JawabuKenyaBanner } from '@/components/jawabu-kenya-banner';
import { createServerClient } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

export const dynamic = 'force-dynamic';

type JoinRequestRow = Database['public']['Tables']['join_requests']['Row'];

export default async function JoinRequestsPage() {
  const supabase = createServerClient();

  const { data: joinRequests, error } = await supabase
    .from('join_requests')
    .select<JoinRequestRow>('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching join requests:', error);
    return (
      <SiteShell>
        <PageIntro
          eyebrow="ERROR"
          title="Failed to load join requests"
          accent=""
          text="Could not load join requests from the database. Please try again later."
        />
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <PageIntro
        eyebrow="JOIN REQUESTS"
        title="Manage Join Requests"
        accent=""
        text="View and manage all join requests submitted through the website."
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {joinRequests?.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.phone_number || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.message || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(request.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {!joinRequests || joinRequests.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No join requests found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </SiteShell>
  );
}