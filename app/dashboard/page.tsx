'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { insforge } from '@/lib/insforge';
import { toast } from 'sonner';

interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: 'Pending' | 'Interviewing' | 'Offered' | 'Rejected' | 'Closed';
  applied_date: string;
  salary: string | null;
  notes: string | null;
  user_id: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  // Form States
  const [showModal, setShowModal] = useState(false);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState<JobApplication['status']>('Pending');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [salary, setSalary] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // 1. Fetch current user and resolve any pending OAuth callback
    insforge.auth.getCurrentUser().then(async ({ data, error }) => {
      if (error) {
        toast.error('Session error: ' + error.message);
        handleLocalSignOut();
      } else if (data?.user) {
        setUser(data.user);
        
        // Clean URL parameters from OAuth redirection (remove ?insforge_code=...)
        if (window.location.search.includes('insforge_code')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Fetch applications for this user
        fetchApplications();
      } else {
        handleLocalSignOut();
      }
    });
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await insforge.database
        .from('applications')
        .select('*')
        .order('applied_date', { ascending: false });

      if (error) {
        toast.error('Failed to load applications: ' + error.message);
      } else if (data) {
        setApplications(data as JobApplication[]);
      }
    } catch (err) {
      toast.error('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocalSignOut = () => {
    // Clear cookies and redirect to sign-in page
    document.cookie = 'insforge-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    router.replace('/sign-in');
    router.refresh();
  };

  const handleSignOut = async () => {
    try {
      await insforge.auth.signOut();
      toast.success('Signed out successfully.');
      handleLocalSignOut();
    } catch (err) {
      handleLocalSignOut();
    }
  };

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !position) {
      toast.error('Company and Position are required fields.');
      return;
    }

    setActionLoading(true);
    try {
      const { data, error } = await insforge.database
        .from('applications')
        .insert([
          {
            company,
            position,
            status,
            applied_date: appliedDate,
            salary: salary ? salary : null,
            notes: notes ? notes : null,
            user_id: user.id,
          },
        ]);

      if (error) {
        toast.error('Failed to add application: ' + error.message);
      } else {
        toast.success('Application added successfully!');
        setShowModal(false);
        // Reset form
        setCompany('');
        setPosition('');
        setStatus('Pending');
        setAppliedDate(new Date().toISOString().split('T')[0]);
        setSalary('');
        setNotes('');
        fetchApplications();
      }
    } catch (err) {
      toast.error('Failed to add application.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: JobApplication['status']) => {
    const statuses: JobApplication['status'][] = ['Pending', 'Interviewing', 'Offered', 'Rejected', 'Closed'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
      const { error } = await insforge.database
        .from('applications')
        .update({ status: nextStatus })
        .eq('id', id);

      if (error) {
        toast.error('Failed to update status: ' + error.message);
      } else {
        toast.success(`Status updated to ${nextStatus}`);
        fetchApplications();
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job application?')) return;

    try {
      const { error } = await insforge.database
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Failed to delete application: ' + error.message);
      } else {
        toast.success('Application deleted successfully.');
        fetchApplications();
      }
    } catch (err) {
      toast.error('Failed to delete application.');
    }
  };

  // Stats Calculator
  const totalApps = applications.length;
  const interviewingApps = applications.filter((app) => app.status === 'Interviewing').length;
  const offeredApps = applications.filter((app) => app.status === 'Offered').length;
  const rejectedApps = applications.filter((app) => app.status === 'Rejected').length;
  const pendingApps = applications.filter((app) => app.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-12">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/30 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/10">
              <span className="text-white text-base font-bold">A</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">ApplyForge</span>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{user.profile?.name || 'User'}</p>
                <p className="text-xs text-zinc-400">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Applications</p>
            <p className="text-3xl font-extrabold text-white mt-2">{totalApps}</p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pending</p>
            <p className="text-3xl font-extrabold text-indigo-400 mt-2">{pendingApps}</p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Interviewing</p>
            <p className="text-3xl font-extrabold text-yellow-500 mt-2">{interviewingApps}</p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Offered</p>
            <p className="text-3xl font-extrabold text-green-500 mt-2">{offeredApps}</p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 col-span-2 md:col-span-1">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Rejected</p>
            <p className="text-3xl font-extrabold text-red-500 mt-2">{rejectedApps}</p>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Application Tracker</h2>
            <p className="text-sm text-zinc-400">Keep track of your job status, salaries, dates and interview details</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/10 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Application
          </button>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-zinc-400 font-medium">Fetching job applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
            <svg className="mx-auto h-12 w-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-4 text-lg font-bold text-white">No applications yet</h3>
            <p className="mt-2 text-sm text-zinc-400 max-w-sm mx-auto">Get started by clicking the "Add Application" button to log your first opportunity.</p>
          </div>
        ) : (
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50">
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Est. Salary</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Notes</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-zinc-900/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{app.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{app.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleUpdateStatus(app.id, app.status)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                            app.status === 'Offered'
                              ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                              : app.status === 'Interviewing'
                              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20'
                              : app.status === 'Pending'
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20'
                              : app.status === 'Rejected'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                              : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20'
                          }`}
                          title="Click to cycle status"
                        >
                          {app.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                        {new Date(app.applied_date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                        {app.salary ? `$${Number(app.salary).toLocaleString()}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400 max-w-xs truncate" title={app.notes || ''}>
                        {app.notes || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button
                          onClick={() => handleUpdateStatus(app.id, app.status)}
                          className="text-zinc-400 hover:text-white transition-colors"
                          title="Cycle Status"
                        >
                          Cycle
                        </button>
                        <button
                          onClick={() => handleDeleteApplication(app.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title="Delete Application"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h3 className="text-lg font-bold text-white">New Application</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddApplication} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Position / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as JobApplication['status'])}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Applied Date
                  </label>
                  <input
                    type="date"
                    required
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Estimated Annual Salary (USD)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 120000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Notes
                </label>
                <textarea
                  placeholder="Enter details about interview rounds, key contacts, or description..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/10 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Add Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
